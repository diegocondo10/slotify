type ClickHandler<E> = (event: E) => void;

export const createClickHandler = <E>(
  doubleClickHandler: ClickHandler<E>,
  singleClickHandler: ClickHandler<E> = null,
  delay: number = 300
) => {
  let clickTimeout: NodeJS.Timeout | null = null;

  return (event: E): void => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
      doubleClickHandler(event);
    } else {
      clickTimeout = setTimeout(() => {
        clickTimeout = null;
        if (singleClickHandler) {
          singleClickHandler(event);
        }
      }, delay);
    }
  };
};

export const simulateTouch = () => {
  const element = document.getElementById("simulateTouchElement");

  const touch = new Touch({
    identifier: Date.now(),
    target: element,
    clientX: element.getBoundingClientRect().left,
    clientY: element.getBoundingClientRect().top,
    pageX: element.getBoundingClientRect().left + window.scrollX,
    pageY: element.getBoundingClientRect().top + window.scrollY,
    screenX: element.getBoundingClientRect().left,
    screenY: element.getBoundingClientRect().top,
    radiusX: 0,
    radiusY: 0,
    rotationAngle: 0,
    force: 1,
  });

  const touchStartEvent = new TouchEvent("touchstart", {
    bubbles: true,
    cancelable: true,
    touches: [touch],
  });

  const touchEndEvent = new TouchEvent("touchend", {
    bubbles: true,
    cancelable: true,
    touches: [touch],
  });
  element.dispatchEvent(touchStartEvent);
  element.dispatchEvent(touchEndEvent);
};

export function updateVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}
