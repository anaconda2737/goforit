"use client";

import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "hooks/useAuth";

type ProvidersProps = {
  children: ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
  return (
    <>
      <AuthProvider>{children}</AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover closeButton />
    </>
  );
};

export default Providers;
