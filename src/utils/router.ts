import {
  AppRouterInstance,
  NavigateOptions,
} from "next/dist/shared/lib/app-router-context.shared-runtime";

export const commandPush = (url: string) => {
  return () => {
    // return router.push(url);
  };
};

export const lazyPush = (router: AppRouterInstance, href: string, options?: NavigateOptions) => {
  return () => {
    router.push(href, options);
  };
};

export const getCurrentPathEncoded = () => {
  return encodeURIComponent(`${window.location.pathname}${window.location.search}`);
};

export const extractGoBackTo = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("goBackTo");
};
