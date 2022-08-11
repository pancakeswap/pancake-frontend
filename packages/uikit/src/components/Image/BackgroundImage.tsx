import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import observerOptions from "./options";
import Wrapper from "./Wrapper";
import { BackgroundImageProps } from "./types";
import Placeholder from "./Placeholder";

const StyledBackgroundImage = styled(Wrapper)`
  background-repeat: no-repeat;
  background-size: contain;
`;

const BackgroundImage: React.FC<React.PropsWithChildren<BackgroundImageProps>> = ({
  loadingPlaceholder,
  src,
  width,
  height,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const placeholder = loadingPlaceholder || <Placeholder />;

  useEffect(() => {
    let observer: IntersectionObserver;

    const isSupported = typeof window === "object" && window.IntersectionObserver;

    if (ref.current && isSupported) {
      const div = ref.current;

      observer = new window.IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const { isIntersecting } = entry;
          if (isIntersecting) {
            if (src) {
              // Load the image via an image element so we can show a placeholder until the image is downloaded
              const img = document.createElement("img");
              img.onload = () => {
                div.style.backgroundImage = `url("${src}")`;
                setIsLoaded(true);
              };
              img.src = src;
            }

            observer.disconnect();
          }
        });
      }, observerOptions);
      observer.observe(div);
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [src, setIsLoaded]);

  return (
    <StyledBackgroundImage ref={ref} width={width} height={height} {...props}>
      {!isLoaded && placeholder}
    </StyledBackgroundImage>
  );
};

export default BackgroundImage;
