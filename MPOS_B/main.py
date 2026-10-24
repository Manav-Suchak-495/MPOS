import email
import json
import os
import jwt
import random
import psycopg
import uvicorn
import smtplib
import bcrypt
from pydantic import BaseModel, EmailStr, Field, field_validator
import redis.asyncio as redis
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import traceback
from fastapi import FastAPI, Depends, HTTPException, status, Response, Cookie, Request, BackgroundTasks
from Auth import SECRET_KEY, ALGORITHM, load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from psycopg.rows import dict_row
from psycopg.errors import UniqueViolation
from datetime import datetime, timedelta, timezone

app = FastAPI()
r = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)
load_dotenv()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class VerifyOtpRequest(BaseModel):
    isSignUp: bool
    email: EmailStr
    otp: str

class GetProfileRequest(BaseModel):
    long_token: str
class SignUpRequest(BaseModel):
    name: str
    email: EmailStr
    mobile: str
    password: str

async def get_db_connection():
    db_host = os.getenv("DB_HOST").strip()
    db_port = os.getenv("DB_PORT").strip()
    db_name = os.getenv("DB_NAME").strip()
    db_user = os.getenv("DB_USER").strip()
    db_password = os.getenv("DB_PASSWORD", "").strip()
    try:
        print(f"DEBUG: Connecting to host={db_host}, user={db_user}")
        print(f"DEBUG: Is password present? {'YES' if db_password else 'NO'}")
        conn_info = f"host={db_host} port={db_port} dbname={db_name} user={db_user} password={db_password} sslmode=require"
        async with await psycopg.AsyncConnection.connect(conn_info, row_factory=dict_row) as aconn:
            yield aconn
    except Exception as e:
        print(f"Database connection failed: {e}")
        raise e
    
@app.post('/api/v1/auth/login')
async def login(payload: LoginRequest, background_tasks: BackgroundTasks, response: Response, db: psycopg.AsyncConnection = Depends(get_db_connection)):
    try:
        email = payload.email.lower().strip()
        password = payload.password.strip()

        print(email, password)
        async with db.cursor() as cursor:
            await cursor.execute( "SELECT * FROM user_data WHERE user_email=%s", (email,))
            user = await cursor.fetchone()
        if not user:
            raise HTTPException(
                status_code=401,
                detail="Invalid User or Password"
            )
        stored_password_hash = user['user_password']
        if isinstance(stored_password_hash, str):
            stored_password_hash = stored_password_hash.encode('utf-8')
        isVerified = bcrypt.checkpw(password.encode('utf-8'), stored_password_hash)
        otp=generate_otp()
        async with r.pipeline(transaction=True) as pipe:
                    await pipe.setex(f"otp:{email}", timedelta(minutes=5), otp)
                    await pipe.setex(f"{email}:user_id", timedelta(minutes=5), str(user['user_id']))
                    await pipe.setex(f"{email}:user_email", timedelta(minutes=5), email)
                    await pipe.setex(f"{email}:user_name", timedelta(minutes=5), user['user_name'])
                    await pipe.setex(f"{email}:user_mobile", timedelta(minutes=5), user['user_mobile'])
                    await pipe.execute()
        background_tasks.add_task(send_otp, email=email, otp=otp)
        return {"isEmailVerified": isVerified}

    except HTTPException:
        raise
    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post('/api/v1/auth/signupotpverify')
async def SignUpVerify(payload: SignUpRequest, background_tasks: BackgroundTasks, db: psycopg.AsyncConnection = Depends(get_db_connection)):
    try:
        name = payload.name.strip().title()
        email = payload.email.lower().strip()
        mobile = payload.mobile.strip()
        password = payload.password.strip()
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        async with db.cursor() as cursor:
                    await cursor.execute( "SELECT * FROM user_data WHERE user_email=%s", (email,))
                    user = await cursor.fetchone()
        if user:
            raise HTTPException(
                status_code=401,
                detail="User Already Exists"
            )
        otp = generate_otp()
        async with r.pipeline(transaction=True) as pipe:
                            await pipe.setex(f"otp:{email}", timedelta(minutes=5), otp)
                            await pipe.setex(f"{email}:user_email", timedelta(minutes=5), email)
                            await pipe.setex(f"{email}:user_name", timedelta(minutes=5), name)
                            await pipe.setex(f"{email}:user_mobile", timedelta(minutes=5), mobile)
                            await pipe.setex(f"{email}:user_password", timedelta(minutes=5), hashed_password)
                            await pipe.execute()
        background_tasks.add_task(send_otp, email=email, otp=otp)
        return {"isSignUpVerified": True}
    except HTTPException:
            raise
    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal server error")
    
async def SignUp(name, email, mobile, password,db: psycopg.AsyncConnection):
    try:
        async with db.cursor() as cursor:
            await cursor.execute( """
                INSERT INTO user_data (user_name, user_email, user_mobile, user_password) 
                SELECT %s, %s, %s, %s 
                WHERE NOT EXISTS (
                    SELECT 1 FROM user_data WHERE user_email = %s
                )
                RETURNING user_id;
                """, 
                (name, email, mobile, password, email)
            )
            await db.commit()
            row = await cursor.fetchone()
        Authenticated = (cursor.rowcount > 0)
        return {'Authenticated' : Authenticated, 'user_id' : row['user_id']}

    except HTTPException:
        raise
    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post('/api/v1/auth/send-otp')
async def send_otp_api(payload: LoginRequest, background_tasks: BackgroundTasks, db: psycopg.AsyncConnection = Depends(get_db_connection)):
    otp = generate_otp()
    email = payload.email.lower().strip()
    if r.exists(f"{payload.email.lower().strip()}"):
        await r.setex(f"otp:{email}", timedelta(minutes=5), otp)
    else:
        try:
            async with db.cursor() as cursor:
                await cursor.execute("SELECT user_id, user_name FROM user_data WHERE user_email=%s", (email,))
                user = await cursor.fetchone()
        except Exception as e:
            print(f"Error occurred while fetching user data: {e}")
            raise HTTPException(status_code=500, detail="Internal server error")
        async with r.pipeline(transaction=True) as pipe:
            await pipe.setex(f"otp:{email}", timedelta(minutes=5), otp)
            await pipe.setex(f"{email}", timedelta(minutes=5), email)
            await pipe.setex(f"{email}:user_id", timedelta(minutes=5), str(user['user_id']))
            await pipe.setex(f"{email}:user_name", timedelta(minutes=5), user['user_name'])
            await pipe.setex(f"{email}:user_mobile", timedelta(minutes=5), user['user_mobile'])
            await pipe.execute()
        if not user:
            raise HTTPException(
                status_code=401,
                detail="Invalid User or Password"
            )
    background_tasks.add_task(send_otp, email=email, otp=otp)
    await r.setex(f"otp:{email}", timedelta(minutes=5), otp)
    return {"message": "OTP sent successfully"}

    

@app.post("/api/v1/auth/verify-otp")
async def verify_otp(payload: VerifyOtpRequest, response: Response, db: psycopg.AsyncConnection = Depends(get_db_connection)):
    isSignUp = payload.isSignUp
    email = payload.email.lower().strip()
    otp = payload.otp.strip()
    cached_otp = await r.get(f"otp:{email}")
    user_id = ''
    if cached_otp is None:
        raise HTTPException(status_code=400, detail="OTP expired or not found")
    if cached_otp != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    await r.delete(f"otp:{email}")
    if isSignUp == True:
        user_data = False
        async with r.pipeline(transaction=True) as pipe:
            await pipe.get(f"{email}:user_name")
            await pipe.get(f"{email}:user_mobile")
            await pipe.get(f"{email}:user_password")
            user_data = await pipe.execute()

        if not user_data or any(x is None for x in user_data):
            raise HTTPException(
                status_code=401,
                detail="Error in Fetching User: Signup session expired or missing data."
            )
        name = user_data[0].decode('utf-8') if isinstance(user_data[0], bytes) else user_data[0]
        mobile = user_data[1].decode('utf-8') if isinstance(user_data[1], bytes) else user_data[1]
        hashed_password = user_data[2]

        SignUp_Data = await SignUp(name,email,mobile,hashed_password, db)
        user_id = SignUp_Data['user_id']
        await r.set(f"{email}:user_id", user_id, timedelta(minutes=5))
        if user_id == '':
            raise HTTPException(
                        status_code=401,
                        detail="Error in Fetching User"
                    )
    user_id = await r.get(f"{email}:user_id")
    short_token = create_jwt_token(email, user_id=user_id, business_id='', short_login=True, long_login=False)
    return {"Authenticated": True, "message": "OTP verified successfully", "Short_Token": short_token}

@app.post("/api/v1/users/get-my-profile")
async def get_my_profile(payload: GetProfileRequest, db: psycopg.AsyncConnection = Depends(get_db_connection)):
    long_token = payload.long_token
    user_info = verify_jwt_token(long_token)
    if not user_info:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_id = user_info["user_id"]
    cache_key = f"user:profile:{user_id}"

    cached_profile = await r.get(cache_key)
    if cached_profile:
        return json.loads(cached_profile)

    try:
        async with db.cursor() as cursor:
            await cursor.execute("SELECT * FROM user_data WHERE user_id=%s", (user_id,))
            user = await cursor.fetchone()
    except Exception as e:
        print(f"Error occurred while fetching user profile: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

    if not user:
        raise HTTPException(status_code=401, detail="Invalid User or Password")

    profile_data = {
        "id": str(user['user_id']),
        "full_name": user['user_name'],
        "email": user['user_email'],
        "phone_number": user['user_phone'],
        "country": user['user_country'],
    }
    await r.setex(cache_key, 3600, json.dumps(profile_data))

    return profile_data

def generate_otp():
    return str(random.randint(100000, 999999))

def send_otp(email: str, otp: str):
    message = MIMEMultipart()
    message['From'] = os.getenv("SMTP_SENDER")
    message['To'] = email
    message['Subject'] = 'Your One-Time Password (OTP) for MPOS Login'
    body = f'Your One-Time Password (OTP) for MPOS login is: {otp}. This OTP is valid for 5 minutes.'
    message.attach(MIMEText(body, 'plain'))

    try:
        import smtplib
        with smtplib.SMTP(os.getenv("SMTP_SERVER"), int(os.getenv("SMTP_PORT", 587))) as server:
            server.starttls()
            server.login(os.getenv("SMTP_SENDER"), os.getenv("SMTP_PASSWORD"))
            server.send_message(message)
    except Exception as e:
        print(f"Otp send failed: {e}")

def create_jwt_token(user_email: str, user_id: str, business_id: str, short_login: bool = False, long_login: bool = False):
    if long_login :
        payload_l = {
                "sub": user_id,
                "email": user_email,
                "exp": datetime.now(timezone.utc) + timedelta(days=7),
                "iat": datetime.now(timezone.utc),
                "business_id": business_id
            }
        long_token = jwt.encode(payload_l, SECRET_KEY, algorithm=ALGORITHM)
        payload_s = {
                "sub": user_id,
                "email": user_email,
                "exp": datetime.now(timezone.utc) + timedelta(hours=1),
                "iat": datetime.now(timezone.utc),
                "business_id": business_id
            }
        short_token = jwt.encode(payload_s, SECRET_KEY, algorithm=ALGORITHM)
        return long_token, short_token
    if short_login:
        payload_s = {
                "sub": user_id,
                "email": user_email,
                "exp": datetime.now(timezone.utc) + timedelta(hours=1),
                "iat": datetime.now(timezone.utc),
                "business_id": business_id
            }
        short_token = jwt.encode(payload_s, SECRET_KEY, algorithm=ALGORITHM)
        return short_token

def verify_jwt_token(token: str):
    try:
        decoded_payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return { "user_email": decoded_payload.get("email"), "user_id": decoded_payload.get("sub") }
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)