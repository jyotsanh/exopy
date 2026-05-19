from typing import Annotated, Literal

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from src.core.cloud import CloudStorageDispatcher
from src.core.vector_store import VectorStoreDispatcher
from src.config import logger, settings
from src.schemas.cloud_store_schema import CloudStorageType
from src.schemas.response_schema import (
    FileDeletedResponse,
    FileUpdatedResponse,
    FileUploadResponse,
    SimilaritySearchResponse,
    VectorIndexCreatedResponse,
)
from src.schemas.vector_store_schema import (
    Config,
    VectorStoreInfoModel,
    VectorStoreType,
    IntentEnum
)
from src.services.ingestion import FileProcessingService
from src.utils.mongo_utils import (
    create_new_document_file_metadata,
    fetch_document_details,
    fetch_previous_document_id,
    mark_document_as_deleted,
)
from src.middlewares import get_mongo_database


# exception
from src.core.vector_store.exceptions import VectorStoreException
from src.core.cloud.exception import CloudStorageException
from src.services.ingestion.exception import FileServiceException

file_router = APIRouter()


@file_router.post(
    "/create/vector-store/index",
    response_model=VectorIndexCreatedResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        404: {
            "description": "when service is not not found.",
            "content": {
                "application/json": {
                    "example": {"detail": "vector index Name doesn't exist"}
                }
            },
        },
        403:{
            "description": "when api key access is forbidden.",
            "content": {
                "application/json": {
                    "example": {"detail": "service API key forbidden."}
                }
            },
        },
        503: {
            "description": "when service is down.",
            "content": {
                "application/json": {
                    "example": {"detail": "service unavailable"}
                }
            },
        },
    }
)
async def create_vector_store_index(
    created_by: str,
    vector_store_type: VectorStoreType = VectorStoreType.PINECONE,
    is_hybrid:bool = False
):
    """
    Creates a vector store index (database) for the organization’s knowledge base.

    This function initializes a new vector store index, optionally supporting hybrid
    search configurations, and returns metadata about the created index.

    ### Args
    - `vector_store_type (VectorStoreType, optional)`: Type of vector store backend to use.
    Defaults to `VectorStoreType.PINECONE`.

    ### Returns
    - `VectorIndexCreatedResponse`: Contains status of the created index, the generated
    namespace, and the vector store type used.

    ### Raises
    - `HTTPException (402)`: If an unexpected error occurs at third-party services.
    - `HTTPException (500)`: If an unexpected error occurs during index creation.
    """
    vector_inst = await VectorStoreDispatcher.dispatch(vector_store_type)
    # TODO (jyotsanh): need to handle the dummy_id.
    config = Config(
        organization_id="dummy_id",
        is_hybrid=is_hybrid, 
        uploaded_by=created_by
    )
    index_created  = await vector_inst.create_vector_index(config)
    if not index_created:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Vector Index: {settings.INDEX_NAME} already exist."
        )
    
    return VectorIndexCreatedResponse(
            status="success",
            vector_store_type=vector_store_type,
            index_name=settings.INDEX_NAME,
            index_type='hybrid' if config.is_hybrid else 'dense',
            message = f"index : {settings.INDEX_NAME} has been created",
        )


@file_router.get(
    "/vectordb/similarity/search",
    response_model=SimilaritySearchResponse
)
async def get_similarity_search(
    query:str,
    organization_id: str,
    region_id:str | None = None,
    branch:str | None = None,
    intent: IntentEnum = IntentEnum.general,
    vector_store_type: VectorStoreType = VectorStoreType.PINECONE,
    is_hybrid:bool = False,
):
    """
    Performs a *semantic similarity search* against the vector database for a specific
    organization.

    This endpoint **embeds** the input query and retrieves relevant text chunks based on
    vector similarity. It supports filtering by organization hierarchy (region, branch)
    and specific content intents (e.g., FAQ, pricing).

    ### Args
    - `query (str)`: The natural language text to search for.<br><br>
    - `organization_id (str)`: The unique identifier for the organization (tenant).<br><br>
    - `region_id (str | None, optional)`: Filter results by a specific region ID.<br><br>
    Defaults to `None` (search all regions).<br><br>
    - `branch (str | None, optional)`: Filter results by a specific branch ID.<br><br>
    Defaults to `None` (search all branches).<br><br>
    - `intent (Literal, optional)`: The category of content to target.<br><br>
    Options include `faq`, `price`, `staff`, etc. Defaults to `"Default"`.<br><br>
    - `vector_store_type (VectorStoreType, optional)`: The vector database backend to use.<br><br>
    Defaults to `VectorStoreType.PINECONE`.<br><br>
    - `is_hybrid (bool, optional)`: If `True`, performs hybrid search (combining dense <br><br>
    vector search with sparse keyword search) for better accuracy. Defaults to `False`.<br><br>

    ### Raises
    - `HTTPException`: If the vector store connection fails or parameters are invalid.

    ### Returns
    - `List[Dict[str, str]]`: A list of dictionaries where each key is a vector ID <br><br>
    and the value is the matching text chunk.

    **Example**
    ```json
    {
        "matches": [
            { "id_123": "Our evening opening hours are..." },
            { "id_456": "Our morning opening hours are..." },
        ]
    }

    """
    config = Config(
        uploaded_by="temp_not_required",
        organization_id=organization_id,
        region_id=region_id,
        branch_id=branch,
        intent=intent,
        is_hybrid=is_hybrid
    )
    vector_inst = await VectorStoreDispatcher.dispatch(vector_store_type)
    logger.info(f"dispatched: {vector_inst}")
    response = await vector_inst.asimilarity_search(
        query=query,
        config=config
    )

    return SimilaritySearchResponse(matches=response)


@file_router.delete(
    "/vectordb/delete/{id}",
    response_model=FileDeletedResponse
)
async def delete_vector_store(
    id:str,
    mongo_db:AsyncIOMotorDatabase = Depends(get_mongo_database)
):
    

    vectorstore_pinecone_collection = mongo_db["vectorstore_pinecone_collection"]
    document_detail = await fetch_document_details(
        mongo_collection=vectorstore_pinecone_collection,
        file_id=id
    )
    if not document_detail:
        logger.error(f"no document found: {id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"file id: ['{id}'] not found"
        )
    document_detail["_id"] = str(document_detail["_id"])
    document = VectorStoreInfoModel.model_validate(document_detail)

    # make enum instance
    vector_store_type = VectorStoreType(document.used_vector_store)
    # replicate the config used to make the document
    config = Config(
        organization_id=document.organization_id,
        region_id=document.region_id,
        branch_id=document.branch,
        intent=document.intent,
        uploaded_by=document.uploaded_by,
        vector_store=document.used_vector_store,
        cloud_storage=document.used_cloud_storage,
    )

    # dispatch each vector store and cloud instance
    vector_inst = await VectorStoreDispatcher.dispatch(vector_store_type)


    await vector_inst.delete(config=config) # TODO: need to write a method.
    await mark_document_as_deleted(
        mongo_collection=vectorstore_pinecone_collection,
        file_id=id
    )
    return FileDeletedResponse(
            status="complete",
            namespace=config.collection_name,
            deleted_intent=config.intent,
            vector_store_type=vector_store_type,
        )



@file_router.put(
    "/vectordb/update/{id}",
    response_model=FileUpdatedResponse
)
async def update_vector_store(
    id:str,
    file: UploadFile,
    uploaded_by:str,
    organization_id: str,
    region_id:str | None = None,
    branch:str | None = None,
    intent: IntentEnum = IntentEnum.general,
    is_hybrid:bool = False,
    vector_store_type: VectorStoreType = VectorStoreType.PINECONE,
    cloud_storage_type: CloudStorageType = CloudStorageType.S3,
    mongo_db:AsyncIOMotorDatabase = Depends(get_mongo_database)
):
    # get mongo collection
    vectorstore_pinecone_collection = mongo_db["vectorstore_pinecone_collection"]
    config = Config(
        uploaded_by=uploaded_by,
        organization_id=organization_id,
        region_id=region_id,
        branch_id=branch,
        intent=intent,
        is_hybrid=is_hybrid
    )
    logger.info("fetching previous document id....")
    config.old_doc_id =  await fetch_previous_document_id( # get old document id if exist
        mongo_collection=vectorstore_pinecone_collection,
        config=config
    )

    if not config.old_doc_id: # None when document is not found and no need to update
        logger.error(f"no old document found to update: {id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="file id not found"
        )

    vector_inst = await VectorStoreDispatcher.dispatch(vector_store_type)
    cloud_storage_inst = CloudStorageDispatcher.dispatch(cloud_storage_type)

    # remove old vectors filter by intents
    await vector_inst.delete(config=config)
    process = FileProcessingService(
        vector_store=vector_inst,
        cloud_storage=cloud_storage_inst,
        config=config
    )

    # TODO: This should use asyncio.gather() with per-file tasks.
    file_metadata_list = await process.process_files([file]) # takes list of uploadfile objects

    # set the config for storage and vector store
    config.cloud_storage = cloud_storage_type
    config.vector_store = vector_store_type


    await create_new_document_file_metadata( # create new document with all file metadata info
        mongo_collection=vectorstore_pinecone_collection,
        file_metadata_list=file_metadata_list,
        config=config,
    )
    return FileUpdatedResponse(
        status='complete',
        namespace=config.collection_name,
        vector_store_type=vector_store_type
    )


@file_router.post(
    path="/vectordb/create/file", 
    response_model=FileUploadResponse
)
async def create_knowledge_base(
    uploaded_by:str,
    organization_id: str,
    region_id:str | None = None,
    branch:str | None = None,
    intent: IntentEnum = IntentEnum.general,
    clearOldDocuments:bool = False,
    files: list[UploadFile] = File(...),
    vector_store_type: VectorStoreType = VectorStoreType.PINECONE,
    cloud_storage_type: CloudStorageType = CloudStorageType.S3,
    is_hybrid:bool = False,
    mongo_db:AsyncIOMotorDatabase = Depends(get_mongo_database)
):
    """
    Ingests documents into the organization’s knowledge base by processing uploaded files
    and optional URLs, generating **embeddings**, and storing content in the configured
    **vector store** and **cloud storage**.

    This endpoint supports intent-based categorization, organizational scoping
    (organization, region, branch), optional cleanup of previous documents, and
    hybrid search configuration.

    ### Args
    - `uploaded_by (str)`: Name or identifier of the user uploading the documents.<br><br>
    - `organization_id (str)`: Unique identifier of the organization (tenant).<br><br>
    - `region_id (str | None, optional)`: Region identifier to scope the knowledge base.<br><br>
    Defaults to `None`.<br><br>
    - `branch (str | None, optional)`: Branch identifier to scope the knowledge base.<br><br>
    Defaults to `None`.<br><br>
    - `intent (Literal, optional)`: Category of the content being ingested<br><br>
    (e.g., `faq`, `price`, `staff`, `blogs`). Defaults to `"Default"`.<br><br>
    - `clearOldDocuments (bool, optional)`: Whether to remove previously ingested<br><br>
    documents for the same scope before ingestion. Defaults to `False`.<br><br>
    - `files (list[UploadFile])`: Files to be uploaded and processed.<br><br>
    - `apiKey (str)`: API key used for request authentication.<br><br>
    - `vector_store_type (VectorStoreType, optional)`: Vector database backend to use.<br><br>
    Defaults to `VectorStoreType.PINECONE`.<br><br>
    - `cloud_storage_type (CloudStorageType, optional)`: Cloud storage provider for<br><br>
    original files. Defaults to `CloudStorageType.S3`.<br><br>
    - `is_hybrid (bool, optional)`: Enables hybrid search configuration for the<br><br>
    knowledge base. Defaults to `False`.<br><br>
    - `mongo_db (AsyncIOMotorDatabase)`: MongoDB database dependency for metadata storage.<br><br>

    ### Raises
    - `HTTPException (422)`: If no files are provided.<br><br>
    - `HTTPException (500)`: If an unexpected error occurs during file processing or ingestion.

    ### Returns
    - `FileUploadResponse`:<br><br>
    Contains ingestion status, generated namespace, and the vector store type used.
    """
    
    if not files:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="No files were provided"
        )
    

    logger.info("Dispatching vector_store & cloud_storage instance")
    vector_inst = await VectorStoreDispatcher.dispatch(vector_store_type)
    cloud_storage_inst = CloudStorageDispatcher.dispatch(cloud_storage_type)
    logger.info(
        f"\nDispatch sucessfull"
        ",using:\n"
        f"{vector_inst}\n"
        f"{cloud_storage_inst}\n"
    )

    config = Config(
        organization_id=organization_id,
        region_id=region_id,
        branch_id=branch,
        clear_old_documents=clearOldDocuments,
        intent=intent,
        uploaded_by=uploaded_by,
        is_hybrid=is_hybrid
    )

    process = FileProcessingService(
        vector_store=vector_inst,
        cloud_storage=cloud_storage_inst,
        config=config
    )

    logger.info("processing files")
    file_metadata_list = await process.process_files(files)

    vectorstore_pinecone_collection = mongo_db["vectorstore_pinecone_collection"]

    config.old_doc_id = await fetch_previous_document_id( # get previous document id if exist
        mongo_collection=vectorstore_pinecone_collection,
        config=config
    )

    # set the config for storage and vector store
    config.cloud_storage = cloud_storage_type
    config.vector_store = vector_store_type
    await create_new_document_file_metadata( # create new document with all file metadata info
        mongo_collection=vectorstore_pinecone_collection,
        file_metadata_list=file_metadata_list,
        config=config,
    )

    return FileUploadResponse(
        status='complete',
        namespace=config.collection_name,
        vector_store_type=vector_store_type
    )

