from src.core.preprocessing.chunking_data_handlers import (
    BaseChunkingDocument,
    ChunkingCSVDocument,
    ChunkingPDFDocument,
    ChunkingTextDocument,
)
from src.core.preprocessing.cleaning_data_handlers import (
    BaseCleanDocument,
    CleaningCSVDocument, # TODO
    CleaningPDFDocument, # TODO
    CleaningTextDocument,
)
from src.core.preprocessing.embedding_data_handlers import (
    BaseEmbedDocument,
    EmbeddingCSVDocument,
    EmbeddingPDFDocument,
    EmbeddingTextDocument,
)
from src.schemas.vector_store_schema import DataCategory
from src.services.ingestion.exception import FileUnSupportedTypeException

# cleaning handlers and dispatchers
class CleaningHandlerFactory:
    @staticmethod
    def create_handler(data_category:DataCategory) -> BaseCleanDocument:

        if data_category == DataCategory.TEXT:
            return CleaningTextDocument()

        elif data_category == DataCategory.PDF:
            raise FileUnSupportedTypeException(
                status_code=501, # not implented https status code
                details={},
                message="Cleaning PDF File is not supported"
            )

        elif data_category == DataCategory.CSV:
            raise FileUnSupportedTypeException(
                status_code=501, # not implented https status code
                message="Cleaning CSV File is not implemented"
            )

        else:
            raise FileUnSupportedTypeException(
                status_code=422,
                details={},
                message="Unsupported Data type"
            )


class CleaningDispatcher:
    handler = CleaningHandlerFactory

    @classmethod
    def dispatch(cls, data_category: DataCategory) -> BaseCleanDocument:
        clean_inst = cls.handler.create_handler(data_category)
        return clean_inst


# chunking handlers and dispatchers
class ChunkingDataHandlerFactory:

    @staticmethod
    def create_handler(data_category: DataCategory) -> BaseChunkingDocument:
        if data_category == DataCategory.TEXT:
            return ChunkingTextDocument()

        elif data_category == DataCategory.PDF:
            return ChunkingPDFDocument()

        elif data_category == DataCategory.CSV:
            return ChunkingCSVDocument()

        else:
            raise FileUnSupportedTypeException(
                status_code=422,
                details={},
                message="Unsupported Data type"
            )

class ChunkingDispatcher:
    handler = ChunkingDataHandlerFactory

    @classmethod
    def dispatch(cls, data_category: DataCategory) -> BaseChunkingDocument:
        chunk_inst = cls.handler.create_handler(data_category)
        return chunk_inst


# embedding handlers and dispatchers
class EmbeddingDataHandlerFactory:
    @staticmethod
    def create_handler(data_category: DataCategory) -> BaseEmbedDocument:

        if data_category == DataCategory.TEXT:
            return EmbeddingTextDocument()

        elif data_category == DataCategory.PDF:
            return EmbeddingPDFDocument()

        elif data_category == DataCategory.CSV:
            return EmbeddingCSVDocument()

        else:
            raise FileUnSupportedTypeException(
                status_code=422,
                details={},
                message="Unsupported Data type"
            )

class EmbeddingDispatcher:
    handler = EmbeddingDataHandlerFactory()

    @classmethod
    def dispatch(cls, data_category: DataCategory) -> BaseEmbedDocument:
        embed_inst  = cls.handler.create_handler(data_category)
        return embed_inst
