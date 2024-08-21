import { authOptions } from "@/constants/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function LoginLayout({ children }: PropsWithChildren) {
  const session = await getServerSession(authOptions);
  if (typeof session?.user?.id !== "undefined") {
    redirect("/dashboard");
  }
  return children;
}
