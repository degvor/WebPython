from fastapi import FastAPI
from fastapi.responses import JSONResponse
from models import get_db_connection, update_user
from psycopg2.errors import UniqueViolation
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import date, datetime


class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: str


class UserUpdate(BaseModel):
    username: str
    email: str
    password: str
    role: str


class ApplicationCreate(BaseModel):
    user_id: int
    job_id: int
    status: str


class ApplicationUpdate(BaseModel):
    user_id: int
    job_id: int
    status: str


class JobCreate(BaseModel):
    title: str
    description: str
    requirements: str
    salary: float
    employer_id: int


class JobUpdate(BaseModel):
    title: str
    description: str
    requirements: str
    salary: float
    employer_id: int


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/users/", tags=["Users"], description="Create a new user")
async def create_new_user(user: UserCreate):
    conn, cursor = get_db_connection()
    cursor.execute(
        "INSERT INTO users (username, email, role, password) VALUES (%s, %s, %s, %s) RETURNING id",
        (user.username, user.email, user.role, user.password))
    user_id = cursor.fetchone()['id']
    conn.commit()
    cursor.close()
    conn.close()
    return JSONResponse(status_code=201, content={"message": "User created successfully", "user_id": user_id})


@app.delete("/users/{user_id}", tags=["Users"], description="Delete an existing user")
async def delete_existing_user(user_id: int):
    conn, cursor = get_db_connection()
    cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return JSONResponse(status_code=200, content={"message": "User deleted successfully"})


@app.put("/users/{user_id}", tags=["Users"], description="Update an existing user")
async def update_existing_user(user_id: int, user: UserUpdate):
    update_user(user_id, user.username, user.email, user.password, user.role)
    return JSONResponse(status_code=200, content={"message": "User updated successfully"})


@app.get("/users/{user_id}", tags=["Users"], description="Get user by ID")
async def get_user_by_id(user_id: int):
    conn, cursor = get_db_connection()
    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return JSONResponse(status_code=200, content=user)


@app.get("/users/", tags=["Users"], description="Get all users")
async def get_all_users():
    conn, cursor = get_db_connection()
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return JSONResponse(status_code=200, content=users)


@app.post("/jobs/", tags=["Jobs"], description="Create a new job")
async def create_new_job(job: JobCreate):
    conn, cursor = get_db_connection()
    cursor.execute("INSERT INTO jobs (title, description, requirements, salary, employer_id) VALUES (%s, %s, %s, %s, %s) RETURNING id", (job.title, job.description, job.requirements, job.salary, job.employer_id))
    job_id = cursor.fetchone()['id']
    conn.commit()
    cursor.close()
    conn.close()
    return JSONResponse(status_code=201, content={"message": "Job created successfully", "job_id": job_id})


@app.delete("/jobs/{job_id}", tags=["Jobs"], description="Delete an existing job")
async def delete_existing_job(job_id: int):
    conn, cursor = get_db_connection()
    cursor.execute("DELETE FROM jobs WHERE id = %s", (job_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return JSONResponse(status_code=200, content={"message": "Job deleted successfully"})


@app.put("/jobs/{job_id}", tags=["Jobs"], description="Update an existing job")
async def update_existing_job(job_id: int, job: JobUpdate):
    conn, cursor = get_db_connection()
    cursor.execute(
        "UPDATE jobs SET title = %s, description = %s, requirements = %s, salary = %s, employer_id = %s WHERE id = %s",
        (job.title, job.description, job.requirements, job.salary, job.employer_id, job_id))
    conn.commit()
    cursor.close()
    conn.close()
    return JSONResponse(status_code=200, content={"message": "Job updated successfully"})


@app.get("/jobs/{job_id}", tags=["Jobs"], description="Get job by ID")
async def get_job_by_id(job_id: int):
    conn, cursor = get_db_connection()
    cursor.execute("SELECT * FROM jobs WHERE id = %s", (job_id,))
    job = cursor.fetchone()
    cursor.close()
    conn.close()
    return JSONResponse(status_code=200, content=job)


@app.get("/jobs/", tags=["Jobs"], description="Get all jobs")
async def get_all_jobs():
    conn, cursor = get_db_connection()
    cursor.execute("SELECT * FROM jobs")
    jobs = cursor.fetchall()
    cursor.close()
    conn.close()
    return JSONResponse(status_code=200, content=jobs)


@app.post("/applications/", tags=["Applications"], description="Create a new application")
async def create_new_application(application: ApplicationCreate):
    print(application)
    conn, cursor = get_db_connection()
    cursor.execute("INSERT INTO applications (user_id, job_id, status) VALUES (%s, %s, %s) RETURNING id",
                   (application.user_id, application.job_id, application.status))
    application_id = cursor.fetchone()['id']
    conn.commit()
    cursor.close()
    conn.close()
    return JSONResponse(status_code=201, content={"message": "Application created successfully", "application_id": application_id})


@app.delete("/applications/{application_id}", tags=["Applications"], description="Delete an existing application")
async def delete_existing_application(application_id: int):
    conn, cursor = get_db_connection()
    cursor.execute("DELETE FROM applications WHERE id = %s", (application_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return JSONResponse(status_code=200, content={"message": "Application deleted successfully"})


@app.put("/applications/{application_id}", tags=["Applications"], description="Update an existing application")
async def update_existing_application(application_id: int, application: ApplicationUpdate):
    conn, cursor = get_db_connection()
    cursor.execute("UPDATE applications SET user_id = %s, job_id = %s, status = %s WHERE id = %s",
                   (application.user_id, application.job_id, application.status, application_id))
    conn.commit()
    cursor.close()
    conn.close()
    return JSONResponse(status_code=200, content={"message": "Application updated successfully"})


@app.get("/applications/{application_id}", tags=["Applications"], description="Get application by ID")
async def get_application_by_id(application_id: int):
    conn, cursor = get_db_connection()
    cursor.execute("SELECT * FROM applications WHERE id = %s", (application_id,))
    application = cursor.fetchone()
    cursor.close()
    conn.close()
    # application_data = {
    #     "id": application['id'],
    #     "user_id": application['user_id'],
    #     "job_id": application['job_id'],
    #     "status": application['status'],
    #     "submission_date": application['submission_date'].isoformat() if isinstance(application['submission_date'], (date, datetime)) else application['submission_date']
    # }
    return JSONResponse(status_code=200, content=application)


@app.get("/applications/", tags=["Applications"], description="Get all applications")
async def get_all_applications():
    conn, cursor = get_db_connection()
    cursor.execute("SELECT * FROM applications")
    applications = cursor.fetchall()
    cursor.close()
    conn.close()
    # applications = []
    # for row in rows:
    #     application = {
    #         "id": row['id'],
    #         "user_id": row['user_id'],
    #         "job_id": row['job_id'],
    #         "status": row['status'],
    #         "submission_date": row['submission_date'].isoformat() if isinstance(row['submission_date'], (date, datetime)) else row['submission_date']
    #     }
    #     applications.append(application)

    return JSONResponse(status_code=200, content=applications)
    # return JSONResponse(status_code=200, content=applications)

