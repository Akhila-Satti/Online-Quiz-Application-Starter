const mongoose = require('mongoose');

// Schema for each question
const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    options: [{
        optionText: {
            type: String,
            required: true
        },
        isCorrect: {
            type: Boolean,
            default: false
        }
    }]
});

// Schema for result/participant
const resultSchema = new mongoose.Schema({
    participantName: {
        type: String,
        required: true
    },
    participantEmail: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    finishTime: {
        type: Number,
        required: true
    }
});

// Schema for the full quiz
const quizSchema = new mongoose.Schema({
    quizName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    adminPassword: {
        type: String,
        required: true
    },
    adminToken: {
        type: String,
        required: false
    },
    questions: [questionSchema],
    timerDuration: {
        type: Number,
        default: null
    },
    results: [resultSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Export model
const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;
