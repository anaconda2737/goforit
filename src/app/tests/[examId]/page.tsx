"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Question = {
  id: number;
  question: string;
  options: string[];
  marks: number;
};

type ExamDetail = {
  _id: string;
  title: string;
  examType: string;
  description: string;
  durationMinutes: number;
  questions: Question[];
};

type Result = {
  title: string;
  examType: string;
  totalQuestions: number;
  attempted: number;
  score: number;
  totalMarks: number;
  percentage: number;
};

export default function ExamAttemptPage() {
  const params = useParams<{ examId: string }>();
  const router = useRouter();
  const examId = params?.examId || "";

  const [exam, setExam] = useState<ExamDetail | null>(null);
  const [answers, setAnswers] = useState<Array<number | null>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!examId) return;

    const loadExam = async () => {
      try {
        const response = await fetch(`/api/exam/${examId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data?.message || "Failed to load test");

        setExam(data);
        setAnswers(new Array(data.questions.length).fill(null));
      } catch (err: any) {
        setError(err.message || "Failed to load test");
      } finally {
        setIsLoading(false);
      }
    };

    loadExam();
  }, [examId]);

  const setAnswer = (questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[questionIndex] = optionIndex;
      return copy;
    });
  };

  const submitTest = async () => {
    if (!exam) return;
    setSubmitting(true);
    try {
      const response = await fetch(`/api/exam/${examId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Failed to submit test");
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to submit test");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <div style={{ padding: 20 }}>Loading test...</div>;
  if (error) return <div style={{ padding: 20 }}>{error}</div>;
  if (!exam) return <div style={{ padding: 20 }}>Test not found.</div>;

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>{exam.title}</h1>
        <button onClick={() => router.push("/tests")}>Back</button>
      </div>
      <p style={{ marginTop: 8, color: "#666" }}>
        {exam.examType} | {exam.durationMinutes || 30} mins
      </p>
      {exam.description && <p style={{ color: "#444" }}>{exam.description}</p>}

      {!result ? (
        <>
          <div style={{ marginTop: 16, display: "grid", gap: 14 }}>
            {exam.questions.map((q, qIndex) => (
              <section key={q.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
                <h3 style={{ marginTop: 0 }}>
                  Q{qIndex + 1}. {q.question}
                </h3>
                <div style={{ display: "grid", gap: 8 }}>
                  {q.options.map((option, optIndex) => (
                    <label key={optIndex} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <input
                        type="radio"
                        checked={answers[qIndex] === optIndex}
                        onChange={() => setAnswer(qIndex, optIndex)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div style={{ marginTop: 16 }}>
            <button onClick={submitTest} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Test"}
            </button>
          </div>
        </>
      ) : (
        <section style={{ marginTop: 16, border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
          <h2 style={{ marginTop: 0 }}>Result</h2>
          <p>Score: {result.score} / {result.totalMarks}</p>
          <p>Attempted: {result.attempted} / {result.totalQuestions}</p>
          <p>Percentage: {result.percentage}%</p>
          <button onClick={() => router.push("/tests")}>Go to Tests</button>
        </section>
      )}
    </main>
  );
}
