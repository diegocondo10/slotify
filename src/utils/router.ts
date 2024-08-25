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
