import Link from "next/link";
import { connectDb } from "lib/db";
import Exam from "lib/models/exam";
import styles from "./exam-pages.module.scss";
import { googleFormIcon } from "utils";

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
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.brandIcon}>{googleFormIcon}</span>
          <span>Goforit</span>
        </div>
        <div className={styles.headerRight}>
          <Link className={styles.headerIconLink} href="/tests" aria-label="All Tests">
            <i className={`bx-grid-alt ${styles.headerIcon}`}></i>
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
          <h1 className={styles.title}>Goforit</h1>
          <div className={styles.nav}>
            <Link className={styles.link} href="/tests">
              All Tests
            </Link>
            <Link className={styles.link} href="/auth/login">
              Admin Login
            </Link>
            <Link className={styles.link} href="/admin/dashboard">
              Admin Dashboard
            </Link>
          </div>
        </div>

        {exams.length === 0 ? (
          <p className={styles.emptyState}>No tests available yet.</p>
        ) : (
          <div className={styles.grid}>
            {exams.map((exam: any) => (
              <Link
                key={exam._id.toString()}
                href={`/tests/${exam._id.toString()}`}
                className={styles.card}
              >
                <h3 className={styles.cardTitle}>{exam.title || "Untitled Test"}</h3>
                <p className={styles.meta}>
                  {exam.examType} | {(exam.questions || []).length} questions | {exam.durationMinutes || 30} mins
                </p>
                <p className={styles.meta}>
                  Updated: {new Date(exam.updatedAt).toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer className={styles.footer}>
        <span>
          © {new Date().getFullYear()} Goforit · <Link href="/tests">All Tests</Link>
        </span>
      </footer>
    </main>
  );
}
