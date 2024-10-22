import { merge, set } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import superjson from "superjson";

interface RouteState<T> {
  routeState: T | null;
  setRouteValue: (key: string, value: any, action?: ActionRouter) => void;
  setRouteState: (state: T, action?: ActionRouter) => void;
  isInitializing: boolean;
  currentPath: string;
}

interface UseRouteStateProps<T> {
  stateKey?: string;
  onLoad?: (routeState: T | null) => void | Promise<void>;
  defaultValues?: T;
}

type ActionRouter = "push" | "replace";

const useRouteState = <T extends object>({
  stateKey = "query",
  onLoad,
  defaultValues = null,
}: UseRouteStateProps<T> = {}): RouteState<T> => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [state, setState] = useState<T | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const extractRouteState = (): T | null => {
    const routeState = searchParams.get(stateKey);
    if (!routeState) return defaultValues;

    try {
      const decoded = decodeURIComponent(routeState);
      return superjson.parse(decoded) as T;
    } catch {
      return defaultValues;
    }
  };

  const serializeState = (stateValue: T | null): URLSearchParams => {
    const params = new URLSearchParams(searchParams);
    if (stateValue) {
      const encodedState = encodeURIComponent(superjson.stringify(stateValue));
      params.set(stateKey, encodedState);
    } else {
      params.delete(stateKey);
    }
    return params;
  };

  const init = async () => {
    const routeState = extractRouteState();
    setState(routeState);
    if (onLoad) {
      await onLoad(routeState);
    }

    setIsInitializing(false);
  };

  useEffect(() => {
    init();
  }, []);

  const setRouteValue = (key: string, value: any, action: ActionRouter = "push") => {
    const newState = set({ ...state }, key, value);
    const params = serializeState(newState);
    router[action](`${pathname}?${params.toString()}`);
    setState(newState);
  };

  const setRouteState = (stateValue: T, action: ActionRouter = "push") => {
    const newState = merge(state, stateValue);
    const params = serializeState(newState);
    router[action](`${pathname}?${params.toString()}`);
    setState(newState);
  };

  useEffect(() => {
    if (isInitializing === false) {
      setState(extractRouteState());
    }
  }, [searchParams]);

  return {
    routeState: state,
    setRouteValue,
    isInitializing,
    currentPath: `${pathname}?${searchParams.toString()}`,
    setRouteState,
  };
};

export default useRouteState;
