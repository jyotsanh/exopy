
from pydantic import BaseModel, Field, ConfigDict



class ChatRequest(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "query": "Hi",
                "sender_id": "unique_id"
            }
        }
    )
    query: str 
    sender_id: str
