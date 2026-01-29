/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useRouter } from "next/navigation";
import React,{ useEffect } from "react";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin/dashboard/entries");
  }, []);

  return <div>Redirecting...</div>;
};

export default Page;
