"use client";

import Loading from "@/components/Loading";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    signOut({
      callbackUrl: "/login",
      redirect: true,
    });
  }, []);

  return <Loading loading texto='Cerrando sesión' />;
}
