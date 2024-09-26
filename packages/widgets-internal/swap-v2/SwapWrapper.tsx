import { Flex } from "@pancakeswap/uikit";
import { styled } from "styled-components";

export const SwapFormWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const InputPanelWrapper = styled(Flex)`
  position: relative;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`;

export const SwapTabAndInputPanelWrapper = styled(Flex)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
  height: 100%;
  will-change: transform;
  transition: transform 0.2 ease;
  transform: translateY(0px);
  width: 100%;
`;
