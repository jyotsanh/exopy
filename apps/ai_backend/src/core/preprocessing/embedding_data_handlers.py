from abc import ABC, abstractmethod

from langchain_core.documents import Document

from src.core.vector_store.base import BaseVectorStore
from src.schemas.vector_store_schema import Config


class BaseEmbedDocument(ABC):

    @abstractmethod
    async def upsert(
        self,
        documents:list[Document],
        vector_store: BaseVectorStore,
        config: Config
    ):
        """
        uploads the given documents into vector store by following process
            1. **embed** given list of documents.
            2. **bulk_insert_document** inserts all the embeddded documents into vector store.

        Args:
            documents (list[Document]): _description_
            vector_store (BaseVectorStore): _description_
            config (Config): _description_
        """


class EmbeddingPDFDocument(BaseEmbedDocument):

    async def upsert(
        self,
        documents:list[Document],
        vector_store: BaseVectorStore,
        config: Config
    ): ...

class EmbeddingTextDocument(BaseEmbedDocument):
    async def upsert(
        self,
        documents:list[Document],
        vector_store: BaseVectorStore,
        config: Config
    ):
        """
        uploads the given documents into vector store by following process
            1. **embed** given list of documents.
            2. **bulk_insert_document** inserts all the embeddded documents into vector store.

        Args:
            documents (list[Document]): _description_
            vector_store (BaseVectorStore): _description_
            config (Config): _description_
        """
        if config.clear_old_documents:
            await vector_store.delete(config=config)
        # await vector_store.embed(documents, config) # embed documents
        await vector_store.bulk_insert_document(config=config, documents=documents)



class EmbeddingCSVDocument(BaseEmbedDocument):
    async def upsert(
        self,
        documents:list[Document],
        vector_store: BaseVectorStore,
        config: Config
    ): ...
