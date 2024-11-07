import { useEffect } from "react";

const usePreventPullToRefresh = () => {
  // useEffect(() => {
  //   let lastTouchY = 0;
  //   let isPullingDown = false;

  //   const preventPullToRefresh = (e) => {
  //     const touchY = e.touches[0].clientY;
  //     const touchDifference = touchY - lastTouchY;

  //     // Si está intentando hacer un pull hacia abajo, prevenimos el comportamiento predeterminado
  //     if (touchDifference > 0 && window.scrollY === 0) {
  //       e.preventDefault();
  //       isPullingDown = true;
  //     }
  //     // Si está intentando hacer un pull hacia arriba, prevenimos también.
  //     else if (
  //       touchDifference < 0 &&
  //       window.scrollY + window.innerHeight >= document.body.scrollHeight
  //     ) {
  //       e.preventDefault();
  //       isPullingDown = false;
  //     }

  //     lastTouchY = touchY;
  //   };

  //   window.addEventListener(
  //     "touchstart",
  //     (e) => {
  //       lastTouchY = e.touches[0].clientY;
  //     },
  //     { passive: false }
  //   );

  //   window.addEventListener("touchmove", preventPullToRefresh, { passive: false });

  //   return () => {
  //     window.removeEventListener("touchstart", (e) => {
  //       lastTouchY = e.touches[0].clientY;
  //     });
  //     window.removeEventListener("touchmove", preventPullToRefresh);
  //   };
  // }, []);

  // useEffect(() => {
  //   function handleTouchMove(event) {
  //     // Detectar si el usuario está desplazando hacia abajo desde el tope de la página
  //     if (window.scrollY === 0 && event.touches.length === 1 && event.touches[0].clientY > 0) {
  //       event.preventDefault();
  //     }
  //   }

  //   window.addEventListener("touchmove", handleTouchMove, { passive: false });

  //   return () => {
  //     window.removeEventListener("touchmove", handleTouchMove);
  //   };
  // }, []);
};

export default usePreventPullToRefresh;
