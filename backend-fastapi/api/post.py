from sqlalchemy.orm         import Session, mapper, joinedload
from database.models        import Post
from fastapi                import HTTPException, status

def post_info(db : Session, post_id):
    post = db.query(Post).options(
            joinedload(Post.poststack), 
            joinedload(Post.postanswer),
            joinedload(Post.postapplyway),
            joinedload(Post.postplace),
            joinedload(Post.postflavor)
            ).filter(Post.id == post_id).first()
    
    info_dict = {
        'id'        : post.id,
        'user_id'   : post.user_id,
        'title'     : post.title,
        'nof'       : post.number_of_front,
        'nob'       : post.number_of_back,
        'period'    : post.period,
        'desc'      : post.description,
        'start_date': post.start_date,
        'status'    : post.status,
        'category'  : post.category.title,
        'poststack' : post.poststack,
        'postanswer': post.postanswer,
        'postapplyway' : post.postapplyway,
        'postplace' : post.postplace,
        'postflavor': post.postflavor
    }

    return info_dict

def post_modify(db : Session, post_id, input_data):
    try:
        target_post = db.query(Post).filter(Post.id == post_id).first()   
        target_post.title = input_data.title
        target_post.description = input_data.description
        db.commit()
    
    except Exception as e:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail = "[post_modify error] : " + str(e) )
    
    