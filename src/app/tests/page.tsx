import Link from "next/link";
import { connectDb } from "lib/db";
import Exam from "lib/models/exam";
import styles from "../exam-pages.module.scss";

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
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Goforit Tests</h1>
        <Link className={styles.link} href="/">
          Home
        </Link>
      </div>

      {exams.length === 0 ? (
        <p className={styles.emptyState}>No tests available yet.</p>
      ) : (
        <div className={`${styles.grid} ${styles.gridWide}`.trim()}>
          {exams.map((exam: any) => (
            <Link
              key={exam._id.toString()}
              href={`/tests/${exam._id.toString()}`}
              className={styles.card}
            >
              <h3 className={styles.cardTitle}>{exam.title}</h3>
              <p className={styles.meta}>{exam.examType}</p>
              <p className={styles.meta}>
                {(exam.questions || []).length} questions | {exam.durationMinutes || 30} mins
              </p>
              {exam.description && (
                <p className={styles.description}>{exam.description}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
