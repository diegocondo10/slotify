"use client";
import classNames from "classnames";
import { ProgressSpinner } from "primereact/progressspinner";
import React from "react";

export interface LoadingWrapperProps {
  loading?: boolean;
  texto?: string;
  className?: string;
}

const Loading: React.FC<React.PropsWithChildren<LoadingWrapperProps>> = ({
  loading = false,
  texto = "Cargando...",
  className,
  children,
}) => {
  if (!loading) {
    return <>{children}</>;
  }
  return (
    <div
      style={{ height: "100%", overflow: "hidden" }}
      className={classNames("flex flex-column justify-content-center text-center", className)}>
      <ProgressSpinner />
      <p className='text-xl'>{texto}</p>
    </div>
  );
};

export default Loading;
