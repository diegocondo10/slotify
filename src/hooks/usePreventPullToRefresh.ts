import { useEffect } from "react";

const usePreventPullToRefresh = () => {
  useEffect(() => {
    let lastTouchY = 0;

    const preventPullToRefresh = (e) => {
      const touchY = e.touches[0].clientY;

      if (touchY > lastTouchY && window.scrollY === 0) {
        e.preventDefault();
      }

      lastTouchY = touchY;
    };

    window.addEventListener(
      "touchstart",
      (e) => {
        lastTouchY = e.touches[0].clientY;
      },
      { passive: false }
    );

    window.addEventListener("touchmove", preventPullToRefresh, { passive: false });

    return () => {
      window.removeEventListener("touchstart", (e) => {
        lastTouchY = e.touches[0].clientY;
      });
      window.removeEventListener("touchmove", preventPullToRefresh);
    };
  }, []);
};

export default usePreventPullToRefresh;
