"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../../exam-pages.module.scss";

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

  if (isLoading) return <div className={styles.stateBox}>Loading test...</div>;
  if (error) return <div className={styles.stateBox}>{error}</div>;
  if (!exam) return <div className={styles.stateBox}>Test not found.</div>;

  return (
    <main className={styles.page}>
      <div className={styles.contentHeader}>
        <h1 className={styles.title}>{exam.title}</h1>
        <button className={styles.btnSecondary} onClick={() => router.push("/tests")}>
          Back
        </button>
      </div>
      <p className={styles.metaLarge}>
        {exam.examType} | {exam.durationMinutes || 30} mins
      </p>
      {exam.description && <p className={styles.descriptionLarge}>{exam.description}</p>}

      {!result ? (
        <>
          <div className={styles.questionGrid}>
            {exam.questions.map((q, qIndex) => (
              <section key={q.id} className={styles.questionCard}>
                <h3 className={styles.questionTitle}>
                  Q{qIndex + 1}. {q.question}
                </h3>
                <div className={styles.optionList}>
                  {q.options.map((option, optIndex) => (
                    <label key={optIndex} className={styles.optionLabel}>
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

          <div className={styles.actions}>
            <button className={styles.btnPrimary} onClick={submitTest} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Test"}
            </button>
          </div>
        </>
      ) : (
        <section className={styles.resultCard}>
          <h2 className={styles.resultTitle}>Result</h2>
          <p className={styles.resultMeta}>Score: {result.score} / {result.totalMarks}</p>
          <p className={styles.resultMeta}>Attempted: {result.attempted} / {result.totalQuestions}</p>
          <p className={styles.resultMeta}>Percentage: {result.percentage}%</p>
          <div className={styles.actions}>
            <button className={styles.btnPrimary} onClick={() => router.push("/tests")}>
              Go to Tests
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
