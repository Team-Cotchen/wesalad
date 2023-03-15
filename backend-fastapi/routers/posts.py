from fastapi            import APIRouter, Request, Response, Header, Depends, status, Query
from sqlalchemy.orm     import Session
from database.settings  import get_db
from api.post           import post_info, post_modify
from database.schemas   import ModifyPost

router = APIRouter(prefix="/api/posts", tags=["posts"])

@router.get("/check")
async def Check():
    print('posts router activate')
    return {"message" : "posts router activate"}

@router.get("/{post_id}", status_code= status.HTTP_200_OK)
async def get_post(request : Request, post_id : int, db : Session = Depends(get_db)):
    info = post_info(db= db, post_id= post_id) 
    return {"message" : info}

@router.post("/modify/{post_id}", status_code= status.HTTP_200_OK)
async def modify_post(post_id : int, db : Session = Depends(get_db), input_data : ModifyPost = Request.body):
    post_modify(db= db, post_id= post_id, input_data= input_data)
    return {"message" : "The post has been updated."}

