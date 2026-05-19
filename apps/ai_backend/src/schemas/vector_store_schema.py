from datetime import datetime
from enum import StrEnum
from typing import Literal

from pydantic import BaseModel, computed_field

from .cloud_store_schema import CloudStorageType

class IntentEnum(StrEnum):
    general = "general"
    faq = "faq"
    service = "service"
    privacy_policy = "privacy_policy"
    terms_and_condition = "terms_and_condition"


class VectorStoreType(StrEnum):
    PINECONE = "pinecone"
    QDRANT = "qdrant"
    MILVUS = "milvus"
    CHROMA = "chroma"


class DataCategory(StrEnum):
    PDF = "pdf"
    TEXT = "txt"
    CSV = "csv"


class Config(BaseModel):
    organization_id:str
    region_id:str | None = None
    branch_id:str | None = None

    uploaded_by:str
    intent: IntentEnum = IntentEnum.general

    clear_old_documents:bool = False
    vector_store: VectorStoreType = VectorStoreType.PINECONE
    cloud_storage: CloudStorageType = CloudStorageType.S3
    old_doc_id: str  | None = None
    is_hybrid: bool = False

    @property
    def collection_name(self) -> str:
        # no need for @compute_field decorator, 
        # as we won't be needing collection attribute while serializing to dict.
        if self.branch_id:
            return f"general_info_{self.organization_id}_{self.branch_id}"
        elif self.region_id:
            return f"general_info_{self.organization_id}_{self.region_id}"
        else:
            return f"general_info_{self.organization_id}"


class FileMetadataModel(BaseModel):
    filename: str
    original_filename: str
    content_type: str
    cloud_storage_url: str
    upload_date: datetime


class VectorStoreInfoModel(BaseModel):
    files: list[FileMetadataModel]
    organization_id: str
    region_id: str | None = None
    branch: str | None = None
    uploaded_by: str | None=None
    vectorstore_collection: str
    intent:IntentEnum = IntentEnum.general
    deleted: bool = False
    created_date: datetime
    updated_date: datetime
    previous_file_id:str | None
    used_vector_store: VectorStoreType = VectorStoreType.PINECONE
    used_cloud_storage: CloudStorageType = CloudStorageType.S3

