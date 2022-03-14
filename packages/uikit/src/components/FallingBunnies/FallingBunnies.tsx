import React from "react";
import styled, { keyframes } from "styled-components";
import BunnyIcon from "../Svg/Icons/Logo";
import { BunnyProps, FallingBunniesProps } from "./types";

const bunnyFall = keyframes`
  0% {
    opacity: 1;
    transform: translate(0, -100%) rotateZ(0deg);
  }

  75% {
    opacity: 1;
    transform: translate(100px, 75vh) rotateZ(270deg);
  }

  100% {
    opacity: 0;
    transform: translate(150px, 100vh) rotateZ(360deg);
  }
`;

const Bunny = styled.div<BunnyProps>`
  display: inline-flex;
  position: fixed;
  top: 0;
  left: ${({ position }) => `${position}vw`};
  transform: translate3d(0, -100%, 0);
  user-select: none;
  pointer-events: none;
  z-index: 99999;

  animation-name: ${bunnyFall};
  animation-duration: ${({ duration }) => `${duration}s`};
  animation-timing-function: linear;
  animation-iteration-count: ${({ iterations }) => (Number.isFinite(iterations) ? String(iterations) : "infinite")};
  animation-play-state: running;

  &:nth-child(5n + 5) {
    animation-delay: ${({ duration }) => `${(duration / 10) * 1.3}s`};
  }

  &:nth-child(3n + 2) {
    animation-delay: ${({ duration }) => `${(duration / 10) * 1.5}s`};
  }

  &:nth-child(2n + 5) {
    animation-delay: ${({ duration }) => `${(duration / 10) * 1.7}s`};
  }

  &:nth-child(3n + 10) {
    animation-delay: ${({ duration }) => `${(duration / 10) * 2.7}s`};
  }

  &:nth-child(7n + 2) {
    animation-delay: ${({ duration }) => `${(duration / 10) * 3.5}s`};
  }

  &:nth-child(4n + 5) {
    animation-delay: ${({ duration }) => `${(duration / 10) * 5.5}s`};
  }

  &:nth-child(3n + 7) {
    animation-delay: ${({ duration }) => `${(duration / 10) * 8}s`};
  }
`;

const FallingBunnies: React.FC<FallingBunniesProps> = ({
  count = 30,
  size = 32,
  iterations = Infinity,
  duration = 10,
}) => {
  const bunnies = [...Array(count)].map((_, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <Bunny key={String(index)} position={Math.random() * 100} iterations={iterations} duration={duration}>
      <BunnyIcon width={size} height={size} />
    </Bunny>
  ));

  return <div>{bunnies}</div>;
};

export default FallingBunnies;
