"use client";

import React, { PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const QueryClientContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position='bottom-right' reverseOrder={false} toastOptions={{ duration: 5000 }} />
    </QueryClientProvider>
  );
};

export default QueryClientContextProvider;
