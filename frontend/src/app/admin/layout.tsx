/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "@/utils/axios";
import FullPageLoading from "@/components/FullPageLoading";

/**
 * Root layout component that handles authentication checks and redirection
 * @param children - Child components to be rendered
 * @returns JSX.Element with authentication-protected layout
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/admin/check-auth", {
          withCredentials: true,
        });

        if (response.status === 200 && pathname === "/admin") {
          router.push("/admin/dashboard/entries");
        }
      } catch (error: any) {
        if (error.response?.status === 403) {
          router.push("/admin");
        } else {
          console.error("Error checking authentication:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  if (loading) {
    return <FullPageLoading />;
  }

  return <>{children}</>;
}