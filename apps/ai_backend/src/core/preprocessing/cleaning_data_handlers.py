from abc import ABC, abstractmethod

from fastapi import UploadFile, status
from src.services.ingestion.exception import FileEmptyException

class BaseCleanDocument(ABC):

    @abstractmethod
    async def clean(self) -> str: ...

class CleaningPDFDocument(BaseCleanDocument): ...

class CleaningTextDocument(BaseCleanDocument):
    # TODO: . After the first read, the file pointer is at EOF. push pointer to SOF.
    async def clean(self,file:UploadFile) -> str:
        file_contents = await file.read()
        file_text = file_contents.decode("utf-8")
        if not file_text:
            raise FileEmptyException(
                    status_code=422,
                    details={},
                    message=("Unable to extract text from the uploaded document."
                    "Please provide a valid file.")
                )
            
        return file_text

class CleaningCSVDocument(BaseCleanDocument): ...
