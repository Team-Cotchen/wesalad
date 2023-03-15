import os

from fastapi                    import HTTPException, status
from dotenv                     import load_dotenv
from sqlalchemy                 import create_engine
from sqlalchemy.orm             import sessionmaker, registry
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.exc             import DatabaseError

load_dotenv()
DB_USERNAME = os.getenv("DB_USERNAME")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST     = os.getenv("DB_HOST")
DB_PORT     = os.getenv("DB_PORT")
DB_DATABASE = os.getenv("DB_DATABASE")

DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_DATABASE}"

Base = declarative_base()
mapper_registry = registry()

Engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=Engine)


def get_db():
    db = None
    db = SessionLocal()
    try: 
        yield db
    except DatabaseError:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail = "[Database error]"  )
    finally:
        if db is not None:
            db.close()
mapper_registry.configure()