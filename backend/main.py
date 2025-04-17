from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
origins = [
    # Add your frontend origin here for development, e.g., "http://localhost:5173"
    # Add your deployed frontend URL for production
    "*", # Allowing all origins for simplicity, adjust as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EchoItem(BaseModel):
    message: str

@app.post("/api/echo")
def echo_message(item: EchoItem):
    return {"echo": item.message}

@app.get("/api/ping")
def ping():
    return {"message": "pong"}

# Optional: Add a root endpoint for basic check
@app.get("/")
def read_root():
    return {"Hello": "World"} 