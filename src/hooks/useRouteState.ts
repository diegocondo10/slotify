import { set } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import superjson from "superjson";

interface RouteState<T> {
  routeState: T;
  setRouteValue: (key: string, value: any) => void;
}

const useRouteState = <T extends object>({ stateKey = "query" } = {}): RouteState<T> => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const routeState = useMemo<T>(() => {
    const state = searchParams.get(stateKey);
    if (!state) {
      return {} as T;
    }
    const decoded = decodeURIComponent(state);
    return superjson.parse(decoded);
  }, [searchParams, stateKey]);

  const setRouteValue = (key: string, value: any) => {
    const newState = set(routeState, key, value);
    const encodedState = encodeURIComponent(superjson.stringify(newState));
    const params = new URLSearchParams(searchParams);
    params.set(stateKey, encodedState);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return { routeState, setRouteValue };
};

export default useRouteState;
