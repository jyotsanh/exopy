from abc import ABC, abstractmethod
from typing import Any

from langchain_core.documents import Document

from src.schemas.vector_store_schema import Config


class BaseVectorStore(ABC):

    @abstractmethod
    async def embed(
        self,
        documents:list[Document],
        config: Config
    ):
        """
        embeds the given list of documents into vectors.
        using attribute of config instance.

        Args:
            documents (List[Document]): documents list
        """


    @abstractmethod
    async def bulk_insert_document(
        self,
        documents:list[Document],
        config: Config
    ):
        """
        upserts all the embed documents, into vector store.
        using attribute of config instance.
        """


    @abstractmethod
    async def delete(
        self,
        config: Config
    ):
        """
        deletes all the embed documents from vector store
        using attribute of config instance.

        Args:
            config (Config): _description_
        """


    @abstractmethod
    async def create_vector_index(
        self, 
        config: Config
    ) -> bool:
        """
        this method is used to create an index in a vector-store
        using attribute '**is_hybrid**' of config instance.

        Returns:
            bool: return True if created , False if already has that index.
        """


    @abstractmethod
    async def asimilarity_search(
        self,
        query:str,
        config: Config,
        top_k:int = 3
    ) ->  list[dict]: ...