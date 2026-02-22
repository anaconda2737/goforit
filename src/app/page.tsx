import Link from "next/link";
import { connectDb } from "lib/db";
import Exam from "lib/models/exam";

export const dynamic = "force-dynamic";

const getHomeData = async () => {
  await connectDb();

  const exams = await Exam.find({}, { title: 1, examType: 1, durationMinutes: 1, questions: 1, updatedAt: 1 })
    .sort({ updatedAt: -1 })
    .lean();

  return { exams };
};

export default async function Home() {
  const { exams } = await getHomeData();

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "32px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h1 style={{ margin: 0 }}>Testbook Lite</h1>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/tests">All Tests</Link>
          <Link href="/auth/login">Admin Login</Link>
          <Link href="/admin/dashboard">Admin Dashboard</Link>
        </div>
      </div>

      {exams.length === 0 ? (
        <p style={{ marginTop: 16 }}>No tests available yet.</p>
      ) : (
        <div
          style={{
            marginTop: 20,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 12,
          }}
        >
          {exams.map((exam: any) => (
            <Link
              key={exam._id.toString()}
              href={`/tests/${exam._id.toString()}`}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 14,
                textDecoration: "none",
                color: "inherit",
                background: "#fff",
              }}
            >
              <h3 style={{ margin: 0, fontSize: 18 }}>{exam.title || "Untitled Test"}</h3>
              <p style={{ margin: "6px 0 0", fontSize: 12, color: "#666" }}>
                {exam.examType} | {(exam.questions || []).length} questions | {exam.durationMinutes || 30} mins
              </p>
              <p style={{ margin: "8px 0 0", fontSize: 12, color: "#666" }}>
                Updated: {new Date(exam.updatedAt).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
