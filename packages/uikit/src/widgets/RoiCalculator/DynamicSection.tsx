import styled from "styled-components";
import { ReactNode, PropsWithChildren } from "react";

import { AutoColumn, Box, Text } from "../../components";

export const DynamicSection = styled(AutoColumn)<{ disabled?: boolean }>`
  opacity: ${({ disabled }) => (disabled ? "0.2" : "1")};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "initial")};
  width: 100%;
`;

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
