import { domAnimation } from "framer-motion";
import React from "react";
import { MotionBox } from "../Box";
import { Button } from "../Button";
import LazyAnimatePresenceComponent from "./AnimatePresence";

export default {
  title: "Components/Motion",
  component: LazyAnimatePresenceComponent,
  argTypes: {},
};

const animationProps = {
  animate: {
    opacity: 1,
  },
  initial: {
    opacity: 0,
  },
  exit: {
    opacity: 0,
  },
  transition: {
    duration: 0.42,
  },
};

export const LazyAnimatePresence: React.FC<React.PropsWithChildren> = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <LazyAnimatePresenceComponent features={domAnimation}>
        {open ? (
          <MotionBox {...animationProps}>
            <Button onClick={() => setOpen(false)}>click to exit</Button>
          </MotionBox>
        ) : null}
      </LazyAnimatePresenceComponent>
      <p>Using AnimatePresence to animate</p>
      <Button onClick={() => setOpen(true)}>click to open</Button>
    </div>
  );
};
