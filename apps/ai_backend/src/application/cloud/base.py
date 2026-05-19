from abc import ABC, abstractmethod

from fastapi import UploadFile


class BaseCloudStorage(ABC):

    def __str__(self):
        return "'BaseCloudStorage'"
    
    
    @abstractmethod
    async def upload(
        self,
        uploaded_file: UploadFile,
        organization_id:str,
    ):
        """
        this method is used to upload file in our cloub storage , returns the public url

        Args:
            uploaded_file (UploadFile): uploaded file instance from fastapi **UploadFile**
            organization_id (str): organization id of the client
        """

    @abstractmethod
    async def delete(self): ...
