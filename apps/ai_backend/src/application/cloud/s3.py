import uuid

from fastapi import UploadFile

from src.config import settings

from .base import BaseCloudStorage
from .exception import CloudStorageImportError

class S3CloudStorage(BaseCloudStorage):

    def __init__(self):
        try:
            import boto3
        except ImportError as err:
            raise CloudStorageImportError(
                status_code=500,
                details={},
                message="The 'boto3' package is required but not installed"
            ) from err
        self.aws_client = boto3.client(
                's3',
                aws_access_key_id = settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key = settings.AWS_SECRET_ACCESS_KEY
            )

    def __str__(self):
        return "'S3CloudStorage'"


    async def upload(
        self,
        uploaded_file: UploadFile,
        organization_id:str,
    ) -> tuple[str, str]:
        """
        this method is used to upload file in our cloub storage , returns the public url

        Args:
            uploaded_file (UploadFile): uploaded file instance from fastapi **UploadFile**
            organization_id (str): organization id of the client
        Returns:
            s3_url: str
            unique_filename: str
        """
        unique_filename = f"{organization_id}_{uuid.uuid4()}_{uploaded_file.filename}"
        _ = await uploaded_file.read()
        # TODO (jyotsanh): implement S3 uploader.
        # with io.BytesIO(contents) as file_content:
        #     self.aws_client.upload_fileobj(file_content)
        s3_url = f"https://{settings.BUCKET_NAME}.s3.amazonaws.com/{unique_filename}"
        return (s3_url, unique_filename)

    async def delete(self): ...
