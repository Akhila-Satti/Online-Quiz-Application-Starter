"use client";
import React, { useState, useEffect } from "react";
import axios from "@/utils/axios";
import QuizComponent from "./QuizComponent";
import { toast } from "react-toastify";

const JoinQuiz: React.FC = () => {
    const [quizId, setQuizId] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizEnded, setQuizEnded] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [quizData, setQuizData] = useState<any>();
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        if (quizData && !quizStarted) {
            const startTime = new Date(quizData.startTime).getTime();
            const endTime = new Date(quizData.endTime).getTime();
            const now = Date.now();

            if (now >= endTime) {
                setQuizEnded(true);
            }

            if (now < startTime) {
                const timeUntilStart = startTime - now;
                setTimeLeft(timeUntilStart);
                
                const countdownInterval = setInterval(() => {
                    const timeLeft = startTime - Date.now();
                    setTimeLeft(timeLeft);
                    if (timeLeft <= 0) {
                        clearInterval(countdownInterval);
                        setQuizStarted(true);
                    }
                }, 1000);

                return () => clearInterval(countdownInterval);
            } else {
                setQuizStarted(true);
            }
        }
    }, [quizData, quizStarted]);

    const formatTimeLeft = (milliseconds: number) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return {
            hours: hours.toString().padStart(2, "0"),
            minutes: minutes.toString().padStart(2, "0"),
            seconds: seconds.toString().padStart(2, "0"),
        };
    };

    const handleJoinQuiz = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/user/joinQuiz/${quizId}`, {
                userName,
                email,
            });
            if (response.data) {
                setQuizData(response.data.quiz);
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.response.data.message);
            console.error("Error joining the quiz:", error);
        }
    };

    if (quizEnded) {
        return (
            <section className="bg-red-600 text-white h-screen flex items-center justify-center">
                <h2 className="text-4xl font-bold">The quiz has Ended!</h2>
            </section>
        );
    }

    if (quizStarted && quizData) {
        return (
            <QuizComponent
                email={email}
                quizId={quizId}
                questions={quizData.questions}
                durationInSeconds={quizData.timerDuration * 60}
            />
        );
    }

    if (timeLeft > 0) {
        const { hours, minutes, seconds } = formatTimeLeft(timeLeft);
        return (
            <div className="bg-black text-white h-screen flex flex-col items-center justify-center">
                <div className="flex space-x-4">
                    <div className="text-center">
                        <div className="text-6xl font-bold bg-gray-800 rounded-lg p-4">
                            {hours}
                        </div>
                        <div className="text-lg mt-2">Hours</div>
                    </div>
                    <div className="text-center">
                        <div className="text-6xl font-bold bg-gray-800 rounded-lg p-4">
                            {minutes}
                        </div>
                        <div className="text-lg mt-2">minutes</div>
                    </div>
                    <div className="text-center">
                        <div className="text-6xl font-bold bg-gray-800 rounded-lg p-4">
                            {seconds}
                        </div>
                        <div className="text-lg mt-2">seconds</div>
                    </div>
                </div>
                <p className="text-2xl text-red-600 mt-8">
                    Do not leave this screen or you wont be able to join the quiz again with the same email!
                </p>
            </div>
        );
    }

    return (
        <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-12 min-h-screen flex items-center justify-center">
            <div className="container mx-auto px-4 max-w-lg">
                <h2 className="text-4xl font-extrabold text-center text-white mb-8">Join a Quiz</h2>
                <form className="bg-white shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4" onSubmit={handleJoinQuiz}>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quizId">
                            Quiz ID
                        </label>
                        <input
                            className="shadow appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="quizId"
                            type="text"
                            value={quizId}
                            onChange={(e) => setQuizId(e.target.value)}
                            placeholder="Enter Quiz ID"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userName">
                            Your Name
                        </label>
                        <input
                            className="shadow appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="userName"
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Enter your name"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                        >
                            Join Quiz
                        </button>
                    </div>
                    <p className="text-red-600 mt-2 text-sm">
                        Once you have entered the quiz, if quiz is not started and timer is visible, do not leave the screen otherwise you wont be able to join again with the same email.
                    </p>
                </form>
            </div>
        </section>
    );
};

export default JoinQuiz;