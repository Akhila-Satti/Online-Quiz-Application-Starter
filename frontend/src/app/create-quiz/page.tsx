"use client";
import axios from '@/utils/axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const CreateQuiz: React.FC = () => {
    const router = useRouter();
    const [formState, setFormState] = useState({
        quizName: '',
        description: '',
        startTime: '',
        endTime: '',
        timerDuration: '10',
        adminPassword: ''
    });
    
    const [errors, setErrors] = useState({
        quizName: '',
        description: '',
        startTime: '',
        endTime: '',
        adminPassword: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormState(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const validateForm = () => {
        let isValid = true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newErrors: any = {};
        
        if (!formState.quizName) {
            newErrors.quizName = 'Quiz Name is required';
            isValid = false;
        }
        
        if (!formState.description) {
            newErrors.description = 'Description is required';
            isValid = false;
        }
        
        if (!formState.startTime) {
            newErrors.startTime = 'Start time is required';
            isValid = false;
        }
        
        if (!formState.endTime) {
            newErrors.endTime = 'End Time is required';
            isValid = false;
        } else if (formState.startTime && formState.endTime && new Date(formState.startTime) >= new Date(formState.endTime)) {
            newErrors.endTime = 'End time should be later than start time';
            isValid = false;
        }
        
        if (!formState.adminPassword) {
            newErrors.adminPassword = 'Admin Password is required';
            isValid = false;
        } else if (formState.adminPassword.length < 6) {
            newErrors.adminPassword = 'Password should be at least 6 characters long';
            isValid = false;
        }
        
        setErrors(newErrors);
        return isValid;
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        
        try {
            const response = await axios.post('/user/create', formState);
            const quizID = response.data.quiz._id;
            const adminPassword = formState.adminPassword;
            const fileContent = `QuizID: ${quizID}\nPassword: ${adminPassword}`;
            
            const blob = new Blob([fileContent], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            
            a.href = url;
            a.download = `${formState.quizName}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            setFormState({
                quizName: '',
                description: '',
                startTime: '',
                endTime: '',
                timerDuration: '10',
                adminPassword: ''
            });
            
            router.push("/admin");
        } catch (error) {
            console.error('Error creating quiz:', error);
        }
    };

    return (
        <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-12 min-h-screen flex items-center justify-center">
            <div className="container mx-auto px-4 max-w-lg">
                <h2 className="text-4xl font-extrabold text-center text-white mb-8">Create a New Quiz</h2>
                <form className="bg-white shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4" onSubmit={onSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quizName">
                            Quiz Name
                        </label>
                        <input
                            className="shadow appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="quizName"
                            type="text"
                            value={formState.quizName}
                            placeholder="Enter Quiz name"
                            onChange={handleInputChange}
                        />
                        {errors.quizName && <p className="text-red-500 text-sm mt-1">{errors.quizName}</p>}
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            className="shadow appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="description"
                            value={formState.description}
                            onChange={handleInputChange}
                            placeholder="Enter quiz description"
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>
                    
                    <div className="mb-6 flex flex-wrap -mx-3">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startTime">
                                Start Time
                            </label>
                            <input
                                className="shadow appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2"
                                id="startTime"
                                type="datetime-local"
                                value={formState.startTime}
                                onChange={handleInputChange}
                            />
                            {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>}
                        </div>
                        
                        <div className="w-full md:w-1/2 px-3">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endTime">
                                End Time
                            </label>
                            <input
                                className="shadow appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2"
                                id="endTime"
                                type="datetime-local"
                                value={formState.endTime}
                                onChange={handleInputChange}
                            />
                            {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="timerDuration">
                            Timer Duration (minutes)
                        </label>
                        <div className="relative">
                            <select
                                className="shadow appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="timerDuration"
                                value={formState.timerDuration}
                                onChange={handleInputChange}
                            >
                                <option value="5">5 minutes</option>
                                <option value="10">10 minutes</option>
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="45">45 minutes</option>
                                <option value="60">60 minutes</option>
                                <option value="120">120 minutes</option>
                                <option value="180">180 minutes</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="adminPassword">
                            Set Password for Admin Access
                        </label>
                        <input
                            className="shadow appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="adminPassword"
                            type="password"
                            value={formState.adminPassword}
                            placeholder="Enter admin password"
                            onChange={handleInputChange}
                        />
                        {errors.adminPassword && <p className="text-red-500 text-sm mt-1">{errors.adminPassword}</p>}
                    </div>
                    
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                        >
                            Submit
                        </button>
                    </div>
                    
                    <p className="text-red-600 mt-2 text-sm">
                        The Unique Quiz ID will be used by participants to join the event and for admin login. Please ensure that you do not lose your ID or password, as losing them will prevent you from recovering access to the event.
                    </p>
                </form>
            </div>
        </section>
    );
};

export default CreateQuiz;