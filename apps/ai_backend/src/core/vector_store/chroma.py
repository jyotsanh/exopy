import asyncio

# third-party library
from fastapi import HTTPException, status
from langchain_core.documents import Document
from loguru import logger

# custom packages
from src.config import settings
from src.schemas.vector_store_schema import Config

from .base import BaseVectorStore
from .exceptions import (
    VectorStoreImportError
)
# TODO: remove httpexception fromt his file. implement custom exception class.
class ChromaVectorStore(BaseVectorStore):

    def __init__(self, client):
        try:
            from openai import AsyncOpenAI  # for embedding
        except ImportError as err:
            raise VectorStoreImportError(
                status_code=500,
                 details={
                    "package":"milvus",
                    "install_cmd": "pip install milvus",
                    "error": str(err)
                },
                message="The 'openai' package is required but not installed."
            ) from err
        
        try:
            from chromadb.api import AsyncClientAPI
        except ImportError as err:
            raise VectorStoreImportError(
                status_code=500,
                 details={
                    "package":"milvus",
                    "install_cmd": "pip install milvus",
                    "error": str(err)
                },
                message="The 'chromadb' package is required but not installed."
            ) from err
        
        
        # The constructor just stores the connection
        self.chroma_client:AsyncClientAPI = client
        self.openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


    @classmethod
    async def create(cls):
        try:
            from chromadb import AsyncHttpClient
        except ImportError as err:
            raise VectorStoreImportError(
                status_code=500,
                 details={
                    "package":"milvus",
                    "install_cmd": "pip install milvus",
                    "error": str(err)
                },
                message="The 'chromadb' package is required but not installed."
            ) from err

        # Initialize the persistent connection here
        client = await AsyncHttpClient(
            host=settings.CHROMA_HOST,
            port=settings.CHROMA_PORT
        )

        return cls(client)


    async def embed(
        self,
        documents:list[Document],
        config: Config
    ) -> list[list[float]]:
        if config.is_hybrid:
            # TODO: return sparse dense vectors for hybrid search chroma.
            await asyncio.gather(
                self._dense_embed(documents=documents),
                self._sparse_embed(documents=documents)
            )

        else:
            return await self._dense_embed(documents=documents)


    async def _dense_embed(
        self,
        documents:list[Document]
    ) -> list[list[float]]:
        from openai import BadRequestError
        from openai.types import CreateEmbeddingResponse
        try:

            task = [
                self.openai_client.embeddings.create(
                    input=[document.page_content],
                    model=settings.OPENAI_EMBEDDING_MODEL
                )
                for document in documents
            ]
            
            results:list[CreateEmbeddingResponse] = await asyncio.gather(*task)
            dense_embeddings_lis = []
            for embed_response in results:
                raw_vector:list[float] = embed_response.data[0].embedding
                dense_embeddings_lis.append(raw_vector)
            
            return dense_embeddings_lis
        
        except BadRequestError as bad_req_error:
            logger.error(f"openai bad request error:\n{bad_req_error}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="bad request openai embedding"
            ) from bad_req_error
        # TODO: remove silen exception catching, include proper exception and raise custom exception.
        except Exception: ...


    async def  _sparse_embed(
        self,
        documents:list[Document]
    ):
        raise NotImplementedError("sparse embedding is not implemented in chroma")


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
            None : _description_
        """
        if config.is_hybrid:
            
            return await self._bulk_insert_document_for_hybrid_embed(
                config=config,
                documents=documents
            )
            
        else:
            
            return await self._bulk_insert_document_for_dense_embed(
                config=config,
                documents=documents,
            )


    async def _bulk_insert_document_for_hybrid_embed(
        self,
        documents:list[Document],
        config:Config
    ):
        raise NotImplementedError("hybrid embedding is not implemented in chroma")


    async def _bulk_insert_document_for_dense_embed(
        self,
        documents:list[Document],
        config:Config
    ):
        import uuid6
        try:
            # TODO: gather below asyncio coroutines 
            dense_embeddings_lis = await self.embed(documents=documents, config=config)
            chroma_collection = await self.chroma_client.get_or_create_collection(
                name=config.collection_name
            )

            # logger.debug(f"dense embedding:\n{self.dense_embeddings_lis}")
            ids = [str(uuid6.uuid7()) for _ in documents]
            docs = [doc.page_content for doc in documents]
            metas = [{"intent": config.intent, "is_hybrid": config.is_hybrid, "uploaded_by": config.uploaded_by} for _ in docs]
            logger.info(
                "adding document into vector store"
            )
            await chroma_collection.add(
                    ids=ids,
                    embeddings=dense_embeddings_lis,
                    documents=docs,
                    metadatas=metas
                )

        except Exception as error:
            logger.error(f"exception while inserting document in chroma:\n{error}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="error while upserting documents in vector-store"
            ) from error


    async def embed_query(self,query:str) -> list[float]:
        from openai import BadRequestError
        from openai.types import CreateEmbeddingResponse
        try:
            from openai.types import CreateEmbeddingResponse
            query_embedding:CreateEmbeddingResponse = await self.openai_client.embeddings.create(
                input=[query],
                model=settings.OPENAI_EMBEDDING_MODEL
            )
            raw_embeddings:list[float] = query_embedding.data[0].embedding
            return raw_embeddings

        except BadRequestError as bad_req_error:
            logger.error(f"openai bad request error:\n{bad_req_error}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="bad request openai embedding"
            ) from bad_req_error


    async def asimilarity_search(
            self,
            config:Config,
            query:str,
            top_k:int = 3
        ) -> list[dict]:

        if config.is_hybrid:
            return await self._asimilarity_search_hybrid(
                config=config,
                query=query,
                top_k= top_k
            )
        else:
            return await self._asimilarity_search_dense(
                config=config,
                query=query,
                top_k= top_k
            )


    async def _asimilarity_search_hybrid(
        self,
        config:Config,
        query:str,
        top_k:int = 3
    ) -> list[str]: ...


    async def _asimilarity_search_dense(
        self,
        config:Config,
        query:str,
        top_k:int = 3
    ) -> list[dict]:

        from chromadb.api.models.AsyncCollection import AsyncCollection
        from chromadb.api.types import QueryResult
        from chromadb.errors import NotFoundError, InternalError
        try:
            query_embedding: list[float]
            chroma_collection: AsyncCollection

            query_embedding, chroma_collection = await asyncio.gather(
                self.embed_query(query=query),
                self.chroma_client.get_collection(name=config.collection_name)
            )

            similarity_chunks:QueryResult = await chroma_collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k
            )
            # Flatten single-query result
            ids = similarity_chunks.get("ids", [[]])[0]
            distances = similarity_chunks.get("distances", [[]])[0]
            documents = similarity_chunks.get("documents", [[]])[0]
            metadatas = similarity_chunks.get("metadatas", [[]])[0]

            formatted = [
                {
                    "id": id_,
                    "distance": distance,
                    "metadata": metadata,
                    "document": document,
                }
                for id_, distance, metadata, document in zip(
                    ids, distances, metadatas, documents
                )
            ]
            return formatted
        except NotFoundError as error:
            logger.error(f"not found error:\n{error}")
            return [{}]

        except InternalError as c_error:
            logger.error(
                "something wrong with chroma"
                f"error:{c_error}"
                "try running chroma server again."
            )
            return [{}]

    async def create_hybrid_index(self): ...


    async def create_vector_index(self): ...


    async def delete(self, config:Config):
        """Delete the embeddings based on a where filter as intent

        Args:
            config (Config): config instance for intent, collection_name
        
        Raises:
            HTTPException: If the collection does not exist.

        Examples:
            ```python
            await vector_store_client.delete(config=Config(intent="price"))
            ```
        """
        try:
            chroma_collection = await self.chroma_client.get_collection(
                name=config.collection_name
            )
            await chroma_collection.delete(
                where={"intent": config.intent}
            )
            return True
        except ValueError as v_error:
            logger.error(
                f"error while deleting vectors with intent: {config.intent}"
                f"error: {v_error}"
            )
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="collection name doesn't exist"
            ) from v_error

        except Exception as error:
            logger.error(
                f"error while deleting vectors with intent: {config.intent}"
                f"error: {error}"
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="server error"
            ) from error
