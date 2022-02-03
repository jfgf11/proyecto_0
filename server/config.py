from dotenv import load_dotenv
import os
import redis
from datetime import timedelta

load_dotenv()


class ApplicationConfig:
    SECRET_KEY = os.environ["SECRET_KEY"]
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI =  "sqlite:///test.db"

    SESSION_TYPE = 'redis'
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
    SESSION_REDIS = redis.from_url("redis://127.0.0.1:6379")
    JWT_SECRET_KEY = "necr0927345ntygw87opt907ehpg"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
