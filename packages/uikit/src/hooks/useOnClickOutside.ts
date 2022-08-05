import { useEffect } from "react";

const useOnClickOutside = (htmlNode: HTMLElement | null, handler: (event?: MouseEvent | TouchEvent) => void): void => {
  useEffect(
    () => {
      if (htmlNode) {
        const listener = (event: MouseEvent | TouchEvent) => {
          // Do nothing if clicking ref's element or descendent elements
          if (htmlNode.contains(event.target as Node)) {
            return;
          }
          handler(event);
        };
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
        return () => {
          document.removeEventListener("mousedown", listener);
          document.removeEventListener("touchstart", listener);
        };
      }
      return undefined;
    },
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [htmlNode, handler]
  );
};

export default useOnClickOutside;
