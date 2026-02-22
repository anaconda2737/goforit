"use client";

import { useEffect, useState } from "react";
import AdminPage from "components/AdminPage";
import { cookie } from "utils";

type ExamSummary = {
  _id: string;
  title: string;
  examType: string;
  durationMinutes: number;
  totalQuestions: number;
  updatedAt: string;
};

const sampleQuestions = [
  {
    question: "What is 2 + 2?",
    options: ["1", "2", "4", "5"],
    correctOption: 2,
    marks: 1,
  },
];

export default function AdminDashboardPage() {
  const [title, setTitle] = useState("");
  const [examType, setExamType] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [questionsJson, setQuestionsJson] = useState(JSON.stringify(sampleQuestions, null, 2));
  const [exams, setExams] = useState<ExamSummary[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const authHeaders = () => ({
    "Content-Type": "application/json",
    authorization: cookie.get("auth_token") || "",
  });

  const loadExams = async () => {
    const response = await fetch("/api/exam/admin/all", { headers: authHeaders() });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.message || "Failed to load exams");
    setExams(data);
  };

  useEffect(() => {
    loadExams().catch((err: any) => setError(err.message || "Failed to load exams"));
  }, []);

  const createExam = async () => {
    setError("");
    setMessage("");
    setIsSaving(true);
    try {
      const questions = JSON.parse(questionsJson);
      const response = await fetch("/api/exam/create", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          title,
          examType,
          description,
          durationMinutes,
          questions,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Failed to create exam");

      setMessage("Exam created successfully");
      setTitle("");
      setExamType("");
      setDescription("");
      setDurationMinutes(30);
      setQuestionsJson(JSON.stringify(sampleQuestions, null, 2));
      await loadExams();
    } catch (err: any) {
      setError(err.message || "Failed to create exam");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteExam = async (examId: string) => {
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/exam/${examId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Failed to delete exam");
      setMessage("Exam deleted");
      await loadExams();
    } catch (err: any) {
      setError(err.message || "Failed to delete exam");
    }
  };

  return (
    <AdminPage>
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
        <h1 style={{ marginTop: 0 }}>Admin Dashboard</h1>
        <p>Create tests and publish them for everyone without login.</p>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}

        <section style={{ border: "1px solid #ddd", borderRadius: 8, padding: 14 }}>
          <h2 style={{ marginTop: 0 }}>Create New Test</h2>
          <div style={{ display: "grid", gap: 10 }}>
            <input placeholder="Test title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input placeholder="Exam type (SSC, Bank, UPSC...)" value={examType} onChange={(e) => setExamType(e.target.value)} />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
            <input
              type="number"
              min={1}
              placeholder="Duration in minutes"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value || 30))}
            />
            <label>Questions JSON</label>
            <textarea
              value={questionsJson}
              onChange={(e) => setQuestionsJson(e.target.value)}
              rows={12}
              style={{ fontFamily: "monospace", fontSize: 13 }}
            />
            <button disabled={isSaving} onClick={createExam}>
              {isSaving ? "Saving..." : "Publish Test"}
            </button>
          </div>
        </section>

        <section style={{ marginTop: 20 }}>
          <h2>Published Tests</h2>
          {exams.length === 0 ? (
            <p>No tests yet.</p>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {exams.map((exam) => (
                <div
                  key={exam._id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    padding: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div>
                    <b>{exam.title}</b>
                    <p style={{ margin: "4px 0 0", color: "#666" }}>
                      {exam.examType} | {exam.totalQuestions} questions | {exam.durationMinutes} mins
                    </p>
                  </div>
                  <button onClick={() => deleteExam(exam._id)}>Delete</button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </AdminPage>
  );
}
