from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, posts

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods= ["*"],
    allow_headers = ["*"]
)

app.include_router(users.router)
app.include_router(posts.router)


@app.get("/check")
def read_root():
    return {"Hellow" : "wesalad ver.2"}

