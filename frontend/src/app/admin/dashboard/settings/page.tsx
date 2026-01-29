/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { toast } from 'react-toastify';

const Page = () => {
    const [timerDuration, setTimerDuration] = useState('10');
    const [quizName, setQuizName] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [quizID, setQuizID] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchQuizDetails = async () => {
            try {
                const response = await axios.get('/admin/basic-details');
                const data = response.data;
                setQuizName(data.quizName);
                setDescription(data.description);
                setTimerDuration(data.timerDuration);
                setQuizID(data.quizID);

                const formatDateTime = (dateTime: any) => {
                    const date = new Date(dateTime);
                    return date.toISOString().slice(0, 16);
                };

                setStartTime(formatDateTime(data.startTime));
                setEndTime(formatDateTime(data.endTime));
            } catch (error) {
                console.error('Failed to fetch quiz details', error);
            }
        };
        fetchQuizDetails();
    }, []);

    const onSubmit = async (e: any) => {
        e.preventDefault();
        const quizData = {
            quizName,
            description,
            startTime,
            endTime,
            timerDuration,
            adminPassword,
        };
        try {
            const response = await axios.put('/admin/basic-details', quizData);
            if (response.status === 200) {
                toast.success("Settings updated.");
            } else {
                console.error('Error updating quiz', response.data.message);
                alert('Failed to update quiz details. Please try again.');
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <section className="flex items-center justify-center">
                <div className="container px-4">
                    <form className="rounded-lg pt-6 pb-8" onSubmit={onSubmit}>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="quizName">
                                Quiz Name
                            </label>
                            <input
                                className="border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                id="quizName"
                                type="text"
                                placeholder="Enter quiz name"
                                value={quizName}
                                onChange={(e) => setQuizName(e.target.value)}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
                                Description
                            </label>
                            <textarea
                                className="border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                id="description"
                                placeholder="Enter quiz description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="mb-6 flex flex-wrap -mx-3">
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startTime">
                                    Start Time
                                </label>
                                <input
                                    className="border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    id="startTime"
                                    type="datetime-local"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endTime">
                                    End Time
                                </label>
                                <input
                                    className="border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    id="endTime"
                                    type="datetime-local"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="timerDuration">
                                Timer Duration (minutes)
                            </label>
                            <div className="relative">
                                <select
                                    className="shadow appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    id="timerDuration"
                                    value={timerDuration}
                                    onChange={(e) => setTimerDuration(e.target.value)}
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Unique Quiz ID
                            </label>
                            <p className="block text-gray-700 text-sm">{quizID}</p>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="adminPassword">
                                Set New Password for Admin Access
                            </label>
                            <input
                                className="border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                id="adminPassword"
                                type="password"
                                placeholder="Enter admin password"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                            >
                                Submit
                            </button>
                        </div>
                        <p className="text-red-500 mt-4 text-sm">
                            Unique Quiz ID will be used by participants to join the event. Losing ID or password will result in loss of access to the quiz.
                        </p>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Page;
