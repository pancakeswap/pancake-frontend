import { styled } from "styled-components";
import { Box } from "@pancakeswap/uikit";

const Wrapper = styled.div`
  width: 100%;
`;

export function ConfirmationModalContent({
  bottomContent,
  topContent,
}: {
  topContent: () => React.ReactNode;
  bottomContent: () => React.ReactNode;
}) {
  return (
    <Wrapper>
      <Box>{topContent()}</Box>
      <Box>{bottomContent()}</Box>
    </Wrapper>
  );
}
