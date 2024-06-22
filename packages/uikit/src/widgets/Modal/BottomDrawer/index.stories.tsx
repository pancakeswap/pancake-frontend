import React, { useState } from "react";
import { Box, Button, Text } from "../../../components";
import BottomDrawer from "./BottomDrawer";

export default {
  title: "Components/BottomDrawer",
  component: BottomDrawer,
  argTypes: {},
};

export const Default: React.FC<React.PropsWithChildren> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const content = (
    <Box px="16px" pt="22px" height="100%" overflowY="auto">
      <Text fontSize="20px">Example</Text>
      {[...Array(10).keys()].map(() => (
        <Text mb="16px">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa optio et laudantium ipsum ipsam nesciunt, odio
          hic quibusdam molestias magnam. Tempora saepe ea quidem quo, commodi sint tempore iste explicabo!
        </Text>
      ))}
      <Text>The end</Text>
    </Box>
  );
  return (
    <Box p="24px">
      <Text mb="8px">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni delectus dolorum porro facere cum ducimus, iste
        nobis voluptas dolorem quaerat perspiciatis voluptatum sed laborum reiciendis magnam illum necessitatibus. Ea,
        hic.
      </Text>
      <Button onClick={() => setIsOpen(true)}>Show bottom drawer</Button>
      {[...Array(10).keys()].map(() => (
        <Text mb="16px">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa optio et laudantium ipsum ipsam nesciunt, odio
          hic quibusdam molestias magnam. Tempora saepe ea quidem quo, commodi sint tempore iste explicabo!
        </Text>
      ))}
      <BottomDrawer content={content} isOpen={isOpen} setIsOpen={setIsOpen} />
    </Box>
  );
};
