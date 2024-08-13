import { ForwardRefComponent, HTMLMotionProps, motion } from "framer-motion";
import { FC } from "react";

const MotionDiv: FC<React.PropsWithChildren<ForwardRefComponent<HTMLDivElement, HTMLMotionProps<"div">>>> = (props) => {
  return <motion.div {...props}>{props.children}</motion.div>;
};

export default MotionDiv;
