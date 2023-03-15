from fastapi            import APIRouter, Request, Response, Header, Depends, status, Query
from sqlalchemy.orm     import Session
from database.settings  import get_db
from api.user           import inquire_user_list

router = APIRouter(
    prefix="/api/users",
    tags=["users"]
)

@router.get("/check")
async def Check():
    print('users router activate')
    return {"message" : "users router activate"}

@router.get("/list", status_code = status.HTTP_200_OK)
async def user_list(db : Session = Depends(get_db)):
    user_list = inquire_user_list(db = db)
    return {"message" : str(user_list)}