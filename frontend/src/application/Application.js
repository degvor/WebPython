import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Application.css';

const App = () => {
    const [applications, setApplications] = useState([]);
    const [userId, setUserId] = useState(null);
    const [jobId, setJobId] = useState(null);
    const [status, setStatus] = useState('');
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [applicationDetails, setApplicationDetails] = useState(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await axios.get('http://localhost:8000/applications/');
            setApplications(response.data);
            setSelectedApplication(null);
            setApplicationDetails(null);
        } catch (error) {
            console.error('Error fetching the jobs', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const application = { user_id: userId, job_id: jobId, status};
            await axios.post('http://localhost:8000/applications/', application, {
                headers: { 'Content-Type': 'application/json' },
            });
            fetchJobs();
            setUserId('');
            setJobId('');
            setStatus('');
        } catch (error) {
            console.error('Error creating the job', error);
        }
    };

    const handleDelete = async (applicationId) => {
        try {
            await axios.delete(`http://localhost:8000/applications/${applicationId}`);
            fetchJobs();
        } catch (error) {
            console.error('Error deleting the job', error);
        }
    };

    const handleUpdate = async (applicationId) => {
        try {
            const application = { userId, jobId, status};
            await axios.put(`http://localhost:8000/applications/${applicationId}`, application, {
                headers: { 'Content-Type': 'application/json' },
            });
            fetchJobs();
            setUserId('');
            setJobId('');
            setStatus('');
        } catch (error) {
            console.error('Error updating the user', error);
        }
    };

    const handleSelectJob = (application) => {
        setSelectedApplication(application);
        setUserId(application.userId);
        setJobId(application.jobId);
        setStatus(application.stats);
    };

    const handleViewDetails = async (applicationId) => {
        try {
            const response = await axios.get(`http://localhost:8000/applications/${applicationId}`);
            setApplicationDetails(response.data);
        } catch (error) {
            console.error('Error fetching user details', error);
        }
    };

    return (
        <div className="App">
            <div className="create-job-form">
                <h2>{selectedApplication ? 'Update Application' : 'Create Application'}</h2>
                <form onSubmit={handleSubmit}>
                    <input type="number" placeholder="User Id" value={userId} onChange={e => setUserId(e.target.value)} />
                    <input type='number' placeholder="Job Id" value={jobId} onChange={e => setJobId(e.target.value)}></input>
                    <input type='text' placeholder="Status" value={status} onChange={e => setStatus(e.target.value)}></input>
                    <button type="submit">{selectedApplication ? 'Create Application' : 'Create Application'}</button>
                    {selectedApplication && <button onClick={() => handleUpdate(selectedApplication.id)} type="button">Apply Updates</button>}
                </form>
            </div>
            <div className="job-list">
                <h2>Application Listings</h2>
                <ul>
                    {applications.map((application, index) => (
                        <li key={index}>
                            <strong>{application.user_id}</strong> - {application.job_id} - {application.status}
                            <button onClick={() => handleSelectJob(application)}>Edit</button>
                            <button onClick={() => handleDelete(application.id)}>Delete</button>
                            <button onClick={() => handleViewDetails(application.id)}>View Details</button>
                        </li>
                    ))}
                </ul>
            </div>
            {applicationDetails && (
                <div className="job-details">
                    <h2>Application Details</h2>
                    <p><strong>UserId:</strong> {applicationDetails.user_id}</p>
                    <p><strong>JobId:</strong> {applicationDetails.job_id}</p>
                    <p><strong>Status:</strong> {applicationDetails.status}</p>
                </div>
            )}
        </div>
    );
};

export default App;

