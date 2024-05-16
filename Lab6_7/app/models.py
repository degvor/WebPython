from app import db, login_manager
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

class Users(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(100), nullable=False)

    # Приклад відношення один до багатьох
    jobs = db.relationship('Jobs', backref='employer', lazy=True)


class Jobs(db.Model):
    __tablename__ = 'jobs'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    requirements = db.Column(db.Text, nullable=False)
    salary = db.Column(db.Float, nullable=False)
    employer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)


class Applications(db.Model):
    __tablename__ = 'applications'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    status = db.Column(db.String(100), nullable=False)
    user = db.relationship('Users', backref=db.backref('applications', lazy=True))
    job = db.relationship('Jobs', backref=db.backref('applications', lazy=True))
