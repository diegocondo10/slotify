import { set } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import superjson from "superjson";

interface RouteState<T> {
  routeState: T;
  setRouteValue: (key: string, value: any) => void;
  isInitializing: boolean;
  currentPath: string;
}

interface UseRouteStateProps<T> {
  stateKey?: string;
  onLoad?: (routeState: T) => void | Promise<void>;
  defaultValues?: T;
}

type ActionRouter = "push" | "replace";

const useRouteState = <T extends object>({
  stateKey = "query",
  onLoad,
  defaultValues,
}: UseRouteStateProps<T> = {}): RouteState<T> => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [state, setState] = useState<T>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const init = async () => {
    const routeState = extractRouteState();

    setRouteState(routeState || defaultValues, "replace");

    setState(routeState || defaultValues);

    onLoad && (await onLoad(routeState || defaultValues || null));

    setIsInitializing(false);
  };

  const extractRouteState = (): T => {
    const routeState = searchParams.get(stateKey);
    if (!routeState) {
      return null;
    }
    const decoded = decodeURIComponent(routeState);

    const decodedState = superjson.parse(decoded);
    return decodedState as T;
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (isInitializing === false) {
      setState(extractRouteState());
    }
  }, [searchParams, stateKey, isInitializing]);

  const serializeState = (stateValue): URLSearchParams => {
    const encodedState = encodeURIComponent(superjson.stringify(stateValue));
    const params = new URLSearchParams(searchParams);
    params.set(stateKey, encodedState);
    return params;
  };

  const setRouteValue = (key: string, value: any, action: ActionRouter = "push") => {
    const newState = set(state, key, value);
    const params = serializeState(newState);
    router[action](`${pathname}?${params.toString()}`);
  };

  const setRouteState = (stateValue: T, action: ActionRouter = "push") => {
    const params = serializeState(stateValue);
    router[action](`${pathname}?${params.toString()}`);
  };
  return {
    routeState: state,
    setRouteValue,
    isInitializing,
    currentPath: `${pathname}?${searchParams.toString()}`,
  };
};

export default useRouteState;
