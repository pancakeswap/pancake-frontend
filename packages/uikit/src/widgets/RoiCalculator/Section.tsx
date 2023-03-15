import { PropsWithChildren, ReactNode } from "react";

import { Box, Text } from "../../components";

export function Section({ title, children }: { title?: ReactNode } & PropsWithChildren) {
  return (
    <Box mb="24px">
      <Text color="secondary" bold fontSize="12px" textTransform="uppercase" mb="16px">
        {title}
      </Text>
      {children}
    </Box>
  );
}
