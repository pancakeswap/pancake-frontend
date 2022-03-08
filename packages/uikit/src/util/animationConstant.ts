import { Variants, Transition } from "framer-motion";

const transition: Transition = {
  duration: 0.3,
};

export const animationVariants: Variants = {
  initial: { opacity: 0, transition },
  animate: { opacity: 1, transition },
  exit: { opacity: 0, transition },
};

export const animationMap = {
  initial: "initial",
  animate: "animate",
  exit: "exit",
};
