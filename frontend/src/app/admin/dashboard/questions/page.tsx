"use client";
import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import axios from "@/utils/axios";
import { toast } from "react-toastify";

interface Option {
  optionText: string;
  isCorrect: boolean;
}

interface Question {
  questionText: string;
  options: Option[];
}

const MCQCreator: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [errors, setErrors] = useState<boolean[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("/admin/questions", {
          withCredentials: true,
        });
        setQuestions(response.data.questions);
      } catch (error) {
        console.error("Error fetching quiz questions", error);
      }
    };
    fetchQuestions();
  }, []);

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (
    qIndex: number,
    optIndex: number,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex].optionText = value;
    setQuestions(newQuestions);
  };

  const addOption = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push({ optionText: "", isCorrect: false });
    setQuestions(newQuestions);
  };

  const removeOption = (qIndex: number, optIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.splice(optIndex, 1);
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: [
          { optionText: "", isCorrect: false },
          { optionText: "", isCorrect: false },
          { optionText: "", isCorrect: false },
          { optionText: "", isCorrect: false },
        ],
      },
    ]);
    setErrors([...errors, false]);
  };

  const removeQuestion = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(qIndex, 1);
    setQuestions(newQuestions);
    setErrors(errors.filter((_, index) => index !== qIndex));
  };

  const handleCorrectOptionChange = (qIndex: number, optIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.forEach((option, index) => {
      option.isCorrect = index === optIndex;
    });
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = questions.map((question) =>
      question.options.every((option) => !option.isCorrect)
    );
    if (newErrors.some((hasError) => hasError)) {
      setErrors(newErrors);
      toast.error("Please select an answer for each question");
      return;
    }

    try {
      await axios.put("/admin/questions", { questions }, { withCredentials: true });
      toast.success("Questions updated successfully!");
    } catch (error) {
      console.error("Error updating quiz questions:", error);
      toast.error("Error updating questions");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parsedData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const newQuestions = parsedData.slice(1).map((row) => ({
        questionText: row[0] || "",
        options: [
          { optionText: row[1] || "", isCorrect: false },
          { optionText: row[2] || "", isCorrect: false },
          { optionText: row[3] || "", isCorrect: false },
          { optionText: row[4] || "", isCorrect: false },
        ],
      }));

      newQuestions.forEach((question, index) => {
        const correctIndex = parsedData[index + 1][5]
          ? parseInt(parsedData[index + 1][5], 10) - 1
          : null;
        if (correctIndex !== null && correctIndex >= 0 && correctIndex < 4) {
          question.options[correctIndex].isCorrect = true;
        }
      });

      setQuestions(newQuestions);
      setErrors(Array(newQuestions.length).fill(false));
    };

    reader.readAsBinaryString(file);
  };

  const resetForm = () => {
    setQuestions([
      {
        questionText: "",
        options: [
          { optionText: "", isCorrect: false },
          { optionText: "", isCorrect: false },
          { optionText: "", isCorrect: false },
          { optionText: "", isCorrect: false },
        ],
      },
    ]);
    setErrors([false]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadSampleExcel = () => {
    const sampleData = [
      [
        "Question Text",
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4",
        "Correct Option(1-4)",
      ],
      ["What is 2 + 2?", "3", "4", "5", "6", "2"],
      ["What is the capital of France?", "London", "Berlin", "Paris", "Madrid", "3"],
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(sampleData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sample");
    XLSX.writeFile(workbook, "mcq_sample_format.xlsx");
  };

  return (
    <section className="py-12 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          MCQ Creator
        </h2>

        <div className="bg-blue-100 rounded-lg p-4 text-gray-800 mb-6">
          <p>
            Welcome to the MCQ Creator! You can create multiple-choice questions
            manually or upload a formatted Excel file.
          </p>
        </div>

        {/* Upload Excel */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Upload Excel File
          </label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            ref={fileInputRef}
            className="border border-gray-300 rounded-full py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-8">
          <button
            type="button"
            onClick={downloadSampleExcel}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Download Sample Excel
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="ml-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg"
          >
            Reset Form
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-300 shadow-sm rounded-lg px-8 pt-6 pb-8"
        >
          {questions.map((question, qIndex) => (
            <div key={qIndex} className="border-b p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-gray-700 text-sm font-medium">
                  Question {qIndex + 1}
                </label>
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg"
                >
                  Remove Question
                </button>
              </div>
              <input
                type="text"
                value={question.questionText}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                placeholder="Type your question here..."
                className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <div className={`mt-4 space-y-2 ${errors[qIndex] ? "text-red-500" : ""}`}>
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={option.isCorrect}
                      onChange={() => handleCorrectOptionChange(qIndex, optIndex)}
                    />
                    <input
                      type="text"
                      value={option.optionText}
                      onChange={(e) =>
                        handleOptionChange(qIndex, optIndex, e.target.value)
                      }
                      placeholder={`Option ${optIndex + 1}`}
                      className="border border-gray-300 rounded w-full py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(qIndex, optIndex)}
                      className="bg-red-300 hover:bg-red-500 text-white px-2 py-1 rounded-lg"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addOption(qIndex)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded-lg"
                >
                  Add Option
                </button>
              </div>
            </div>
          ))}

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={addQuestion}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg"
            >
              Add Question
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              Save Questions
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default MCQCreator;
