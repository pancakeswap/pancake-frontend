import shouldForwardProp from "@styled-system/should-forward-prop";
import { domAnimation, LazyMotion, motion } from "framer-motion";
import React, { useRef } from "react";
import { keyframes, styled } from "styled-components";
import { borderRadius, layout, space } from "styled-system";
import { animationHandler, animationMap, animationVariants, disappearAnimation } from "../../util/animationToolkit";
import { animation as ANIMATION, SkeletonProps, SkeletonV2Props, variant as VARIANT } from "./types";

export const softAppearAnimation = keyframes`
  from { opacity:0.2 }
  to { opacity:1 }
`;

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

const AnimationWrapper = styled(motion.div)`
  position: relative;
  will-change: opacity;
  opacity: 0;
  &.appear {
    animation: ${softAppearAnimation} 0.3s ease-in-out forwards;
  }
  &.disappear {
    animation: ${disappearAnimation} 0.3s ease-in-out forwards;
  }
`;

const SkeletonWrapper = styled.div.withConfig({ shouldForwardProp })<SkeletonProps>`
  position: relative;
  ${layout}
  ${space} /* overflow: hidden; */
`;

const Root = styled.div.withConfig({ shouldForwardProp })<SkeletonProps>`
  min-height: 20px;
  display: block;
  background-color: ${({ theme, isDark }) => (isDark ? theme.colors.inputSecondary : theme.colors.backgroundDisabled)};
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
    <SkeletonWrapper
      width={isDataReady ? "auto" : width}
      height={isDataReady ? "auto" : height}
      mr={mr}
      ml={ml}
      id="Skeleton-SkeletonWrapper"
      {...wrapperProps}
    >
      <LazyMotion features={domAnimation}>
        {/* <AnimatePresence initial={false}> */}
        {isDataReady ? (
          <AnimationWrapper
            id="Skeleton-AnimationWrapper-isDataReady-true"
            key="content"
            ref={animationRef}
            onAnimationStart={() => animationHandler(animationRef.current)}
            {...animationMap}
            variants={animationVariants}
            transition={{ duration: 0.3 }}
          >
            {children}
          </AnimationWrapper>
        ) : (
          <AnimationWrapper
            id="Skeleton-AnimationWrapper-isDataReady-false"
            key="skeleton"
            style={{ position: "absolute", top: skeletonTop, left: skeletonLeft }}
            ref={skeletonRef}
            onAnimationStart={() => animationHandler(skeletonRef.current, isDataReady)}
            {...animationMap}
            variants={animationVariants}
            transition={{ duration: 0.3 }}
          >
            {animation === ANIMATION.WAVES ? (
              <Waves variant={variant} {...props} width={width} height={height} id="Skeleton-Waves-Animation" />
            ) : (
              <Pulse variant={variant} {...props} width={width} height={height} id="Skeleton-Pulse-Animation" />
            )}
          </AnimationWrapper>
        )}
        {/* </AnimatePresence> */}
      </LazyMotion>
    </SkeletonWrapper>
  );
};

export default Skeleton;
