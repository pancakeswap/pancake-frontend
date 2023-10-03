import React, { useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import observerOptions from "./options";
import Wrapper from "./Wrapper";
import { ImageProps } from "./types";
import Placeholder from "./Placeholder";

const StyledImage = styled.img`
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
`;

const Image: React.FC<React.PropsWithChildren<ImageProps>> = ({ src, alt, width, height, fallbackSrc, ...props }) => {
  const imgRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let observer: IntersectionObserver;
    const isSupported = typeof window === "object" && window.IntersectionObserver;

    if (imgRef.current && isSupported) {
      observer = new window.IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const { isIntersecting } = entry;
          if (isIntersecting) {
            setIsLoaded(true);
            if (typeof observer?.disconnect === "function") {
              observer.disconnect();
            }
          }
        });
      }, observerOptions);
      observer.observe(imgRef.current);
    }

    return () => {
      if (typeof observer?.disconnect === "function") {
        observer.disconnect();
      }
    };
  }, [src]);

  return (
    <Wrapper key={src} ref={imgRef} height={height} width={width} {...props}>
      {isLoaded ? (
        <StyledImage src={error && fallbackSrc ? fallbackSrc : src} alt={alt} onError={() => setError(true)} />
      ) : (
        <Placeholder />
      )}
    </Wrapper>
  );
};

export default Image;
