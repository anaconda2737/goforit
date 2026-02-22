import Link from "next/link";
import { connectDb } from "lib/db";
import Exam from "lib/models/exam";

export const dynamic = "force-dynamic";

export default async function TestsPage() {
  await connectDb();

  const exams = await Exam.find(
    {},
    { title: 1, examType: 1, description: 1, durationMinutes: 1, questions: 1, updatedAt: 1 }
  )
    .sort({ updatedAt: -1 })
    .lean();

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "32px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>Test Series</h1>
        <Link href="/">Home</Link>
      </div>

      {exams.length === 0 ? (
        <p style={{ marginTop: 16 }}>No tests available yet.</p>
      ) : (
        <div
          style={{
            marginTop: 20,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
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
              }}
            >
              <h3 style={{ margin: 0 }}>{exam.title}</h3>
              <p style={{ margin: "6px 0", fontSize: 13, color: "#555" }}>{exam.examType}</p>
              <p style={{ margin: "6px 0", fontSize: 12, color: "#777" }}>
                {(exam.questions || []).length} questions | {exam.durationMinutes || 30} mins
              </p>
              {exam.description && (
                <p style={{ margin: "8px 0 0", fontSize: 12, color: "#666" }}>{exam.description}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
