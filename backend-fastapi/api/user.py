from sqlalchemy.orm         import Session, mapper
from database.models        import User
from fastapi                import HTTPException, status

def inquire_user_list(db : Session):
    print('inquire_user_list 작동')

    try:
        user_list = db.query(User.id, User.name, User.google_social_account).all()

        return user_list
    except Exception as e :
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail = "[inquire_user_list error] : " + str(e) )