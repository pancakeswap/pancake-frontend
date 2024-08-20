import { AnimatePresence, AnimatePresenceProps, LazyMotion, LazyProps } from "framer-motion";
import { FC } from "react";

// optimized export for building animated framer components
const LazyAnimatePresence: FC<React.PropsWithChildren<LazyProps & AnimatePresenceProps>> = (props) => {
  return (
    <LazyMotion features={props.features} strict={props.strict}>
      <AnimatePresence {...props}>{props.children}</AnimatePresence>
    </LazyMotion>
  );
};

export default LazyAnimatePresence;
