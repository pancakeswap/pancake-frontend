import { AnimatePresence, domAnimation, LazyMotion, m as Motion } from "framer-motion";
import React, { useRef } from "react";
import styled, { keyframes } from "styled-components";
import { layout, space, borderRadius } from "styled-system";
import { animation as ANIMATION, SkeletonProps, SkeletonV2Props, variant as VARIANT } from "./types";
import {
  appearAnimation,
  disappearAnimation,
  animationVariants,
  animationMap,
  animationHandler,
} from "../../util/animationToolkit";

const waves = keyframes`
   from {
        left: -150px;
    }
    to   {
        left: 100%;
    }
`;

const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
`;

const AnimationWrapper = styled(Motion.div)`
  position: relative;
  will-change: opacity;
  opacity: 0;
  &.appear {
    animation: ${appearAnimation} 0.3s ease-in-out forwards;
  }
  &.disappear {
    animation: ${disappearAnimation} 0.3s ease-in-out forwards;
  }
`;

const SkeletonWrapper = styled.div<SkeletonProps>`
  position: relative;
  ${layout}
  ${space}
  overflow: hidden;
`;

const Root = styled.div<SkeletonProps>`
  min-height: 20px;
  display: block;
  background-color: ${({ theme }) => theme.colors.backgroundDisabled};
  border-radius: ${({ variant, theme }) =>
    variant === VARIANT.CIRCLE
      ? theme.radii.circle
      : variant === VARIANT.ROUND
      ? theme.radii.default
      : theme.radii.small};
  ${layout}
  ${space}
  ${borderRadius}
`;

const Pulse = styled(Root)`
  animation: ${pulse} 2s infinite ease-out;
  transform: translate3d(0, 0, 0);
`;

const Waves = styled(Root)`
  overflow: hidden;
  transform: translate3d(0, 0, 0);
  &:before {
    content: "";
    position: absolute;
    background-image: linear-gradient(90deg, transparent, rgba(243, 243, 243, 0.5), transparent);
    top: 0;
    left: -150px;
    height: 100%;
    width: 150px;
    animation: ${waves} 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
`;

const Skeleton: React.FC<React.PropsWithChildren<SkeletonProps>> = ({
  variant = VARIANT.RECT,
  animation = ANIMATION.PULSE,
  ...props
}) => {
  if (animation === ANIMATION.WAVES) {
    return <Waves variant={variant} {...props} />;
  }

  return <Pulse variant={variant} {...props} />;
};

export const SkeletonV2: React.FC<React.PropsWithChildren<SkeletonV2Props>> = ({
  variant = VARIANT.RECT,
  animation = ANIMATION.PULSE,
  isDataReady = false,
  children,
  wrapperProps,
  skeletonTop = "0",
  skeletonLeft = "0",
  width,
  height,
  mr,
  ml,
  ...props
}) => {
  const animationRef = useRef<HTMLDivElement>(null);
  const skeletonRef = useRef<HTMLDivElement>(null);
  return (
    <SkeletonWrapper width={width} height={height} mr={mr} ml={ml} {...wrapperProps}>
      <LazyMotion features={domAnimation}>
        <AnimatePresence>
          {isDataReady && (
            <AnimationWrapper
              key="content"
              ref={animationRef}
              onAnimationStart={() => animationHandler(animationRef.current)}
              {...animationMap}
              variants={animationVariants}
              transition={{ duration: 0.3 }}
            >
              {children}
            </AnimationWrapper>
          )}
          {!isDataReady && (
            <AnimationWrapper
              key="skeleton"
              style={{ position: "absolute", top: skeletonTop, left: skeletonLeft }}
              ref={skeletonRef}
              onAnimationStart={() => animationHandler(skeletonRef.current)}
              {...animationMap}
              variants={animationVariants}
              transition={{ duration: 0.3 }}
            >
              {animation === ANIMATION.WAVES ? (
                <Waves variant={variant} {...props} width={width} height={height} />
              ) : (
                <Pulse variant={variant} {...props} width={width} height={height} />
              )}
            </AnimationWrapper>
          )}
        </AnimatePresence>
      </LazyMotion>
    </SkeletonWrapper>
  );
};

export default Skeleton;
