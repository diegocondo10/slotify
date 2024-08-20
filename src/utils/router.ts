import { Url } from "next/dist/shared/lib/router/router";
import Router from "next/router";

interface TransitionOptions {
  shallow?: boolean;
  locale?: string | false;
  scroll?: boolean;
  unstable_skipClientCache?: boolean;
}

export const commandPush = (url: Url, as?: Url, options?: TransitionOptions) => {
  return async (): Promise<boolean> => {
    return Router.push(url, as, options);
  };
};
