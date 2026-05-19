# std packages
import asyncio
import datetime
from typing import Any

# third-party packages
from langchain_core.documents import Document

from src.config import settings
from src.config.logging import logger
from src.schemas.vector_store_schema import Config

from .base import BaseVectorStore
from .exceptions import (
    VectorStoreAuthError,
    VectorStoreNotFoundError,
    VectorStorePermissionError,
    VectorStoreServiceError,
    VectorStoreInternalError,
    VectorStoreImportError
)


class PineconeVectorStore(BaseVectorStore):

    def __init__(self):
        try:
            from pinecone import EmbedModel
        except ImportError as err:
            raise VectorStoreImportError(
                status_code=500,
                details={
                    "package":"pinecone",
                    "install_cmd": "pip install pinecone-client",
                    "error": str(err)
                },
                message="The 'pinecone' package is required, please install pinecone package."
            ) from err

        self.INDEX_NAME = settings.INDEX_NAME
        self.PINECONE_API_KEY = settings.PINECONE_API_KEY

        self.Embed_Models = EmbedModel


    def __str__(self):
        return "'PineconeVectorStore'"


    def make_batches(
        self,
        items:list[str],
        batch_size:int=50,
        limit:int=95,
    ) -> list[list[str]]:
        """
        Splits a list of input strings into smaller batches to comply with Pinecone's
        maximum embed limit (96 items per request). If the requested batch size exceeds
        the limit, it is automatically reduced.
        ## Args:
        **items (list[str]):** _description_
        **chunk_size (int):** _description_ (optional, by default: 50),
        **limit (int):** _description_ (optional, by default: 95),

        ## Returns:
        **list[list[str]]:** _description_
        """
        if len(items)<limit:
            return [items]

        chunks = []
        for i in range(0, len(items), batch_size):
            chunks.append(items[i:i + batch_size])
        return chunks


    async def embed(
        self,
        documents:list[Document],
        config: Config
    ) -> tuple[list[list[float]], None] | tuple[list[list[float]], list[dict]] :
        """
        embeds the given list of documents into vectors.
        using attribute 'is_hybrid' of config instance.
        
        Args:
            documents (List[Document]): documents list
        
        Returns:
            tuple [dense, sparse]: tuple[dense, None] if 'is_hybrid' = False, else return tuple[dense, sparse]
        """

        if config.is_hybrid:
            dense, sparse = await asyncio.gather(
                self._dense_embed(documents=documents),
                self._sparse_embed(documents=documents)
            )
            return (dense, sparse)

        else:
            dense = await self._dense_embed(documents=documents)
            return (dense, None)


    async def _dense_embed(
        self,
        documents:list[Document]
    ) -> list[list[float]]:
        """
        embeds the given list of documents.
        this method set the batch_embeddings_list & batch_documents_lis for upserting documents.

        Args:
            documents (List[Document]): _description_
        """
        try:
            from pinecone import PineconeAsyncio, EmbeddingsList
        except ImportError as error:
            raise VectorStoreImportError(
                status_code=500,
                details={
                    "package":"pinecone",
                    "install_cmd": "pip install pinecone-client",
                    "error": str(error)
                },
                message="The 'pinecone' package is required, please install pinecone package."
            ) from error
        _docs = [doc.page_content for doc in documents]
        input_batches = self.make_batches(items=_docs)
        logger.info("start dense embedding process.")

        async with PineconeAsyncio(api_key=self.PINECONE_API_KEY) as pc:
            # Convert the chunk_text into sparse vectors
            tasks = [ # creates a coroutines for each batch
                    pc.inference.embed(
                    model= self.Embed_Models.Multilingual_E5_Large,
                    inputs=batch,
                    parameters={"input_type": "passage", "truncate": "END"}
                )
                for batch in input_batches
            ]
            # run all batch request at once.
            results:list[EmbeddingsList] = await asyncio.gather(*tasks)
            logger.info("dense embed complete..")
        
        embeddings:list[list[float]] = [
            item["values"]
            for batch in results
            for item in batch
        ]
        return embeddings


    async def _sparse_embed(
        self,
        documents:list[Document]
    ) -> list[dict[str, list]]:
        """
        embeds the given list of documents into sparse embed
        this method set the sparse_embeddings_lis & batch_documents_lis for upserting documents.

        Args:
            documents (List[Document]): _description_
        """
        from pinecone import PineconeAsyncio, SparseValues
        _docs = [doc.page_content for doc in documents]
        input_batches = self.make_batches(items=_docs)
        logger.info("start sparse embedding process.")

        async with PineconeAsyncio(api_key=self.PINECONE_API_KEY) as pc:
            # Convert the chunk_text into dense vectors
            tasks = [ # creates a coroutines for each batch
                    pc.inference.embed(
                    model= self.Embed_Models.Pinecone_Sparse_English_V0,
                    inputs=batch,
                    parameters={"input_type": "passage", "truncate": "END"}
                )
                for batch in input_batches
            ]
            # run each coroutines asynchronously
            results = await asyncio.gather(*tasks)

            logger.info("sparse embed complete...")
        
        sparse_embeddings = [
            {
                "indices": item["sparse_indices"],
                "values": item["sparse_values"]
            }
            for batch in results
            for item in batch
        ]
        return sparse_embeddings


    async def asimilarity_search(
        self,
        query: str,
        config: Config,
        top_k:int = 3,
    ) -> list[dict[str, Any]]:
        """performs asynchronous similarity search

        Args:
            query (str): user raw query.
            config (Config): config instance for intent, collection_name.
            top_k (int): number of top chunks.
        
        Returns:
            similary  chunks: List[dict[str, Any]]

        Raises:
            VectorStoreNotFoundError (404): If the namespace or index does not exist.
            VectorStorePermissionError (403): forbidden api key lacks acess.
            VectorStoreServiceError (503): pinecone service is down.
            VectorStoreInternalError (500): internal server error.
        
        """
        try:
            from pinecone.exceptions import ForbiddenException, NotFoundException, ServiceException

            if config.is_hybrid: # for hybrid search
                logger.info("hybrid search initiating...")
                return await self._asimilarity_search_hybrid(
                    config=config,
                    query=query
                )

            else: # for dense  search
                logger.info("dense search initiating....")
                return await self._asimilarity_search_dense(
                    config=config,
                    query=query
                )
        
        except NotFoundException as e: # when pinecone index is not initialized
            logger.error(f"pinecone namepspace doesn't exist:\n{e}\n")
            raise VectorStoreNotFoundError(
                status_code=404,
                details={},
                message="Index name doesn't exist"
            ) from e

        except ForbiddenException as e: # when pinecone api key is wrong
            logger.error(f"pinecone api key error :\n{e}\n")
            raise VectorStorePermissionError(
                status_code=403, # forbidden
                details={},
                message="Pinecone API key lacks permission"
            ) from e
        
        except ServiceException as e:
            logger.error(f"pinecone server down:\n{e}\n")
            raise VectorStoreServiceError(
                status_code=503, # service unavailble.
                details={},
                message="Pinecone service failure"
            ) from e

        except Exception as error:
            logger.error(f"Internal vector store error:\n{error}\n")
            raise VectorStoreInternalError(
                status_code=500,
                details={},
                message="Unexpected vector store error"
            ) from error


    async def _asimilarity_search_hybrid(
        self,
        query,
        config:Config,
    ):
        from pinecone import EmbedModel, PineconeAsyncio
        from pinecone.db_data.dataclasses import QueryResponse

        async with PineconeAsyncio(api_key=self.PINECONE_API_KEY) as pc:
            description = await pc.describe_index(name=self.INDEX_NAME)
            host_url = description["host"] # host url of pinecone

            dense_embed_task = pc.inference.embed(
                model=EmbedModel.Multilingual_E5_Large,
                inputs=query,
                parameters={"input_type": "query", "truncate": "END"}
            )
            sparse_embed_task = pc.inference.embed(
                model=EmbedModel.Pinecone_Sparse_English_V0,
                inputs=query,
                parameters={"input_type": "query", "truncate": "END"}
            )
            task = [dense_embed_task, sparse_embed_task]

            logger.info("running both embedd asynchronously")
            dense_embed, sparse_embed = await asyncio.gather(*task)

            for d, s in zip(dense_embed, sparse_embed, strict=True):
                logger.info("similarity search in process...")

                async with pc.IndexAsyncio(host=host_url) as idx:

                    query_response:QueryResponse = await idx.query(
                        namespace=config.collection_name,
                        top_k=5,
                        vector=d['values'],
                        sparse_vector={
                            'indices': s['sparse_indices'],
                            'values': s['sparse_values']
                        },
                        include_values=False,
                        include_metadata=True
                    )
                    logger.info("hybrid search complete....")

                    matches = query_response.get("matches", [])
                    # logger.info(f"response: {query_response}")

                    # Initialize a list to hold the dictionaries
                    formatted_results = []

                    for match in matches:
                        # Extract the ID of the vector
                        match_id = match.get("id")

                        # Extract the text content, defaulting to empty string if missing
                        text_content = match.get("metadata", {}).get("text", "")
                        # Extract the score of content,
                        score = match.get("score", 0)
                        # Create the dict { "id_value": "text_value" } and append to list
                        formatted_results.append(
                            {
                                "id": match_id,
                                "text": text_content,
                                "score": score
                            }
                        )

                    return formatted_results


    async def _asimilarity_search_dense(
        self,
        query,
        config:Config,
    ):
        from pinecone import EmbedModel, PineconeAsyncio
        from pinecone.db_data.dataclasses import QueryResponse

        async with PineconeAsyncio(api_key=self.PINECONE_API_KEY) as pc:
            description = await pc.describe_index(name=self.INDEX_NAME)
            host_url = description["host"] # host url of pinecone

            logger.info("running embedder")
            dense_embed = await pc.inference.embed(
                model=EmbedModel.Multilingual_E5_Large,
                inputs=query,
                parameters={"input_type": "query", "truncate": "END"}
            )

            for d in dense_embed:
                logger.info("dense search in progress...")
                async with pc.IndexAsyncio(host=host_url) as idx:
                    query_response:QueryResponse = await idx.query(
                        namespace=config.collection_name,
                        vector=d['values'],
                        top_k=5,
                        include_metadata=True,
                        include_values=False
                    )
                    logger.info("denser search complete..")
                    matches = query_response.get("matches", [])
                    # logger.info(f"response: {query_response}")

                    # Initialize a list to hold the dictionaries
                    formatted_results = []

                    for match in matches:
                        # Extract the ID of the vector
                        match_id = match.get("id")

                        # Extract the text content, defaulting to empty string if missing
                        text_content = match.get("metadata", {}).get("text", "")

                        # Extract the score of content,
                        score = match.get("score", 0)
                        # Create the dict { "id_value": "text_value" } and append to list
                        formatted_results.append(
                            {
                                "id": match_id,
                                "text": text_content,
                                "score": score
                            }
                        )

                    return formatted_results


    async def insert_document(self): ...


    async def bulk_insert_document(
        self,
        documents:list[Document],
        config: Config
    ):
        """
        upserts all the embed documents, into vector store

        Args:
            config (Config): Configuration object containing org details.

        Raises:
            HTTPException: 503 service unavailable
            HTTPException: 404 not found
            HTTPException: 403 forbidden
            HTTPException: 500 internal server error

        Returns:
            _type_: _description_
        """
        from pinecone.exceptions import ForbiddenException, NotFoundException, ServiceException, UnauthorizedException

        try:
            if config.is_hybrid:
                await self._bulk_insert_document_for_hybrid_embed(
                    config=config,
                    documents_list=documents
                )
            else:
                await self._bulk_insert_document_for_dense_embed(
                    config=config,
                    documents_list=documents
                )
                
        except NotFoundException as e: # when pinecone index is not initialized
            logger.error(f"pinecone index doesn't exist:\n{e}\n")
            raise VectorStoreNotFoundError(
                status_code=404,
                details={},
                message="Index name doesn't exist"
            ) from e

        except ForbiddenException as e: # when pinecone api key is wrong
            logger.error(f"pinecone api key error :\n{e}\n")
            raise VectorStorePermissionError(
                status_code=403, # forbidden
                details={},
                message="Pinecone API key lacks permission"
            ) from e
        
        except ServiceException as e:
            logger.error(f"pinecone server down:\n{e}\n")
            raise VectorStoreServiceError(
                status_code=503, # service unavailble.
                details={},
                message="Pinecone service failure"
            ) from e

        except UnauthorizedException as u_error:
            logger.error(f"pinecone server down:\n{u_error}\n")
            raise VectorStoreAuthError(
                status_code=401,
                details={},
                message="Invalid Pinecone API Key"
            ) from u_error

        except Exception as error:
            logger.error(f"Internal vector store error:\n{error}\n")
            raise VectorStoreInternalError(
                status_code=500,
                details={},
                message="Unexpected vector store error"
            ) from error



    async def _bulk_insert_document_for_dense_embed(
        self,
        config: Config,
        documents_list:list[Document]
    ):
        """
        upserts all the embed documents, into vector store

        Args:
            config (Config): Configuration object containing org details.

        Returns:
            _type_: _description_
        """
        from pinecone import PineconeAsyncio
        
        dense_embeddings_lis, _ = await self.embed(documents=documents_list, config=config)

        async with PineconeAsyncio(api_key=self.PINECONE_API_KEY) as pc:

            description = await pc.describe_index(name=self.INDEX_NAME)
            host_url = description["host"] # host url of pinecone

            async with pc.IndexAsyncio(host=host_url) as idx:

                ts = datetime.datetime.now(datetime.UTC).strftime("%Y%m%d%H%M%S%f")
                input_vectors = [
                    {
                        "id": f"{config.collection_name}_{config.intent}_{ts}_item[{i}]",
                        "values": dense_embeddings,
                        "metadata": {
                            "text": document.page_content,
                            "intent": config.intent
                            }
                    }
                    for i, (dense_embeddings, document) in enumerate(
                        zip(dense_embeddings_lis, documents_list, strict=True),
                        start=1
                    )
                ]

                logger.info(f"starting upserting documents at {self}, type: dense")
                await idx.upsert(
                    namespace=config.collection_name,
                    vectors=input_vectors,
                )
                logger.info("upsert document complete...")
        return

    async def _bulk_insert_document_for_hybrid_embed(
            self, 
            config:Config,
            documents_list:list[Document]
        ):
        """
        upserts all the embed documents, into vector store

        Args:
            config (Config): Configuration object containing org details.
        Returns:
            _type_: _description_
        """
        from pinecone import PineconeAsyncio
        
        dense_embeddings_list, sparse_embeddings_list = await  self.embed(config=config, documents=documents_list)
        
        async with PineconeAsyncio(api_key=self.PINECONE_API_KEY) as pc:

            description = await pc.describe_index(name=self.INDEX_NAME)
            host_url = description["host"] # host url of pinecone

            async with pc.IndexAsyncio(host=host_url) as idx:
                ts = datetime.datetime.now(datetime.UTC).strftime("%Y%m%d%H%M%S%f")
            
                input_vectors = [
                    {
                        "id": f"{config.collection_name}_{config.intent}_{ts}_item[{itm_idx}]",
                        "values": dense_embeddings,
                        "sparse_values": {
                            'indices': sparse_embeddings['indices'],
                            'values': sparse_embeddings['values']
                        },
                        "metadata": {
                            "text": document.page_content,
                            "intent": config.intent
                        }
                    }
                    for itm_idx, (dense_embeddings, sparse_embeddings, document) in enumerate(
                        zip(dense_embeddings_list, sparse_embeddings_list, documents_list, strict=True),
                        start=1
                    )
                ]
                logger.info(f"starting upserting documents at {self}, type: hybrid")
                
                await idx.upsert(
                    namespace=config.collection_name,
                    vectors=input_vectors,
                )
                
                logger.info("upsert document complete...")
        return


    async def delete(
        self,
        config: Config
    ):
        """
        deletes all the embed documents from vector store

        Args:
            config (Config): _description_
        """
        try:
            from pinecone import PineconeAsyncio
            from pinecone.exceptions import ForbiddenException, NotFoundException, ServiceException
            async with PineconeAsyncio(api_key=settings.PINECONE_API_KEY) as pc:
                logger.info(
                    f"\ndeleting documents with intents: {config.intent}",
                    f"\nfor namespace: {config.collection_name}"
                )
                description = await pc.describe_index(name=self.INDEX_NAME)
                host_url = description["host"] # host url of pinecone

                async with pc.IndexAsyncio(host=host_url) as idx:
                    await idx.delete(
                        filter={'intent': config.intent},
                        namespace=config.collection_name
                    )
            logger.info("\ndelete complete")
            return

        except NotFoundException as e: # when pinecone index is not initialized
            logger.error(f"pinecone namepspace doesn't exist:\n{e}\n")
            raise VectorStoreNotFoundError(
                status_code=404,
                details={},
                message="Index name doesn't exist"
            ) from e

        except ForbiddenException as e: # when pinecone api key is wrong
            logger.error(f"pinecone api key error :\n{e}\n")
            raise VectorStorePermissionError(
                status_code=403, # forbidden
                details={},
                message="Pinecone API key lacks permission"
            ) from e
        
        except ServiceException as e:
            logger.error(f"pinecone server down:\n{e}\n")
            raise VectorStoreServiceError(
                status_code=503, # service unavailble.
                details={},
                message="Pinecone service failure"
            ) from e

        except Exception as error:
            logger.error(f"Internal vector store error:\n{error}\n")
            raise VectorStoreInternalError(
                status_code=500,
                details={},
                message="Unexpected vector store error"
            ) from error


    async def create_vector_index(
        self,
        config: Config
    ):
        """
        this method is used to create an index in a vector-store
        using attribute '**is_hybrid**' of config instance.

        Returns:
            bool: return True if created , False if already has that index.
        
        Raises:
            VectorStoreNotFoundError: _description_
            VectorStorePermissionError: _description_
            VectorStoreServiceError: _description_
            VectorStoreInternalError: _description_
        """
        # TODO (jyotsanh): both below methods are checking if index exist or not. implement DRY principle.
        from pinecone.exceptions import (
                ForbiddenException, 
                NotFoundException, 
                ServiceException, 
                UnauthorizedException
            )
        try:
            
            if config.is_hybrid:
                return await self._create_hybrid_index()
            
            return await self._create_index()
        
        except NotFoundException as e: # when pinecone index is not initialized
            logger.error(f"pinecone namepspace doesn't exist:\n{e}\n")
            raise VectorStoreNotFoundError(
                status_code=404,
                details={},
                message="Index name doesn't exist"
            ) from e

        except ForbiddenException as e: # when pinecone api key is wrong
            logger.error(f"pinecone api key error :\n{e}\n")
            raise VectorStorePermissionError(
                status_code=403, # forbidden
                details={},
                message="Pinecone API key lacks permission"
            ) from e
        
        except ServiceException as e:
            logger.error(f"pinecone server down:\n{e}\n")
            raise VectorStoreServiceError(
                status_code=503, # service unavailble.
                details={},
                message="Pinecone service failure"
            ) from e

        except Exception as error:
            logger.error(f"Internal vector store error:\n{error}\n")
            raise VectorStoreInternalError(
                status_code=500,
                details={},
                message="Unexpected vector store error"
            ) from error


    async def _create_index(self) -> bool:
        
        from pinecone import (
                AwsRegion,
                CloudProvider,
                EmbedModel,
                IndexEmbed,
                Metric,
                PineconeAsyncio,
            )
            
        async with PineconeAsyncio(api_key=settings.PINECONE_API_KEY) as pc:
            has_index = await pc.has_index(settings.INDEX_NAME)
            if not has_index:
                await pc.create_index_for_model(
                    name=settings.INDEX_NAME,
                    cloud=CloudProvider.AWS,
                    region=AwsRegion.US_EAST_1,
                    embed=IndexEmbed(
                        model=EmbedModel.Multilingual_E5_Large,
                        metric=Metric.COSINE,
                        field_map={
                            "text": "description",
                        },
                    )
                )
                return True
            else:
                return False
            
        
    async def _create_hybrid_index(self):
        """
        creates pinecone hybrid index.

        Raises:
            VectorStoreNotFoundError: _description_
            VectorStorePermissionError: _description_
            VectorStoreServiceError: _description_
            VectorStoreInternalError: _description_

        Returns:
            _type_: _description_
        """

        from pinecone import (
            AwsRegion,
            CloudProvider,
            Metric,
            PineconeAsyncio,
            ServerlessSpec,
            VectorType,
        )
        
        async with PineconeAsyncio(api_key=settings.PINECONE_API_KEY) as pc:
            has_index = await pc.has_index(settings.INDEX_NAME)
            if not has_index:
                await pc.create_index(
                    name=settings.INDEX_NAME,
                    vector_type=VectorType.DENSE,
                    dimension=1024,
                    metric=Metric.DOTPRODUCT,
                    spec=ServerlessSpec(
                        cloud=CloudProvider.AWS,
                        region=AwsRegion.US_EAST_1
                    )
                )
                return True
            else:
                return False
            

    async def create_with_strategy(self): ...