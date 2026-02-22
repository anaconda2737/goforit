"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "hooks/useAuth";

type AdminPageProps = {
  children: ReactNode;
};

const AdminPage = ({ children }: AdminPageProps) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/auth/login?url=/admin/dashboard");
      return;
    }
    if (adminEmail && user.email.toLowerCase() !== adminEmail.toLowerCase()) {
      router.replace("/form/list");
    }
  }, [adminEmail, isLoading, router, user]);

  if (isLoading || !user) return <div>Loading...</div>;

  if (adminEmail && user.email.toLowerCase() !== adminEmail.toLowerCase()) {
    return <div>Checking access...</div>;
  }

  return <>{children}</>;
};

export default AdminPage;
