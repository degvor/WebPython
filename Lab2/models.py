import psycopg2
from psycopg2.extras import RealDictCursor
import time
import variables


def get_db_connection():
    while True:
        try:
            conn = psycopg2.connect(
                host='localhost',
                database='lab2_web_python',
                user='postgres',
                password=variables.db_password,
                cursor_factory=RealDictCursor
            )
            cursor = conn.cursor()
            print("Connected to the database")
            return conn, cursor
        except Exception as e:
            print('Error:', e)
            time.sleep(2)


def create_user(conn, cursor, username, email, password, role):
    cursor.execute("INSERT INTO users (username, email, password, role) VALUES (%s, %s, %s, %s) RETURNING id", (username, email, password, role))
    user_id = cursor.fetchone()['id']
    conn.commit()
    cursor.close()
    conn.close()
    return user_id



def update_user(id, name, email, password, role):
    conn, cursor = get_db_connection()
    cursor.execute("UPDATE users SET name = %s, email = %s, password = %s, role = %s WHERE id = %s", (name, email, password, role, id))
    conn.commit()
    cursor.close()
    conn.close()


def delete_user(id):
    conn, cursor = get_db_connection()
    cursor.execute("DELETE FROM users WHERE id = %s", (id,))
    conn.commit()
    cursor.close()
    conn.close()


def create_job(conn, cursor, title, description, requirements, salary, employer_id):
    cursor.execute("INSERT INTO jobs (title, description, requirements, salary, employer_id) VALUES (%s, %s, %s, %s, %s) RETURNING id", (title, description, requirements, salary, employer_id))
    job_id = cursor.fetchone()['id']
    conn.commit()
    cursor.close()
    conn.close()
    return job_id


def update_job(id, title, description, requirements, salary, employer_id):
    conn, cursor = get_db_connection()
    cursor.execute("UPDATE jobs SET title = %s, description = %s, requirements = %s, salary = %s, employer_id = %s WHERE id = %s", (title, description, requirements, salary, employer_id, id))
    conn.commit()
    cursor.close()
    conn.close()


def delete_job(id):
    conn, cursor = get_db_connection()
    cursor.execute("DELETE FROM jobs WHERE id = %s", (id,))
    conn.commit()
    cursor.close()
    conn.close()


def create_application(conn, cursor, user_id, job_id, status, submission_date):
    cursor.execute("INSERT INTO applications (user_id, job_id, status, submission_date) VALUES (%s, %s, %s, %s) RETURNING id", (user_id, job_id, status, submission_date))
    application_id = cursor.fetchone()['id']
    conn.commit()
    cursor.close()
    conn.close()
    return application_id


def update_application(id, user_id, job_id, status, submission_date):
    conn, cursor = get_db_connection()
    cursor.execute("UPDATE applications SET user_id = %s, job_id = %s, status = %s, submission_date = %s WHERE id = %s", (user_id, job_id, status, submission_date, id))
    conn.commit()
    cursor.close()
    conn.close()


def delete_application(id):
    conn, cursor = get_db_connection()
    cursor.execute("DELETE FROM applications WHERE id = %s", (id,))
    conn.commit()
    cursor.close()
    conn.close()

