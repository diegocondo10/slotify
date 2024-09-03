import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

const useCurrentPath = () => {
  const pathname = usePathname();
  const search = useSearchParams();

  const currentPath = useMemo(() => {
    return search ? `${pathname}?${search}` : pathname;
  }, [pathname, search]);

  return {
    currentPath,
    currentEncodedPath: encodeURIComponent(currentPath),
  };
};

export default useCurrentPath;
