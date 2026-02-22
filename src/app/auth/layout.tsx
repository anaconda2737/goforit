import { ReactNode } from "react";
import styles from "layouts/AuthLayout/AuthLayout.module.scss";

type AuthLayoutProps = {
  children: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>{children}</div>
    </div>
  );
};

export default AuthLayout;
