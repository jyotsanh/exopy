import re
from abc import ABC, abstractmethod

from langchain_core.documents import Document

# from services._usage_service import add_usage
from src.config import logger
from src.schemas.vector_store_schema import Config
from src.services.ingestion.exception import FileServiceNotImplementedError

class BaseChunkingDocument(ABC):

    @abstractmethod
    def chunk(
        self,
        file_text:str,
        config: Config,
        openai_api_key: str | None = None,
        use_agentic_chunking:bool = False
    ) -> list[Document]: ...


class ChunkingCSVDocument(BaseChunkingDocument): ...

class ChunkingPDFDocument(BaseChunkingDocument): ...

class ChunkingTextDocument(BaseChunkingDocument):

    async def chunk(
            self,
            file_text:str,
            openai_api_key:str,
            config: Config,
            use_agentic_chunking:bool = False
        ) -> list[Document]:
        """
        used to chunk the give Text Document taking seperator as '\n\n'.

        Args:
            file_text (str): raw text of **file**
            openai_api_key (str): **client openai api key**
            config (Config): config, for org_id, reg_id & branch_id
            use_agentic_chunking (bool, optional): for **agentic** chunking. Defaults to False.

        Returns:
            list[Document]: list of Document objects
        """

        docs = []
        splitted = re.split(r'\n\n+', file_text)
        for txt_data in splitted:
            if txt_data == "\n\n" or not txt_data:
                continue
            docs.append(
                Document(
                    page_content=txt_data
                )
            )
        if not use_agentic_chunking: # no need to perform agentic chunking
            return docs

        logger.info("performing agentic chunking...")
        agent_chunks = await self._agentic_chunking(
            documents=docs,
            openai_api_key=openai_api_key,
            config=config
        )
        return agent_chunks


    async def _agentic_chunking(
            self,
            documents: list[Document],
            openai_api_key:str,
            config: Config
        ):
        raise FileServiceNotImplementedError(
            status_code=501,
            details={},
            message="Agentic Chunking is not implemented"
        )
