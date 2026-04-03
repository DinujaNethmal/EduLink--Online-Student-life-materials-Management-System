import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/result");
        setResults(res.data);
      } catch (err) {
        console.error("Error fetching results:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  return (
    <div style={{ background: "rgba(255,255,255,0.05)" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>Student Results</h2>

      {loading ? (
        <p className="text-gray-500">Loading results...</p>
      ) : results.length === 0 ? (
        <p className="text-gray-500">No results found</p>
      ) : (
        results.map((r, idx) => {
          const percentage = r.total
            ? ((r.score / r.total) * 100).toFixed(0)
            : 0;

          return (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-5 mb-4 flex justify-between items-center hover:shadow-lg transition"
            >
              {/* LEFT SIDE */}
              <div>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1.2rem" }}>
                  {r.studentName || "Unknown Student"}
                </h3>

                <p className="text-blue-500 text-sm">
                  {r.email || "No Email"}
                </p>

                <p className="text-gray-500 text-sm">
                  {r.quiz?.subject || "N/A"} •{" "}
                  {r.quiz?.year || "N/A"}
                </p>
              </div>

              {/* RIGHT SIDE */}
              <div className="flex gap-10 items-center">
                {/* Quizzes Attempted */}
                <div className="text-center">
                  <p className="text-gray-400 text-xs">
                    QUIZZES ATTEMPTED
                  </p>
                  <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>1</h3>
                </div>

                {/* Average Score */}
                <div className="text-center">
                  <p className="text-gray-400 text-xs">
                    AVERAGE SCORE
                  </p>
                  <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                    {percentage}%
                  </h3>
                </div>

                {/* Dropdown icon */}
                <div className="text-blue-500 cursor-pointer">
                  ▼
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default StudentResults;