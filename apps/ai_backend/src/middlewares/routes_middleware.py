from fastapi import Request

def get_mongo_database(request: Request):
    return request.app.state.mongo_db