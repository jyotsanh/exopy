from src.schemas.cloud_store_schema import CloudStorageType

from .base import BaseCloudStorage
from .gcp import GCPCloudStorage  # noqa: F401
from .s3 import S3CloudStorage
from .exception import CloudStorageNotImplementedException, CloudStorageUnsupportedType

class CloudStorageFactory:

    @staticmethod
    def from_storage_type(storage_type: CloudStorageType) -> BaseCloudStorage:

        if storage_type == CloudStorageType.S3:
            return S3CloudStorage()
        
        elif storage_type == CloudStorageType.GCP:
            raise CloudStorageNotImplementedException(
                status_code=501, # not implemented
                details={},
                message="'GCP cloud' storage is not implemented"
            )
            # return GCPCloudStorage()
        else:
            raise CloudStorageUnsupportedType(
                status_code=422, # unprocessible storage type
                details={},
                message="Unsupported Storage type"
            )


class CloudStorageDispatcher:
    factory = CloudStorageFactory()

    @classmethod
    def dispatch(cls, storage_type:CloudStorageType) -> BaseCloudStorage:
        # TODO: write down a docstring.
        clouod_storage_inst = cls.factory.from_storage_type(storage_type)
        return clouod_storage_inst
