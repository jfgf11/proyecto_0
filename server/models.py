from flask_sqlalchemy import SQLAlchemy
from app import app
from flask_marshmallow import Marshmallow 
from uuid import uuid4

db = SQLAlchemy(app)
ma = Marshmallow(app)

def get_uuid():
    return uuid4().hex

class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.String(), primary_key=True, unique=True, default=get_uuid)
    email = db.Column(db.String(345), unique=True)
    password = db.Column(db.Text, nullable=False)

class User_Schema(ma.Schema):
    class Meta:
        fields = ("id", "email", "password")