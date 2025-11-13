from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'kid' or 'parent'
    parent_username = db.Column(db.String(80), nullable=True)
    screen_time = db.Column(db.Integer, default=60)
    last_login = db.Column(db.DateTime, default=datetime.utcnow)

class Score(db.Model):
    __tablename__ = 'scores'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    level = db.Column(db.String(20))
    points = db.Column(db.Integer)
    date_played = db.Column(db.DateTime, default=datetime.utcnow)
