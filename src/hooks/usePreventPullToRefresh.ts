import { useEffect } from "react";

const usePreventPullToRefresh = () => {
  useEffect(() => {
    let lastTouchY = 0;
    let isPullingDown = false;

    const preventPullToRefresh = (e) => {
      const touchY = e.touches[0].clientY;
      const touchDifference = touchY - lastTouchY;

      // Si está intentando hacer un pull hacia abajo, prevenimos el comportamiento predeterminado
      if (touchDifference > 0 && window.scrollY === 0) {
        e.preventDefault();
        isPullingDown = true;
      }
      // Si está intentando hacer un pull hacia arriba, prevenimos también.
      else if (
        touchDifference < 0 &&
        window.scrollY + window.innerHeight >= document.body.scrollHeight
      ) {
        e.preventDefault();
        isPullingDown = false;
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
