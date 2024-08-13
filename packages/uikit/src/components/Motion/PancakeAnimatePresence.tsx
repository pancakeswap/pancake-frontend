import { AnimatePresenceProps, AnimatePresence as FramerAnimatePresence } from "framer-motion";
import { FC } from "react";

const AnimatePresence: FC<React.PropsWithChildren<AnimatePresenceProps>> = (props) => {
  return <FramerAnimatePresence {...props}>{props.children}</FramerAnimatePresence>;
};

export default AnimatePresence;
