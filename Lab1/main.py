from fastapi import FastAPI, Depends, HTTPException, Form
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.responses import HTMLResponse
from sqlalchemy.future import select
from models import init_db, AsyncSessionLocal, User, Job, Application
from typing import List
from pydantic import BaseModel

"""
Предметна галузь - Біржа праці

Завдання:
Для заданої предметної галузі розробити RESTfull API вебзастосунок:

    1) Контент повинен генеруватися на сервері і у вигляді HTML відправляється на
клієнт.
    2) Дані мусять зберігатися у реляційній БД, наприклад, SQLite. Схема даних
повинна містити щонайменша 3 сутності.
    3) Для доступу до даних слід використовувати SQLAlchemy ORM.
    4) Передбачити режими роботи акторів двох ролей: адміністратор та користувач.
    5) Хоча б для однієї сутності реалізувати усі чотири CRUD-операції (create, read,
        update, delete).
    6) Внести зміни в OpenAPI документацію за замовченням.
"""

app = FastAPI(title="Job Market", version="1.0", description="A simple job market API")


async def get_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session


@app.on_event("startup")
async def startup_event():
    await init_db()


@app.post("/jobs/", response_class=HTMLResponse, tags=["Jobs"], description="Create a new job")
async def create_job(title: str = Form(...), description: str = Form(...), requirements: str = Form(...), salary: float = Form(...), employer_id: int = Form(...), session: AsyncSession = Depends(get_session)):
    async with session:
        result = await session.execute(select(User).where(User.id == employer_id))
        user = result.scalars().first()
        if user is None:
            return HTMLResponse(status_code=404, content="<html><body><h1>User Not Found</h1></body></html>")
        if user.role != "HR":
            raise HTTPException(status_code=403, detail="Only HR can create jobs")

        job = Job(title=title, description=description, requirements=requirements, salary=salary, employer_id=employer_id)
        session.add(job)
        await session.commit()
        await session.refresh(job)
        return f"<html><body><h1>Job Created</h1><p>{job.title} - {job.description}</p></body></html>"


@app.get("/jobs/", response_class=HTMLResponse, tags=["Jobs"], description="Get all jobs")
async def read_jobs(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Job))
    jobs = result.scalars().all()
    jobs_html = "<ul>" + "".join([f"<li>{job.title} - {job.description}</li>" for job in jobs]) + "</ul>"
    return f"<html><body><h1>Job Listings</h1>{jobs_html}</body></html>"


@app.get("/jobs/{job_id}", response_class=HTMLResponse, tags=["Jobs"], description="Get a job by ID")
async def read_job(job_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Job).where(Job.id == job_id))
    job = result.scalars().first()
    if job is None:
        return HTMLResponse(status_code=404, content="<html><body><h1>Job Not Found</h1></body></html>")
    return f"<html><body><h1>{job.title}</h1><p>{job.description}</p></body></html>"


@app.put("/jobs/{job_id}", response_class=HTMLResponse, tags=["Jobs"], description="Update a job by ID")
async def update_job(job_id: int, title: str = Form(...), description: str = Form(...), salary: float = Form(...), session: AsyncSession = Depends(get_session)):
    async with session:
        result = await session.execute(select(Job).where(Job.id == job_id))
        job = result.scalars().first()
        if job is None:
            return HTMLResponse(status_code=404, content="<html><body><h1>Job Not Found</h1></body></html>")
        job.title = title
        job.description = description
        job.salary = salary
        await session.commit()
        return f"<html><body><h1>Job Updated</h1><p>{job.title} - {job.description}</p></body></html>"


@app.delete("/jobs/{job_id}", response_class=HTMLResponse, tags=["Jobs"], description="Delete a job by ID")
async def delete_job(job_id: int, session: AsyncSession = Depends(get_session)):
    async with session:
        result = await session.execute(select(Job).where(Job.id == job_id))
        job = result.scalars().first()
        if job is None:
            return HTMLResponse(status_code=404, content="<html><body><h1>Job Not Found</h1></body></html>")
        await session.delete(job)
        await session.commit()
        return f"<html><body><h1>Job Deleted</h1><p>Job with ID {job_id} has been deleted.</p></body></html>"


@app.post("/users/", response_class=HTMLResponse, tags=["Users"], description="Create a new user")
async def create_user(name: str = Form(...), email: str = Form(...), password: str = Form(...), role: str = Form(...), session: AsyncSession = Depends(get_session)):
    user = User(name=name, email=email, password=password, role=role)
    session.add(user)
    await session.commit()
    return f"<html><body><h1>User Created</h1><p>{user.name} - {user.email}</p></body></html>"


@app.get("/users/", response_class=HTMLResponse, tags=["Users"], description="Get all users")
async def read_users(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(User))
    users = result.scalars().all()
    users_html = "<ul>" + "".join([f"<li>{user.name} - {user.email},{user.role}</li>" for user in users]) + "</ul>"
    return f"<html><body><h1>User List</h1>{users_html}</body></html>"


@app.get("/users/{user_id}", response_class=HTMLResponse, tags=["Users"], description="Get a user by ID")
async def read_user(user_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if user is None:
        return HTMLResponse(status_code=404, content="<html><body><h1>User Not Found</h1></body></html>")
    return f"<html><body><h1>{user.name}</h1><p>{user.email}</p></body></html>"


@app.put("/users/{user_id}", response_class=HTMLResponse, tags=["Users"], description="Update a user by ID")
async def update_user(user_id: int, name: str = Form(...), email: str = Form(...), password: str = Form(...), role: str = Form(...),employer_id: int = Form(), session: AsyncSession = Depends(get_session)):
    async with session:
        result1 = await session.execute(select(User).where(User.id == employer_id))
        user = result1.scalars().first()
        if user is None:
            return HTMLResponse(status_code=404, content="<html><body><h1>User Not Found</h1></body></html>")
        if user.role != "Admin":
            raise HTTPException(status_code=403, detail="Only Admin can create users")
        result = await session.execute(select(User).where(User.id == user_id))
        user = result.scalars().first()
        if user is None:
            return HTMLResponse(status_code=404, content="<html><body><h1>User Not Found</h1></body></html>")
        user.name = name
        user.email = email
        user.password = password
        user.role = role
        await session.commit()
        return f"<html><body><h1>User Updated</h1><p>{user.name} - {user.email}</p></body></html>"


@app.delete("/users/{user_id}", response_class=HTMLResponse, tags=["Users"], description="Delete a user by ID")
async def delete_user(user_id: int, employer_id: int = Form(), session: AsyncSession = Depends(get_session)):
    async with session:
        result1 = await session.execute(select(User).where(User.id == employer_id))
        user = result1.scalars().first()
        if user is None:
            return HTMLResponse(status_code=404, content="<html><body><h1>User Not Found</h1></body></html>")
        if user.role != "Admin":
            raise HTTPException(status_code=403, detail="Only Admin can create users")
        result = await session.execute(select(User).where(User.id == user_id))
        user = result.scalars().first()
        if user is None:
            return HTMLResponse(status_code=404, content="<html><body><h1>User Not Found</h1></body></html>")
        await session.delete(user)
        await session.commit()
        return f"<html><body><h1>User Deleted</h1><p>User with ID {user_id} has been deleted.</p></body></html>"\


@app.post("/applications/", response_class=HTMLResponse, tags=["Applications"], description="Create a new application")
async def create_application(user_id: int = Form(...), job_id: int = Form(...), status: str = Form(...), submission_date: str = Form(...), session: AsyncSession = Depends(get_session)):
    application = Application(user_id=user_id, job_id=job_id, status=status, submission_date=submission_date)
    session.add(application)
    await session.commit()
    return f"<html><body><h1>Application Created</h1><p>User: {application.user_id} - Job: {application.job_id}</p></body></html>"


@app.get("/applications/", response_class=HTMLResponse, tags=["Applications"], description="Get all applications")
async def read_applications(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Application))
    applications = result.scalars().all()
    applications_html = "<ul>" + "".join([f"<li>User: {application.user_id} - Job: {application.job_id}</li>" for application in applications]) + "</ul>"
    return f"<html><body><h1>Applications</h1>{applications_html}</body></html>"


@app.get("/applications/{application_id}", response_class=HTMLResponse, tags=["Applications"], description="Get an application by ID")
async def read_application(application_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Application).where(Application.id == application_id))
    application = result.scalars().first()
    if application is None:
        return HTMLResponse(status_code=404, content="<html><body><h1>Application Not Found</h1></body></html>")
    return f"<html><body><h1>Application</h1><p>User: {application.user_id} - Job: {application.job_id}</p></body></html>"

@app.put("/applications/{application_id}", response_class=HTMLResponse, tags=["Applications"], description="Update an application by ID")
async def update_application(application_id: int, user_id: int = Form(...), job_id: int = Form(...), status: str = Form(...), submission_date: str = Form(...), session: AsyncSession = Depends(get_session)):
    async with session:
        result = await session.execute(select(Application).where(Application.id == application_id))
        application = result.scalars().first()
        if application is None:
            return HTMLResponse(status_code=404, content="<html><body><h1>Application Not Found</h1></body></html>")
        application.user_id = user_id
        application.job_id = job_id
        application.status = status
        application.submission_date = submission_date
        await session.commit()
        return f"<html><body><h1>Application Updated</h1><p>User: {application.user_id} - Job: {application.job_id}</p></body></html>"

@app.delete("/applications/{application_id}", response_class=HTMLResponse, tags=["Applications"], description="Delete an application by ID")
async def delete_application(application_id: int, session: AsyncSession = Depends(get_session)):
    async with session:
        result = await session.execute(select(Application).where(Application.id == application_id))
        application = result.scalars().first()
        if application is None:
            return HTMLResponse(status_code=404, content="<html><body><h1>Application Not Found</h1></body></html>")
        await session.delete(application)
        await session.commit()
        return f"<html><body><h1>Application Deleted</h1><p>Application with ID {application_id} has been deleted.</p></body></html>"\





