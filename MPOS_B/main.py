import os
import jwt
import urllib
import psycopg2
import uvicorn
import string
import traceback
from fastapi import FastAPI, Depends, HTTPException, status, Response, Cookie, Request
from Auth import SECRET_KEY, ALGORITHM, load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from psycopg2.extras import RealDictCursor
from psycopg2.errors import UniqueViolation
from datetime import datetime, timedelta, timezone

app = FastAPI()
load_dotenv()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


def get_db_connection():
    db_host = os.getenv("DB_HOST").strip()
    db_port = os.getenv("DB_PORT").strip()
    db_name = os.getenv("DB_NAME").strip()
    db_user = os.getenv("DB_USER").strip()
    db_password = os.getenv("DB_PASSWORD", "").strip()
    encoded_user = urllib.parse.quote_plus(db_user)
    encoded_password = urllib.parse.quote_plus(db_password)

    connection_uri = f"postgresql://{encoded_user}:{encoded_password}@{db_host}:{db_port}/{db_name}?sslmode=require"
    try:
        print(f"DEBUG: Connecting to host={db_host}, user={db_user}")
        print(f"DEBUG: Is password present? {'YES' if db_password else 'NO'}")
        connection = connection = psycopg2.connect(
            host=db_host,
            port=db_port,
            dbname=db_name,
            user=db_user,
            password=db_password,
            sslmode="require",
            cursor_factory=RealDictCursor
        )
        return connection
    except Exception as e:
        print(f"Database connection failed: {e}")
        raise e
    
@app.post('/api/v1/auth/login')
def login(payload: dict,response: Response,db: psycopg2.extensions.connection = Depends(get_db_connection),):
    try:
        email = payload.get("email").lower().strip()
        password = payload.get("password").strip()
        print(email,password)
        with db.cursor() as cursor:
            cursor.execute( "SELECT * FROM user_data WHERE user_email=%s AND user_password=%s", (email, password))
            user = cursor.fetchone()
            cursor.close()
        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )
        token = create_jwt_token(user_email=email, user_name=user["user_name"],user_role=user["user_role"],otp=None)
        return {"Authenticated": True, "Token" : token}

    except Exception:
        traceback.print_exc()
        raise

def create_jwt_token(user_email: string, user_name: string, user_role: string, otp: int):
    """Generates a secure, encrypted JWT token that expires in 1 hour"""
    if user_email and user_role and user_role != '':
        expiration = datetime.now(timezone.utc) + timedelta(hours=1)
        payload = {
            "sub": user_email,
            "name": user_name,
            "role": user_role,
            "otp": otp,
            "exp": expiration,
            "iat": datetime.now(timezone.utc)
        }
    else:
        expiration = datetime.now(timezone.utc) + timedelta(minutes=5)
        payload = {
            "sub": user_email,
            "nmae": user_name,
            "role": user_role,
            "otp": otp,
            "exp": expiration,
            "iat": datetime.now(timezone.utc)
        }
    encoded_jwt = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_jwt_token(token: str):
    try:
        decoded_payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return { "user_email": decoded_payload.get("sub"), "user_name": decoded_payload.get("name"), "user_role": decoded_payload.get("role"), "otp": decoded_payload.get('otp')}
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None