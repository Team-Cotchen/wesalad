from .settings           import Base    
from sqlalchemy         import Boolean, Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy_utils   import EmailType, URLType
from sqlalchemy.orm     import *

# users models
class GoogleSocialAccount(Base):
    __tablename__ = 'google_social_accounts'
    id        = Column(Integer, primary_key=True, index=True, autoincrement=True)
    sub       = Column(String(400))
    image_url = Column(String(300), nullable= True)
    email     = Column(EmailType)
    # timestamp
    created_at = Column(DateTime, default=func.utc_timestamp())
    updated_at = Column(DateTime, default=func.utc_timestamp(), onupdate=func.utc_timestamp())
    # relationship
    user = relationship("User", back_populates= 'google_social_account')

class User(Base): # paassword, is_superuser
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(120), nullable=False)
    ordinal_number = Column(Integer)
    is_active = Column(Boolean, default= True)
    is_admin = Column(Boolean, default= False)
    google_account_id = Column(Integer, ForeignKey("google_social_accounts.id"))
    # timestamp
    created_at = Column(DateTime, default=func.utc_timestamp())
    updated_at = Column(DateTime, default=func.utc_timestamp(), onupdate=func.utc_timestamp())
    # relationship
    google_social_account = relationship("GoogleSocialAccount",uselist= False ,back_populates= 'user')
    useranswer  = relationship("UserAnswer", back_populates= 'user')
    userstack   = relationship("UserStack", back_populates= 'user')
    post        = relationship("Post", back_populates='user')

class UserAnswer(Base):
    __tablename__ = "useranswers"
    id        = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id   = Column(Integer, ForeignKey("users.id"))
    answer_id = Column(Integer, ForeignKey("answers.id"))
    # timestamp
    created_at = Column(DateTime, default=func.utc_timestamp())
    updated_at = Column(DateTime, default=func.utc_timestamp(), onupdate=func.utc_timestamp())
    # relationship
    user   = relationship("User", back_populates='useranswer')
    answer = relationship("Answer", back_populates='useranswer')

class UserStack(Base):
    __tablename__ = "userstacks"
    id       = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id  = Column(Integer, ForeignKey("users.id"))
    stack_id = Column(Integer, ForeignKey("stacks.id"))
    # timestamp
    created_at = Column(DateTime, default=func.utc_timestamp())
    updated_at = Column(DateTime, default=func.utc_timestamp(), onupdate=func.utc_timestamp())
    # relationship
    user  = relationship("User", back_populates="userstack")
    stack = relationship("Stack", back_populates="userstack")

# characteristics models
class Question(Base):
    __tablename__ = "questions"
    id      = Column(Integer, primary_key=True, index=True, autoincrement=True)
    content = Column(String(300))
    # relationship
    answer = relationship("Answer", back_populates= 'question')

class Answer(Base):
    __tablename__ = "answers"
    id          = Column(Integer, primary_key=True, index=True, autoincrement=True)
    quetion_id  = Column(Integer, ForeignKey("questions.id"))
    content     = Column(String(300))
    description = Column(String(200))
    image_url   = Column(URLType)
    # relationship
    question    = relationship("Question", back_populates = 'answer')
    useranswer  = relationship("UserAnswer", back_populates ='answer')
    postanswer   = relationship("PostAnswer", back_populates ='answer')
    
class Stack(Base):
    __tablename__ = "stacks"
    id          = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title       = Column(String(100))
    description = Column(String(200))
    image_url   = Column(URLType)
    # relationship
    userstack = relationship("UserStack", back_populates="stack")
    poststack = relationship("PostStack", back_populates="stack")


# posts models
class Category(Base):
    __tablename__ = "categories"
    id      = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title   = Column(String(200))
    # relationship
    post = relationship("Post", back_populates='category')

class ApplyWay(Base):
    __tablename__ = "applyways"
    id      = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title   = Column(String(200))
    # relationship
    postapplyway = relationship("PostApplyWay", back_populates="applyway")
    
class Place(Base):
    __tablename__ = "places"
    id      = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title   = Column(String(200))
    # relationship
    postplace = relationship("PostPlace", back_populates= "place")

class Flavor(Base):
    __tablename__ = "flavors"
    id          = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title       = Column(String(200))
    description = Column(String(200))
    image_url   = Column(URLType)
    # relationship
    postflavor = relationship("PostFlavor", back_populates="flavor")
    
class Post(Base):
    __tablename__ = "posts"
    id              = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id         = Column(Integer, ForeignKey("users.id"))
    category_id     = Column(Integer, ForeignKey("categories.id"))
    title           = Column(String(200))
    number_of_front = Column(String(50))
    number_of_back  = Column(String(50))
    period          = Column(String(50))
    description     = Column(String(200), nullable=True)
    start_date      = Column(DateTime)
    status          = Column(String(50), default='active')
    # timestamp
    created_at = Column(DateTime, default=func.utc_timestamp())
    updated_at = Column(DateTime, default=func.utc_timestamp(), onupdate=func.utc_timestamp())
    # relationship
    user         = relationship("User", back_populates = 'post')
    category     = relationship("Category", back_populates ='post')
    poststack    = relationship("PostStack", back_populates = 'post')
    postanswer   = relationship("PostAnswer", back_populates = "post")
    postapplyway = relationship("PostApplyWay", back_populates = "post")
    postplace    = relationship("PostPlace", back_populates= "post")
    postflavor   = relationship("PostFlavor", back_populates = "post")

class PostAnswer(Base):
    __tablename__ = "postanswers"
    id              = Column(Integer, primary_key=True, index=True, autoincrement=True)
    post_id         = Column(Integer, ForeignKey("posts.id"))
    answer_id       = Column(Integer, ForeignKey("answers.id"))
    is_primary      = Column(Boolean, default=False)
    # timestamp
    created_at = Column(DateTime, default=func.utc_timestamp())
    updated_at = Column(DateTime, default=func.utc_timestamp(), onupdate=func.utc_timestamp())
    # relationship
    post    = relationship("Post", back_populates = "postanswer")
    answer  = relationship("Answer", back_populates = "postanswer")

class PostStack(Base):
    __tablename__ = "poststacks"
    id              = Column(Integer, primary_key=True, index=True, autoincrement=True)
    post_id         = Column(Integer, ForeignKey("posts.id"))
    stack_id        = Column(Integer, ForeignKey("stacks.id"))
    # relationship
    post    = relationship("Post", back_populates= 'poststack')
    stack   = relationship("Stack", back_populates= "poststack")

class PostApplyWay(Base):
    __tablename__ = "postapplyways"
    id              = Column(Integer, primary_key=True, index=True, autoincrement=True)
    post_id         = Column(Integer, ForeignKey("posts.id"))
    applyway_id     = Column(Integer, ForeignKey("applyways.id"))
    # relationship
    post     = relationship("Post", back_populates = 'postapplyway')
    applyway = relationship("ApplyWay", back_populates = "postapplyway")

class PostPlace(Base):
    __tablename__ = "postplaces"
    id              = Column(Integer, primary_key=True, index=True, autoincrement=True)
    post_id         = Column(Integer, ForeignKey("posts.id"))
    place_id        = Column(Integer, ForeignKey("places.id"))
    # relationship
    post    = relationship("Post", back_populates = 'postplace')
    place   = relationship("Place", back_populates = "postplace")

class PostFlavor(Base):
    __tablename__ = "postflavors"
    id              = Column(Integer, primary_key=True, index=True, autoincrement=True)
    post_id         = Column(Integer, ForeignKey("posts.id"))
    flavor_id       = Column(Integer, ForeignKey("flavors.id"))
    # timestamp
    created_at = Column(DateTime, default=func.utc_timestamp())
    updated_at = Column(DateTime, default=func.utc_timestamp(), onupdate=func.utc_timestamp())
    # relationship
    post    = relationship("Post", back_populates = 'postflavor')
    flavor  = relationship("Flavor", back_populates = 'postflavor')