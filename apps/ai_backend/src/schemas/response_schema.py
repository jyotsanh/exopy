from typing import Literal

from pydantic import BaseModel, Field, ConfigDict

from .vector_store_schema import VectorStoreType


class FileUploadResponse(BaseModel):
    status:str
    namespace:str
    vector_store_type:VectorStoreType

class FileUpdatedResponse(BaseModel):
    status:str
    namespace:str
    vector_store_type:VectorStoreType


class FileDeletedResponse(BaseModel):
    status:str
    namespace:str
    deleted_intent:str
    vector_store_type: VectorStoreType

class VectorIndexCreatedResponse(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "status": "success",
                "vector_store_type": "pinecone",
                "index_name":"vector_db",
                "index_type":"hybrid",
                "message": "index : vector_db has been created"
            }
        }
    )
    status:Literal['success','fail']
    vector_store_type: VectorStoreType
    index_name: str
    index_type: Literal['hybrid','dense']
    message:str

class SearchMatch(BaseModel):
    id: str = Field(..., description="The unique vector ID of the matching chunk")
    text: str = Field(..., description="The text content associated with the vector")
    score:float = Field(..., description="The score how similar query is with the chunk")

class SimilaritySearchResponse(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "matches": [
                    {
                        "id": "123",
                        "text": "similarity searched chunk",
                        "score": 0.2
                    },
                    {
                        "id": "321",
                        "text": "similarity searched chunk",
                        "score": 0.1
                    }
                ]
            }
        }
    )
    matches: list[SearchMatch]


class ChatResponse(BaseModel):
    response:str
