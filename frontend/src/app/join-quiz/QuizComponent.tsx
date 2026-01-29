"use client";
import FullPageLoading from "@/components/FullPageLoading";
import axios from "@/utils/axios";
import React, { useState, useEffect } from "react";

interface Option {
  optionText: string;
  isCorrect: boolean;
}

interface Question {
  questionText: string;
  options: Option[];
}

interface QuizProps {
  questions: Question[];
  durationInSeconds?: number;
  email: string;
  quizId: string;
}

const Quiz: React.FC<QuizProps> = ({ questions, durationInSeconds, email, quizId }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );
  const [timeLeft, setTimeLeft] = useState(durationInSeconds || 0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [finishTime, setFinishTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (durationInSeconds && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            handleSubmit();
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, durationInSeconds]);

  const handleOptionSelect = (optionIndex: number) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    const finishTimeInMilliseconds = Date.now() - startTime;
    const seconds = Math.floor(finishTimeInMilliseconds / 1000);
    const milliseconds = finishTimeInMilliseconds % 1000;
    const formattedFinishTime = `${seconds}.${milliseconds.toString().padStart(3, "0")}`;

    setFinishTime(Number(formattedFinishTime));

    let score = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer !== null && questions[index].options[answer].isCorrect) {
        score += 1;
      }
    });

    const requestBody = {
      participantEmail: email,
      score,
      time: formattedFinishTime,
    };

    try {
      const response = await axios.post(`/user/savequiz/${quizId}`, requestBody);
      if (response.status === 200) {
        console.log("Quiz saved successfully:", response.data);
      } else {
        console.error("Failed to save quiz:", response.statusText);
      }
    } catch (error) {
      console.error("Error while saving quiz:", error);
    } finally {
      setLoading(false);
      setQuizCompleted(true);
    }
  };

  if (quizCompleted) {
    const score = selectedAnswers.filter(
      (answer, index) =>
        answer !== null && questions[index].options[answer]?.isCorrect
    ).length;

    return (
      <div className="p-8 text-white text-center">
        <h2 className="text-3xl font-bold">Quiz Completed</h2>
        <p className="mt-4 text-lg">Thank you for participating in the quiz.</p>

        {finishTime !== null && (
          <p className="mt-4 text-lg">Time Taken: {finishTime} seconds</p>
        )}

        <p className="mt-4 text-lg">
          Your Score: {score} / {questions.length}
        </p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return !loading ? (
    <div className="w-full h-full flex flex-col items-center justify-center px-8 text-white space-y-8">
      <h2 className="text-4xl font-bold mb-8">Quiz</h2>

      {durationInSeconds && (
        <div className="mb-6 text-xl text-gray-300">
          <span>
            Time left: {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </span>
        </div>
      )}

      <div className="max-w-3xl text-center">
        <h3 className="text-2xl font-medium mb-6">
          {`Q${currentQuestionIndex + 1}: ${currentQuestion.questionText}`}
        </h3>
      </div>

      <div className="w-full max-w-xl space-y-4">
        {currentQuestion.options.map((option: Option, index: number) => (
          <div
            key={index}
            className="text-left border border-gray-700 rounded-lg hover:bg-gray-800 transition duration-150"
          >
            <label className="flex items-center space-x-3 p-4">
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={index}
                checked={selectedAnswers[currentQuestionIndex] === index}
                onChange={() => handleOptionSelect(index)}
                className="h-5 w-5 text-blue-500 focus:ring-blue-500 border-gray-400"
              />
              <span className="text-lg">{option.optionText}</span>
            </label>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-between w-full max-w-xl">
        <button
          onClick={handleBack}
          disabled={currentQuestionIndex === 0}
          className={`px-6 py-3 rounded-lg font-semibold text-white border border-gray-400 ${
            currentQuestionIndex === 0
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={currentQuestionIndex === questions.length - 1}
          className={`px-6 py-3 rounded-lg font-semibold text-white ${
            currentQuestionIndex === questions.length - 1
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg"
        >
          Submit Quiz
        </button>
      </div>
    </div>
  ) : (
    <FullPageLoading />
  );
};
const QuizComponent:React.FC<QuizProps>=({questions,durationInSeconds,email,quizId})=>{
  return(
    <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-12 min-h-screen flex items-center justify-center">
      <Quiz questions={questions} durationInSeconds={durationInSeconds} email={email} quizId={quizId}/>
    </section>
  );
};
export default QuizComponent;
