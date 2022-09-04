import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import observerOptions from "./options";
import Wrapper from "./Wrapper";
import { ImageProps } from "./types";
import Placeholder from "./Placeholder";
import { Box } from "../Box";

const StyledImage = styled.img`
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
`;

const Image: React.FC<React.PropsWithChildren<ImageProps>> = ({ src, alt, width, height, ...props }) => {
  const imgRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

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
    <Box
      as={Wrapper}
      ref={imgRef}
      // FIXME: polymorphic types
      // @ts-ignore
      $height={height}
      $width={width}
      {...props}
    >
      {isLoaded ? <StyledImage src={src} alt={alt} /> : <Placeholder />}
    </Box>
  );
};

export default Image;
