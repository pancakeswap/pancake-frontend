import { useCallback, useEffect } from "react";
import debounce from "lodash/debounce";

type ParticleOptions = {
  size?: number;
  distance?: number;
};

const defaultParticleOptions = {
  size: 30,
  distance: 500,
};

const createParticle = (x: number, y: number, imgSrc: string, options: ParticleOptions = {}) => {
  const { size, distance } = { ...defaultParticleOptions, ...options };

  const particle = document.createElement("particle");
  document.body.appendChild(particle);

  const width = Math.floor(Math.random() * size + 8);
  const height = width;
  const destinationX = (Math.random() - 0.5) * distance;
  const destinationY = (Math.random() - 0.5) * distance;
  const rotation = Math.random() * 520;
  const delay = Math.random() * 200;

  particle.style.backgroundRepeat = "no-repeat";
  particle.style.backgroundSize = "contain";
  particle.style.backgroundImage = `url(${imgSrc})`;
  particle.style.left = "0";
  particle.style.top = "0";
  particle.style.opacity = "0";
  particle.style.pointerEvents = "none";
  particle.style.position = "fixed";
  particle.style.width = `${width}px`;
  particle.style.height = `${height}px`;

  const animation = particle.animate(
    [
      {
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(0deg)`,
        opacity: 1,
      },
      {
        transform: `translate(-50%, -50%) translate(${x + destinationX}px, ${
          y + destinationY
        }px) rotate(${rotation}deg)`,
        opacity: 0,
      },
    ],
    {
      duration: Math.random() * 1000 + 5000,
      easing: "cubic-bezier(0, .9, .57, 1)",
      delay,
    }
  );

  animation.onfinish = () => {
    particle.remove();
  };
};

type Options = {
  imgSrc: string;
  selector?: string;
  numberOfParticles?: number;
  debounceDuration?: number;
  disableWhen?: () => boolean;
  particleOptions?: ParticleOptions;
};

const defaultOptions = {
  numberOfParticles: 30,
  debounceDuration: 200,
  particleOptions: {},
};

/**
 * @see https://css-tricks.com/playing-with-particles-using-the-web-animations-api/
 */
const useParticleBurst = (options: Options): { initialize: () => void; teardown: () => void } => {
  const { selector, numberOfParticles, debounceDuration, imgSrc, disableWhen, particleOptions } = {
    ...defaultOptions,
    ...options,
  };

  const makeListener = useCallback(
    () =>
      debounce(
        (event: MouseEvent) => {
          const isDisabled = disableWhen && disableWhen();

          if (!isDisabled) {
            const node = event.currentTarget as HTMLElement;

            if (event.clientX === 0 && event.clientY === 0) {
              const { left, width, top, height } = node.getBoundingClientRect();
              const x = left + width / 2;
              const y = top + height / 2;

              for (let i = 0; i < numberOfParticles; i += 1) {
                createParticle(x, y, imgSrc, particleOptions);
              }
            } else {
              for (let i = 0; i < numberOfParticles; i += 1) {
                createParticle(event.clientX, event.clientY + window.scrollY, imgSrc, particleOptions);
              }
            }
          }
        },
        debounceDuration,
        { leading: true }
      ),
    [debounceDuration, numberOfParticles, imgSrc, disableWhen, particleOptions]
  );
  const listener = makeListener();

  const initialize = useCallback(() => {
    if (selector) {
      document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
        element.addEventListener("click", listener);
      });
    } else {
      document.addEventListener("click", listener);
    }
  }, [selector, listener]);

  const teardown = useCallback(() => {
    if (selector) {
      document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
        element.removeEventListener("click", listener);
      });
    } else {
      document.removeEventListener("click", listener);
    }
  }, [selector, listener]);

  useEffect(() => {
    initialize();
    return () => teardown();
  }, [initialize, teardown]);

  return { initialize, teardown };
};

export default useParticleBurst;
