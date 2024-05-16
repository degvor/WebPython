from . import app
from flask import request, jsonify
from .models import db, Users, Jobs, Applications
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = Users.query.filter_by(username=data['email']).first()
    if user is None or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid credentials'}), 400
    login_user(user)
    return jsonify({'message': 'You have been logged in'}), 200


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'You have been logged out'}), 200


@app.route('/users/', methods=['POST'])
def create_user():
    data = request.get_json()
    data['password'] = generate_password_hash(data['password'])
    new_user = Users(username=data['username'], email=data['email'], password=data['password'], role=data['role'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201


@app.route('/users/', methods=['GET'])
def get_users():
    users = Users.query.all()
    return jsonify([{'id': user.id, 'username': user.username, 'email': user.email, 'role': user.role} for user in users])


@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = Users.query.get_or_404(user_id)
    return jsonify({'username': user.username, 'email': user.email, 'role': user.role})


@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = Users.query.get_or_404(user_id)
    data = request.get_json()
    user.username = data['username']
    user.email = data['email']
    user.password = data['password']
    user.role = data['role']
    db.session.commit()
    return jsonify({'message': 'User updated successfully'})


@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = Users.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'})


@app.route('/jobs/', methods=['POST'])
def create_job():
    data = request.get_json()
    job = Jobs(
        title=data['title'],
        description=data['description'],
        requirements=data['requirements'],
        salary=data['salary'],
        employer_id=data['employer_id']
    )
    db.session.add(job)
    db.session.commit()
    return jsonify({'message': 'Job created successfully'}), 201


@app.route('/jobs/', methods=['GET'])
def get_jobs():
    jobs = Jobs.query.all()
    return jsonify([{'id': job.id, 'title': job.title, 'description': job.description, 'salary': job.salary, 'employer_id': job.employer_id} for job in jobs])


@app.route('/jobs/<int:job_id>', methods=['GET'])
def get_job(job_id):
    job = Jobs.query.get_or_404(job_id)
    return jsonify({'title': job.title, 'description': job.description, 'salary': job.salary, 'employer_id': job.employer_id})


@app.route('/jobs/<int:job_id>', methods=['PUT'])
def update_job(job_id):
    job = Jobs.query.get_or_404(job_id)
    data = request.get_json()
    job.title = data['title']
    job.description = data['description']
    job.requirements = data['requirements']
    job.salary = data['salary']
    job.employer_id = data['employer_id']
    db.session.commit()
    return jsonify({'message': 'Job updated successfully'})


@app.route('/jobs/<int:job_id>', methods=['DELETE'])
def delete_job(job_id):
    job = Jobs.query.get_or_404(job_id)
    db.session.delete(job)
    db.session.commit()
    return jsonify({'message': 'Job deleted successfully'})


@app.route('/applications/', methods=['POST'])
def create_application():
    data = request.get_json()
    application = Applications(
        user_id=data['user_id'],
        job_id=data['job_id'],
        status=data['status']
    )
    db.session.add(application)
    db.session.commit()
    return jsonify({'message': 'Application created successfully'}), 201


@app.route('/applications/', methods=['GET'])
def get_applications():
    applications = Applications.query.all()
    return jsonify([{'id': application.id, 'user_id': application.user_id, 'job_id': application.job_id, 'status': application.status} for application in applications])


@app.route('/applications/<int:application_id>', methods=['GET'])
def get_application(application_id):
    application = Applications.query.get_or_404(application_id)
    return jsonify({'user_id': application.user_id, 'job_id': application.job_id, 'status': application.status})


@app.route('/applications/<int:application_id>', methods=['PUT'])
def update_application(application_id):
    application = Applications.query.get_or_404(application_id)
    data = request.get_json()
    application.user_id = data['user_id']
    application.job_id = data['job_id']
    application.status = data['status']
    db.session.commit()
    return jsonify({'message': 'Application updated successfully'})


@app.route('/applications/<int:application_id>', methods=['DELETE'])
def delete_application(application_id):
    application = Applications.query.get_or_404(application_id)
    db.session.delete(application)
    db.session.commit()
    return jsonify({'message': 'Application deleted successfully'})