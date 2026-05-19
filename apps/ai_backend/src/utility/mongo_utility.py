import datetime

import pymongo
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection

from src.schemas.vector_store_schema import Config, FileMetadataModel, VectorStoreInfoModel


async def fetch_previous_document_id(
    mongo_collection:AsyncIOMotorCollection,
    config: Config
) -> str | None:
    """
    This method fetches old document and returns it's id.
    if document document doesn't exist it will return None

    Args:
        mongo_collection (AsyncIOMotorCollection): _description_
        config (Config): _description_

    Returns:
        str | None: _description_
    """
    query_filter = {
        "vectorstore_collection": config.collection_name, # namespace
        "organization_id":config.organization_id,
        "intent":config.intent,
        "region_id":config.region_id,
        "branch":config.branch_id,
        "deleted": {"$ne": True}
    }
    document = await mongo_collection.find_one(
        query_filter,
        sort=[("updated_date", pymongo.DESCENDING)],
        projection={"_id": 1}
    )
    if document:
        return str(document["_id"])
    return None


async def create_new_document_file_metadata(
    mongo_collection:AsyncIOMotorCollection,
    file_metadata_list: list[FileMetadataModel],
    config: Config,
):
    vectorstore_info = VectorStoreInfoModel(
        files=file_metadata_list,
        organization_id=config.organization_id,
        uploaded_by=config.uploaded_by,
        branch=config.branch_id,
        region_id=config.region_id,
        vectorstore_collection=config.collection_name,
        intent=config.intent,
        created_date=datetime.datetime.now(datetime.UTC),
        updated_date=datetime.datetime.now(datetime.UTC),
        previous_file_id=config.old_doc_id if config.old_doc_id else "start",
        used_cloud_storage=config.cloud_storage,
        used_vector_store=config.vector_store
    )
    await mongo_collection.insert_one(vectorstore_info.model_dump())
    return


async def fetch_document_details(
    mongo_collection:AsyncIOMotorCollection,
    file_id:str
) -> dict | None:
    """
    fetch document details from file id.
    if file not found returns None

    Args:
        mongo_collection (AsyncIOMotorCollection): _description_
        file_id (str): _description_

    Returns:
        _type_: _description_
    """
    documents = await mongo_collection.find_one(
        {
            "_id": ObjectId(file_id),
            "deleted": {"$ne": True}    
        },
        sort=[("updated_date", pymongo.DESCENDING)], # fetch most recent updated document
    )
    if documents:
        return documents
    return None


async def mark_document_as_deleted(
    mongo_collection:AsyncIOMotorCollection,
    file_id:str
) -> bool:
    """
    Marks a document as deleted by setting 'deleted' to True.
    Returns True if a document was actually modified.
    Args:
        mongo_collection (AsyncIOMotorCollection): _description_
        file_id (str): _description_
    """
    result = await mongo_collection.update_one(
        {"_id": ObjectId(file_id)},
        {"$set": {"deleted": True}},   # Update: Set the 'deleted' field
    )

    return result.modified_count > 0

