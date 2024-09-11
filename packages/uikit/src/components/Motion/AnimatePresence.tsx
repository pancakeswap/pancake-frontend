import { AnimatePresence, AnimatePresenceProps, LazyMotion, LazyProps, domAnimation } from "framer-motion";
import { FC } from "react";

// optimized export for building animated framer components
const LazyAnimatePresence: FC<React.PropsWithChildren<LazyProps & AnimatePresenceProps>> = (props) => {
  return (
    <LazyMotion features={props.features} strict={props.strict}>
      <AnimatePresence {...props}>{props.children}</AnimatePresence>
    </LazyMotion>
  );
};

export { domAnimation };

export default LazyAnimatePresence;
