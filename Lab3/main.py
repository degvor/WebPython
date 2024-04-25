from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from pymongo import MongoClient
from pymongo.collection import ReturnDocument
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware


# Налаштування підключення до MongoDB
def get_db_connection():
    client = MongoClient("mongodb://localhost:27017/")
    db = client["web_python_3"]
    return db


def transform_user_data(user):
    user_data = {
        "id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"],
        "role": user["role"],
        "password": user["password"]
    }
    return user_data


# Моделі Pydantic
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
    db = get_db_connection()
    collection = db.users
    new_user = collection.insert_one(user.dict())
    return JSONResponse(status_code=201, content={"message": "User created successfully", "user_id": str(new_user.inserted_id)})


@app.get("/users/{user_id}", tags=["Users"], description="Get user by ID")
async def get_user_by_id(user_id: str):
    db = get_db_connection()
    users_collection = db.users
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user['_id'] = str(user['_id'])
    # user = transform_user_data(user)

    return JSONResponse(status_code=200, content=user)


@app.get("/users/", tags=["Users"], description="Get all users")
async def get_all_users():
    db = get_db_connection()
    users_collection = db.users
    users = list(users_collection.find({}))

    for user in users:
        user['_id'] = str(user['_id'])
        # user = transform_user_data(user)

    return JSONResponse(status_code=200, content=users)


@app.put("/users/{user_id}", tags=["Users"], description="Update an existing user")
async def update_existing_user(user_id: str, user: UserUpdate):
    db = get_db_connection()
    users_collection = db.users
    update_result = users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": user.dict()}
    )

    if update_result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found or data not modified")

    return {"message": "User updated successfully", "user_id": user_id, "updated_count": update_result.modified_count}


@app.delete("/users/{user_id}", tags=["Users"], description="Delete an existing user")
async def delete_existing_user(user_id: str):
    db = get_db_connection()
    users_collection = db.users
    delete_result = users_collection.delete_one({"_id": ObjectId(user_id)})

    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User deleted successfully", "user_id": user_id}


@app.post("/jobs/", tags=["Jobs"], description="Create a new job")
async def create_new_job(job: JobCreate):
    db = get_db_connection()
    collection = db.jobs
    new_job = collection.insert_one(job.dict())
    return JSONResponse(status_code=201, content={"message": "Job created successfully", "job_id": str(new_job.inserted_id)})


@app.get("/jobs/{job_id}", tags=["Jobs"], description="Get job by ID")
async def get_job_by_id(job_id: str):
    db = get_db_connection()
    jobs_collection = db.jobs
    job = jobs_collection.find_one({"_id": ObjectId(job_id)})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    job['_id'] = str(job['_id'])

    return JSONResponse(status_code=200, content=job)


@app.get("/jobs/", tags=["Jobs"], description="Get all jobs")
async def get_all_jobs():
    db = get_db_connection()
    jobs_collection = db.jobs
    jobs = list(jobs_collection.find({}))

    for job in jobs:
        job['_id'] = str(job['_id'])

    return JSONResponse(status_code=200, content=jobs)


@app.put("/jobs/{job_id}", tags=["Jobs"], description="Update an existing job")
async def update_existing_job(job_id: str, job: JobUpdate):
    db = get_db_connection()
    jobs_collection = db.jobs
    update_result = jobs_collection.update_one(
        {"_id": ObjectId(job_id)},
        {"$set": job.dict()}
    )

    if update_result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Job not found or data not modified")

    return {"message": "Job updated successfully", "job_id": job_id, "updated_count": update_result.modified_count}


@app.delete("/jobs/{job_id}", tags=["Jobs"], description="Delete an existing job")
async def delete_existing_job(job_id: str):
    db = get_db_connection()
    jobs_collection = db.jobs
    delete_result = jobs_collection.delete_one({"_id": ObjectId(job_id)})

    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Job not found")

    return {"message": "Job deleted successfully", "job_id": job_id}


@app.post("/applications/", tags=["Applications"], description="Create a new application")
async def create_new_application(application: ApplicationCreate):
    db = get_db_connection()
    collection = db.applications
    new_application = collection.insert_one(application.dict())
    return JSONResponse(status_code=201, content={"message": "Application created successfully", "application_id": str(new_application.inserted_id)})


@app.get("/applications/{application_id}", tags=["Applications"], description="Get application by ID")
async def get_application_by_id(application_id: str):
    db = get_db_connection()
    applications_collection = db.applications
    application = applications_collection.find_one({"_id": ObjectId(application_id)})
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    application['_id'] = str(application['_id'])

    return JSONResponse(status_code=200, content=application)


@app.get("/applications/", tags=["Applications"], description="Get all applications")
async def get_all_applications():
    db = get_db_connection()
    applications_collection = db.applications
    applications = list(applications_collection.find({}))

    for application in applications:
        application['_id'] = str(application['_id'])

    return JSONResponse(status_code=200, content=applications)


@app.put("/applications/{application_id}", tags=["Applications"], description="Update an existing application")
async def update_existing_application(application_id: str, application: ApplicationUpdate):
    db = get_db_connection()
    applications_collection = db.applications
    update_result = applications_collection.find_one_and_update(
        {"_id": ObjectId(application_id)},
        {"$set": application.dict()},
        return_document=ReturnDocument.AFTER
    )

    if not update_result:
        raise HTTPException(status_code=404, detail="Application not found or data not modified")

    update_result['_id'] = str(update_result['_id'])

    return {"message": "Application updated successfully", "application_id": application_id, "updated_data": update_result}


@app.delete("/applications/{application_id}", tags=["Applications"], description="Delete an existing application")
async def delete_existing_application(application_id: str):
    db = get_db_connection()
    applications_collection = db.applications
    delete_result = applications_collection.delete_one({"_id": ObjectId(application_id)})

    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")

    return {"message": "Application deleted successfully", "application_id": application_id}
