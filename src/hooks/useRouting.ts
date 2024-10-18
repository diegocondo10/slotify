import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation";

export interface UseRoutingPropsReturn {
  router: AppRouterInstance;
  searchParams: ReadonlyURLSearchParams;
  setQueryParam: (key: string, value: any) => void;
  getQueryParams: (key: string) => any;
}

const useRouting = (): UseRoutingPropsReturn => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const setQueryParam = (key: string, value: any) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, encodeURIComponent(JSON.stringify(value)));
    router.replace(`${pathname}?${params.toString()}`);
  };

  const getQueryParams = (key: string) => {
    const param = searchParams.get(key);
    if (param) {
      return JSON.parse(decodeURIComponent(param));
    }
    return null;
  };

  return {
    router,
    searchParams,
    setQueryParam,
    getQueryParams,
  };
};

export default useRouting;
