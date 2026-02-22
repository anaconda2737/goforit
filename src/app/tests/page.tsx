import Link from "next/link";
import { connectDb } from "lib/db";
import Exam from "lib/models/exam";
import styles from "../exam-pages.module.scss";
import { googleFormIcon } from "utils";

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
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.brandIcon}>{googleFormIcon}</span>
          <span>Goforit</span>
        </div>
        <div className={styles.headerRight}>
          <Link className={styles.headerIconLink} href="/" aria-label="Home">
            <i className={`bx-home ${styles.headerIcon}`}></i>
          </Link>
          <Link className={styles.headerIconLink} href="/auth/login" aria-label="Admin Login">
            <i className={`bx-user ${styles.headerIcon}`}></i>
          </Link>
          <Link className={styles.headerIconLink} href="/admin/dashboard" aria-label="Admin Dashboard">
            <i className={`bx-layout ${styles.headerIcon}`}></i>
          </Link>
        </div>
      </header>

      <section className={styles.mainContent}>
        <div className={styles.contentHeader}>
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
      </section>

      <footer className={styles.footer}>
        <span>
          © {new Date().getFullYear()} Goforit · <Link href="/">Home</Link>
        </span>
      </footer>
    </main>
  );
}
