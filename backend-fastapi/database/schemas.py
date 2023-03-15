from pydantic import BaseModel

class ModifyPost(BaseModel):
    title : str 
    description : str