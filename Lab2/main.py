from fastapi import FastAPI
from fastapi.responses import JSONResponse
from models import get_db_connection, create_user, update_user, delete_user
from psycopg2.errors import UniqueViolation

app = FastAPI()


@app.post("/users/", tags=["Users"], description="Create a new user")
async def create_new_user(username: str, email: str, password: str, role: str):
    conn, cursor = get_db_connection()
    try:
        user_id = create_user(conn, cursor, username, email, password, role)
        return JSONResponse(status_code=201, content={"message": "User created successfully", "user_id": user_id})
    except UniqueViolation:
        return JSONResponse(status_code=400, content={"message": "Email already in use"})


@app.delete("/users/{user_id}", tags=["Users"], description="Delete an existing user")
async def delete_existing_user(id: int):
    delete_user(id)
    return JSONResponse(status_code=200, content={"message": "User deleted successfully"})


@app.put("/users/{user_id}", tags=["Users"], description="Update an existing user")
async def update_existing_user(id: int, name: str, email: str, password: str, role: str):
    update_user(id, name, email, password, role)
    return JSONResponse(status_code=200, content={"message": "User updated successfully"})


@app.get("/users/{user_id}", tags=["Users"], description="Get user by ID")
async def get_user_by_id(id: int):
    conn, cursor = get_db_connection()
    cursor.execute("SELECT * FROM users WHERE id = %s", (id,))
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
async def create_new_job(title: str, description: str, requirements: str, salary: float, employer_id: int):
    conn, cursor = get_db_connection()
    cursor.execute("INSERT INTO jobs (title, description, requirements, salary, employer_id) VALUES (%s, %s, %s, %s, %s) RETURNING id", (title, description, requirements, salary, employer_id))
    job_id = cursor.fetchone()['id']
    conn.commit()
    cursor.close()
    conn.close()
    return JSONResponse(status_code=201, content={"message": "Job created successfully", "job_id": job_id})


@app.delete("/jobs/{job_id}", tags=["Jobs"], description="Delete an existing job")
async def delete_existing_job(id: int):
    conn, cursor = get_db_connection()
    cursor.execute("DELETE FROM jobs WHERE id = %s", (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return JSONResponse(status_code=200, content={"message": "Job deleted successfully"})


@app.put("/jobs/{job_id}", tags=["Jobs"], description="Update an existing job")
async def update_existing_job(id: int, title: str, description: str, requirements: str, salary: float, employer_id: int):
    conn, cursor = get_db_connection()
    cursor.execute("UPDATE jobs SET title = %s, description = %s, requirements = %s, salary = %s, employer_id = %s WHERE id = %s", (title, description, requirements, salary, employer_id, id))
    conn.commit()
    cursor.close()
    conn.close()
    return JSONResponse(status_code=200, content={"message": "Job updated successfully"})


@app.get("/jobs/{job_id}", tags=["Jobs"], description="Get job by ID")
async def get_job_by_id(id: int):
    conn, cursor = get_db_connection()
    cursor.execute("SELECT * FROM jobs WHERE id = %s", (id,))
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
async def create_new_application(user_id: int, job_id: int, status: str, submission_date: str):
    conn, cursor = get_db_connection()
    cursor.execute("INSERT INTO applications (user_id, job_id, status, submission_date) VALUES (%s, %s, %s, %s) RETURNING id", (user_id, job_id, status, submission_date))
    application_id = cursor.fetchone()['id']
    conn.commit()
    cursor.close()
    conn.close()
    return JSONResponse(status_code=201, content={"message": "Application created successfully", "application_id": application_id})


@app.delete("/applications/{application_id}", tags=["Applications"], description="Delete an existing application")
async def delete_existing_application(id: int):
    conn, cursor = get_db_connection()
    cursor.execute("DELETE FROM applications WHERE id = %s", (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return JSONResponse(status_code=200, content={"message": "Application deleted successfully"})


@app.put("/applications/{application_id}", tags=["Applications"], description="Update an existing application")
async def update_existing_application(id: int, user_id: int, job_id: int, status: str, submission_date: str):
    conn, cursor = get_db_connection()
    cursor.execute("UPDATE applications SET user_id = %s, job_id = %s, status = %s, submission_date = %s WHERE id = %s", (user_id, job_id, status, submission_date, id))
    conn.commit()
    cursor.close()
    conn.close()
    return JSONResponse(status_code=200, content={"message": "Application updated successfully"})


@app.get("/applications/{application_id}", tags=["Applications"], description="Get application by ID")
async def get_application_by_id(id: int):
    conn, cursor = get_db_connection()
    cursor.execute("SELECT * FROM applications WHERE id = %s", (id,))
    application = cursor.fetchone()
    cursor.close()
    conn.close()
    return JSONResponse(status_code=200, content=application)


@app.get("/applications/", tags=["Applications"], description="Get all applications")
async def get_all_applications():
    conn, cursor = get_db_connection()
    cursor.execute("SELECT * FROM applications")
    applications = cursor.fetchall()
    cursor.close()
    conn.close()
    return JSONResponse(status_code=200, content=applications)

