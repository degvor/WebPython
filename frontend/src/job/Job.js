import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Job.css';

const App = () => {
    const [jobs, setJobs] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [salary, setSalary] = useState('');
    const [employerId, setEmployerId] = useState('');
    const [requirements, setRequirements] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [jobDetails, setJobDetails] = useState(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await axios.get('http://localhost:8000/jobs/');
            setJobs(response.data);
            setSelectedJob(null);
            setJobDetails(null);
        } catch (error) {
            console.error('Error fetching the jobs', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const job = { title, description, salary: parseFloat(salary), employer_id: employerId, requirements };
            await axios.post('http://localhost:8000/jobs/', job, {
                headers: { 'Content-Type': 'application/json' },
            });
            fetchJobs();
            setTitle('');
            setDescription('');
            setSalary('');
            setEmployerId('');
            setRequirements('');
        } catch (error) {
            console.error('Error creating the job', error);
        }
    };

    const handleDelete = async (jobId) => {
        try {
            await axios.delete(`http://localhost:8000/jobs/${jobId}`);
            fetchJobs();
        } catch (error) {
            console.error('Error deleting the job', error);
        }
    };

    const handleUpdate = async (jobId) => {
        try {
            const job = { title, description, salary: parseFloat(salary), employer_id: employerId, requirements };
            await axios.put(`http://localhost:8000/jobs/${jobId}`, job, {
                headers: { 'Content-Type': 'application/json' },
            });
            fetchJobs();
            setTitle('');
            setDescription('');
            setSalary('');
            setEmployerId('');
            setRequirements('');
        } catch (error) {
            console.error('Error updating the job', error);
        }
    };

    const handleSelectJob = (job) => {
        setSelectedJob(job);
        setTitle(job.title);
        setDescription(job.description);
        setSalary(job.salary);
        setEmployerId(job.employer_id);
        setRequirements(job.requirements || '');
    };

    const handleViewDetails = async (jobId) => {
        try {
            const response = await axios.get(`http://localhost:8000/jobs/${jobId}`);
            setJobDetails(response.data);
        } catch (error) {
            console.error('Error fetching job details', error);
        }
    };

    return (
        <div className="App">
            <div className="create-job-form">
                <h2>{selectedJob ? 'Update Job' : 'Create Job'}</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
                    <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)}></textarea>
                    <textarea placeholder="Requirements" value={requirements} onChange={e => setRequirements(e.target.value)}></textarea>
                    <input type="number" placeholder="Salary" value={salary} onChange={e => setSalary(e.target.value)} />
                    <input type="text" placeholder="Employer ID" value={employerId} onChange={e => setEmployerId(e.target.value)} />
                    <button type="submit">{selectedJob ? 'Create Job' : 'Create Job'}</button>
                    {selectedJob && <button onClick={() => handleUpdate(selectedJob.id)} type="button">Apply Updates</button>}
                </form>
            </div>
            <div className="job-list">
                <h2>Job Listings</h2>
                <ul>
                    {jobs.map((job, index) => (
                        <li key={index}>
                            <strong>{job.title}</strong> - {job.description} - ${job.salary}
                            <button onClick={() => handleSelectJob(job)}>Edit</button>
                            <button onClick={() => handleDelete(job.id)}>Delete</button>
                            <button onClick={() => handleViewDetails(job.id)}>View Details</button>
                        </li>
                    ))}
                </ul>
            </div>
            {jobDetails && (
                <div className="job-details">
                    <h2>Job Details</h2>
                    <p><strong>Title:</strong> {jobDetails.title}</p>
                    <p><strong>Description:</strong> {jobDetails.description}</p>
                    <p><strong>Requirements:</strong> {jobDetails.requirements}</p>
                    <p><strong>Salary:</strong> ${jobDetails.salary}</p>
                    <p><strong>Employer ID:</strong> {jobDetails.employer_id}</p>
                </div>
            )}
        </div>
    );
};

export default App;

