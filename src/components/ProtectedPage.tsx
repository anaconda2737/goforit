"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "hooks/useAuth";

type ProtectedPageProps = {
  children: ReactNode;
};

const ProtectedPage = ({ children }: ProtectedPageProps) => {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(
        `/auth/login${pathname ? `?url=${encodeURIComponent(pathname)}` : ""}`
      );
    }
  }, [isLoading, pathname, router, user]);

  if (isLoading || !user) return <div>Loading...</div>;

  return <>{children}</>;
};

export default ProtectedPage;
