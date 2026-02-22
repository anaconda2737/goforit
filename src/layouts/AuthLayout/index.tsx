import React from "react";

type AuthLayoutProps = {
  children: React.ReactNode;
};

import styles from "./AuthLayout.module.scss";

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>{children}</div>
    </div>
  );
};

export default AuthLayout;
