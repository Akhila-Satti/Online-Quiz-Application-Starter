const Quiz = require('../models/QuizModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'admin123';

const adminLogin = async (req, res) => {
    try {
        const { quizID, adminPassword } = req.body;
        const quiz = await Quiz.findById(quizID);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        const isPasswordValid = await bcrypt.compare(adminPassword, quiz.adminPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ quizID: quiz._id }, JWT_SECRET, { expiresIn: '7d' });
        quiz.adminToken = token;
        await quiz.save();

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // lowercase 'production'
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'lax', // better for localhost/dev
        });

        return res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getQuizResults = async (req, res) => {
    try {
        const quizID = req.quiz.quizID;
        const quiz = await Quiz.findById(quizID);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        return res.status(200).json({
            quizName: quiz.quizName,
            results: quiz.results.map(result => ({
                participantName: result.participantName,
                participantEmail: result.participantEmail,
                score: result.score,
                finishTime: result.finishTime,
            })),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getQuizQuestions = async (req, res) => {
    try {
        const quizID = req.quiz.quizID;
        const quiz = await Quiz.findById(quizID);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        return res.status(200).json({
            quizName: quiz.quizName,
            questions: quiz.questions,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const updateQuizQuestions = async (req, res) => {
    try {
        const quizID = req.quiz.quizID;
        const { questions } = req.body;
        const quiz = await Quiz.findById(quizID);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        quiz.questions = questions;
        await quiz.save();
        return res.status(200).json({ message: 'Quiz questions updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getQuizDetails = async (req, res) => {
    try {
        const quizID = req.quiz.quizID;
        const quiz = await Quiz.findById(quizID);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        const basicDetails = {
            quizName: quiz.quizName,
            description: quiz.description,
            startTime: quiz.startTime,
            endTime: quiz.endTime,
            timerDuration: quiz.timerDuration,
            quizID: quiz._id,
        };
        return res.status(200).json(basicDetails);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const updateQuizDetails = async (req, res) => {
    try {
        const quizID = req.quiz.quizID;
        const { quizName, description, startTime, endTime, timerDuration, adminPassword } = req.body;
        const quiz = await Quiz.findById(quizID);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        if (quizName) quiz.quizName = quizName;
        if (description) quiz.description = description;
        if (startTime) quiz.startTime = new Date(startTime);
        if (endTime) quiz.endTime = new Date(endTime);
        if (timerDuration) quiz.timerDuration = timerDuration;
        if (adminPassword) {
            // Hash the new password before saving
            const salt = await bcrypt.genSalt(10);
            quiz.adminPassword = await bcrypt.hash(adminPassword, salt);
        }
        await quiz.save();
        return res.status(200).json({ message: 'Quiz details updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getQuizResults,
    getQuizQuestions,
    updateQuizQuestions,
    updateQuizDetails,
    getQuizDetails,
    adminLogin,
};
