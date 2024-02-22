from sqlalchemy import Column, Integer, String, Float, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.future import select

Base = declarative_base()


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    email = Column(String(100), unique=True)
    password = Column(String(100))
    role = Column(String(10))  # "admin" or "user"


class Job(Base):
    __tablename__ = 'jobs'
    id = Column(Integer, primary_key=True)
    title = Column(String(100))
    description = Column(String)
    requirements = Column(String)
    salary = Column(Float)
    employer_id = Column(Integer, ForeignKey('users.id'))
    employer = relationship("User", back_populates="jobs")


User.jobs = relationship("Job", order_by=Job.id, back_populates="employer")


class Application(Base):
    __tablename__ = 'applications'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    job_id = Column(Integer, ForeignKey('jobs.id'))
    status = Column(String(20))  # e.g., "submitted", "reviewed"
    submission_date = Column(String)

    user = relationship("User", back_populates="applications")
    job = relationship("Job", back_populates="applications")


User.applications = relationship("Application", order_by=Application.id, back_populates="user")
Job.applications = relationship("Application", order_by=Application.id, back_populates="job")

# Async engine and session creation
DATABASE_URL = "sqlite+aiosqlite:///./job_market.db"
engine = create_async_engine(DATABASE_URL, echo=True)


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

AsyncSessionLocal = sessionmaker(
    engine, expire_on_commit=False, class_=AsyncSession
)
