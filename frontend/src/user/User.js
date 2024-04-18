import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './User.css';

const App = () => {
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await axios.get('http://localhost:8000/users/');
            setUsers(response.data);
            setSelectedUser(null);
            setUserDetails(null);
        } catch (error) {
            console.error('Error fetching the jobs', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = { username, email, password, role };
            await axios.post('http://localhost:8000/users/', user, {
                headers: { 'Content-Type': 'application/json' },
            });
            fetchJobs();
            setUsername('');
            setEmail('');
            setPassword('');
            setRole('');
        } catch (error) {
            console.error('Error creating the job', error);
        }
    };

    const handleDelete = async (jobId) => {
        try {
            await axios.delete(`http://localhost:8000/users/${jobId}`);
            fetchJobs();
        } catch (error) {
            console.error('Error deleting the job', error);
        }
    };

    const handleUpdate = async (userId) => {
        try {
            const user = { username, email, password, role };
            await axios.put(`http://localhost:8000/users/${userId}`, user, {
                headers: { 'Content-Type': 'application/json' },
            });
            fetchJobs();
            setUsername('');
            setEmail('');
            setPassword('');
            setRole('');
        } catch (error) {
            console.error('Error updating the user', error);
        }
    };

    const handleSelectJob = (user) => {
        setSelectedUser(user);
        setUsername(user.username);
        setEmail(user.email);
        setPassword(user.password);
        setRole(user.role);
    };

    const handleViewDetails = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8000/users/${userId}`);
            setUserDetails(response.data);
        } catch (error) {
            console.error('Error fetching user details', error);
        }
    };

    return (
        <div className="App">
            <div className="create-job-form">
                <h2>{selectedUser ? 'Update User' : 'Create User'}</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                    <input type='text' placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}></input>
                    <input type='text' placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}></input>
                    <input type="text" placeholder="Role" value={role} onChange={e => setRole(e.target.value)} />
                    <button type="submit">{selectedUser ? 'Create User' : 'Create User'}</button>
                    {selectedUser && <button onClick={() => handleUpdate(selectedUser.id)} type="button">Apply Updates</button>}
                </form>
            </div>
            <div className="job-list">
                <h2>User Listings</h2>
                <ul>
                    {users.map((user, index) => (
                        <li key={index}>
                            <strong>{user.username}</strong> - {user.email} - {user.role}
                            <button onClick={() => handleSelectJob(user)}>Edit</button>
                            <button onClick={() => handleDelete(user.id)}>Delete</button>
                            <button onClick={() => handleViewDetails(user.id)}>View Details</button>
                        </li>
                    ))}
                </ul>
            </div>
            {userDetails && (
                <div className="job-details">
                    <h2>User Details</h2>
                    <p><strong>Username:</strong> {userDetails.username}</p>
                    <p><strong>Email:</strong> {userDetails.email}</p>
                    <p><strong>Role:</strong> {userDetails.role}</p>
                </div>
            )}
        </div>
    );
};

export default App;

