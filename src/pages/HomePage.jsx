import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/Config';

const HomePage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
        if (!email || !password) {
            return toast.error("Please fill all the fields");
        }
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            toast.success("Login Successful");
            localStorage.setItem('admin', JSON.stringify(result));
            navigate('/admin');
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    };

    return (
        <div className="relative min-h-screen bg-black text-green-400 flex items-center justify-center p-6">
            <div className="absolute top-2 left-2 text-sm">
                <span className="text-gray-500">Build by Zohaib Imtiaz</span>
            </div>
            <div className="max-w-md w-full bg-gray-900 bg-opacity-80 border border-green-500 rounded-lg shadow-lg p-8">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-mono font-bold mb-4">School Management System</h1>
                    <p className="text-lg">Access Your School From AnyWhere</p>
                </header>
                <form className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-mono">Username</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="username"
                            name="email"
                            className="mt-1 block w-full px-4 py-2 bg-gray-800 text-green-400 border border-green-500 rounded-md focus:border-green-300 focus:outline-none"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-mono">Password</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            name="password"
                            className="mt-1 block w-full px-4 py-2 bg-gray-800 text-green-400 border border-green-500 rounded-md focus:border-green-300 focus:outline-none"
                            placeholder="Enter your password"
                        />
                    </div>
                    <div>
                        <button
                            onClick={login}
                            type="button"
                            className="w-full py-2 px-4 bg-green-500 text-black font-mono rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HomePage;
