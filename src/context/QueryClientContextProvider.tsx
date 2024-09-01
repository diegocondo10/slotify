"use client";

import usePreventPullToRefresh from "@/hooks/usePreventPullToRefresh";
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
  usePreventPullToRefresh();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position='top-center' reverseOrder={false} />
    </QueryClientProvider>
  );
};

export default QueryClientContextProvider;
