import { useRouter } from 'next/router';
import { useMemo } from 'react';

const useCurrentPath = () => {
  const { asPath } = useRouter();

  const currentPath = useMemo(() => {
    const [pathname, search] = asPath.split('?');
    return search ? `${pathname}?${search}` : pathname;
  }, [asPath]);

  return {
    currentPath,
    currentEncodedPath: encodeURIComponent(currentPath),
  };
};

export default useCurrentPath;
