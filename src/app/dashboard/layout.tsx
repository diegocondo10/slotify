import { PropsWithChildren } from "react";
import Navbar from "./components/Navbar";

export default async function PrivateLayout({ children, ...rest }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
