import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const QuizForm = () => {
  const [quizInfo, setQuizInfo] = useState({
    title: "",
    year: "",
    semester: "",
    subject: "",
    difficulty: "Medium",
    duration: 30,
    totalMarks: 0,
  });

  const [questions, setQuestions] = useState([
    {
      type: "MCQ",
      text: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      explanation: "",
      topic: "",
      difficulty: "Medium",
      marks: 1,
    },
  ]);

  const navigate = useNavigate();

  // Add a new question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        type: "MCQ",
        text: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        explanation: "",
        topic: "",
        difficulty: "Medium",
        marks: 1,
      },
    ]);
  };

// Function to auto-generate questions from DB
    const handleAutoGenerate = async () => {
    if (!quizInfo.subject || !quizInfo.difficulty) {
      alert("⚠️ Please select subject and difficulty first!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: quizInfo.year,
          semester: quizInfo.semester,
          subject: quizInfo.subject,
          difficulty: quizInfo.difficulty,
          count: 5, // number of questions
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to generate questions");
      }

      const data = await res.json();
      console.log("Generated questions:", data);
      setQuestions(data.questions); // 🔥 update your state with fetched questions
    } catch (err) {
      console.error(err);
      alert("❌ Auto generation failed: " + err.message);
    }
  };

  // Publish quiz
  const handlePublish = async () => {
  if (!quizInfo.title || questions.length === 0) {
    alert("⚠️ Please fill required fields!");
    return;
  }

  // ✅ Calculate total marks
  const totalMarks = questions.reduce(
    (sum, q) => sum + Number(q.marks),
    0
  );

  try {
    const response = await fetch("http://localhost:5000/api/quiz/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...quizInfo,
        totalMarks, // ✅ important
        questions: questions.map((q) => ({
          type: q.type,
          text: q.text,
          options:
            q.type === "MCQ"
              ? q.options
              : q.type === "TrueFalse"
              ? ["True", "False"]
              : [],
          correctAnswer: q.answer, // ✅ THIS LINE FIXES YOUR ERROR
          explanation: q.explanation,
          subject:q.subject,
          difficulty: q.difficulty,
          marks: Number(q.marks),
        }))
      }),
    });

    const data = await response.json();
    console.log("Response:", data); // 🔍 DEBUG

    if (!response.ok) {
      throw new Error(data.message || "Failed to publish quiz");
    }

    alert("✅ Quiz Published!");
    navigate("/question-bank");
  } catch (error) {
    console.error("Error:", error);
    alert("❌ Failed to save quiz");
  }

  const { id } = useParams(); // get quiz id from URL

  
  const prompt = `Generate 5 ${difficulty} level MCQ questions for ${subject}`;

  useEffect(() => {
    if (id) {
      // fetch quiz for editing
      const fetchQuiz = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/quiz/${id}`);
          const data = await res.json();
          setQuizInfo({
            title: data.title,
            year: data.year,
            semester: data.semester,
            subject: data.subject,
            difficulty: data.difficulty,
            duration: data.duration,
            totalMarks: data.totalMarks,
          });
          setQuestions(data.questions);
        } catch (err) {
          console.error(err);
        }
      };
      fetchQuiz();
    }
  }, [id]);
};
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>Create New Quiz</h2>

      {/* Quiz Information */}
      <div className="glass-panel" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1.3rem", marginBottom: "1.2rem" }}>Quiz Information</h3>
        <div className="grid grid-cols-2 gap-6">
          
          {/* Year */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Academic Year</label>
            <select  className="modern-select"
              value={quizInfo.year}
              onChange={(e) =>
                setQuizInfo({ ...quizInfo, year: e.target.value })
              }
            >
              <option value="">Select year</option>
              <option>2022</option>
              <option>2023</option>
              <option>2024</option>
              <option>2025</option>
              <option>2026</option>
            </select>
          </div>

          {/* Semester */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Semester</label>
            <select  className="modern-select"
              value={quizInfo.semester}
              onChange={(e) =>
                setQuizInfo({ ...quizInfo, semester: e.target.value })
              }
            >
              <option value="">Select semester</option>
              <option>Semester 1</option>
              <option>Semester 2</option>
            </select>
          </div>

          {/* Subject */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Subject</label>
            <select  className="modern-select"
              value={quizInfo.subject}
              onChange={(e) =>
                setQuizInfo({ ...quizInfo, subject: e.target.value })
              }
            >
              <option value="">Select subject</option>
              <option>OOP</option>
              <option>SE</option>
              <option>DBMS</option>
              <option>IWT</option>
              <option>DSA</option>
              <option>DS</option>
            </select>
          </div>

          {/* Title */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Quiz Title</label>
            <input  className="modern-input"
              placeholder="Enter quiz title"
              value={quizInfo.title}
              onChange={(e) => {
                const value = e.target.value;
                const isValid = /^[A-Za-z][A-Za-z0-9\s]*$/.test(value);
                if (value === "" || isValid) {
                  setQuizInfo({ ...quizInfo, title: value });
                }
              }}
            />
          </div>

          {/* Difficulty */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Difficulty</label>
            <select  className="modern-select"
              value={quizInfo.difficulty}
              onChange={(e) =>
                setQuizInfo({ ...quizInfo, difficulty: e.target.value })
              }
            >
              <option>Select</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          {/* Duration */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Duration (minutes)</label>
            <input type="number"
               className="modern-input"
              value={quizInfo.duration}
              onChange={(e) =>
                setQuizInfo({ ...quizInfo, duration: Number(e.target.value) })
              }
            />
          </div>

          {/* Total Marks */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Total Marks</label>
            <input type="number"
              min={0}
               className="modern-input"
              value={quizInfo.totalMarks}
              onChange={(e) =>
                setQuizInfo({ ...quizInfo, totalMarks: Number(e.target.value) })
              }
            />
          </div>
        </div>
      </div>

      {/* Questions */}
      {questions.map((q, idx) => (
        <div key={idx} className="glass-panel" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "1.3rem", marginBottom: "1.2rem" }}>Question {idx + 1}</h3>

          {/* Question Type */}
          <div className="flex flex-col mb-2">
            <label className="font-semibold mb-1">Question Type</label>
            <select  className="modern-select"
              value={q.type}
              onChange={(e) => {
                const updated = [...questions];
                updated[idx].type = e.target.value;
                updated[idx].answer = ""; // reset answer
                setQuestions(updated);
              }}
            >
              <option value="MCQ">Multiple Choice</option>
              <option value="TrueFalse">True / False</option>
              <option value="ShortAnswer">Short Answer</option>
            </select>
          </div>

          {/* Question Text */}
          <div className="flex flex-col mb-2">
            <label className="font-semibold mb-1">Question</label>
            <input  className="modern-input"
              placeholder="Enter your question..."
              value={q.text}
              onChange={(e) => {
                const updated = [...questions];
                updated[idx].text = e.target.value;
                setQuestions(updated);
              }}
            />
          </div>

          {/* Options */}
          {q.type === "MCQ" && (
            <div className="flex flex-col mb-2">
              <label className="font-semibold mb-1">Options</label>
              {q.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2 mb-1">
                  <input
                    type="radio"
                    name={`q${idx}`}
                    value={q.options[i]}
                    checked={q.answer === q.options[i]}
                    onChange={() => {
                      const updated = [...questions];
                      updated[idx].answer = updated[idx].options[i];
                      setQuestions(updated);
                    }}
                  />
                  <input
                    className="modern-input flex-1"
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[idx].options[i] = e.target.value;
                      setQuestions(updated);
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* True/False */}
          {q.type === "TrueFalse" && (
            <div className="flex flex-col mb-2">
              <label className="font-semibold mb-1">Options</label>
              <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    name={`q${idx}`}
                    value="True"
                    checked={q.answer === "True"}
                    onChange={() => {
                      const updated = [...questions];
                      updated[idx].answer = "True";
                      setQuestions(updated);
                    }}
                  />{" "}
                  True
                </label>
                <label>
                  <input
                    type="radio"
                    name={`q${idx}`}
                    value="False"
                    checked={q.answer === "False"}
                    onChange={() => {
                      const updated = [...questions];
                      updated[idx].answer = "False";
                      setQuestions(updated);
                    }}
                  />{" "}
                  False
                </label>
              </div>
            </div>
          )}
          {q.type === "ShortAnswer" && (
            <div className="flex flex-col mb-2">
              <label className="font-semibold mb-1">Correct Answer</label>
              <input type="text"
                 className="modern-input"
                placeholder="Enter correct answer..."
                value={q.answer || ""}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[idx].answer = e.target.value;
                  setQuestions(updated);
                }}
              />
            </div>
          )}

          {/* Explanation */}
          <div className="flex flex-col mb-2">
            <label className="font-semibold mb-1">Explanation</label>
            <textarea  className="modern-input"
              placeholder="Explain why this is correct..."
              value={q.explanation}
              onChange={(e) => {
                const updated = [...questions];
                updated[idx].explanation = e.target.value;
                setQuestions(updated);
              }}
            />
          </div>

          {/* Marks */}
          <div className="flex flex-col mb-2">
            <label className="font-semibold mb-1">Marks</label>
            <input type="number"
              min={0}
               className="modern-input"
              value={q.marks}
              onChange={(e) => {
                const updated = [...questions];
                updated[idx].marks = Number(e.target.value);
                setQuestions(updated);
              }}
            />
          </div>
        </div>
      ))}

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={addQuestion}
          className="btn-modern-primary" style={{ background: "linear-gradient(135deg, #f97316, #fb923c)" }}
        >
          + Add Question
        </button>

        <button
          onClick={handlePublish}
          className="btn-modern-primary" style={{ background: "linear-gradient(135deg, #10b981, #34d399)" }}
        >
          Publish Quiz
        </button>

        <button
          onClick={handleAutoGenerate}
          className="btn-modern-primary"
        >
          ⚡ Auto Generate Questions
        </button>
      </div>
      
    </div>
  );
};

export default QuizForm;