import { styled } from "styled-components";
import { ReactNode } from "react";
import { Card, CardBody, CardHeader } from "../../components/Card";
import { Flex, Box } from "../../components/Box";
import { Text } from "../../components/Text";
import { HelpIcon } from "../../components/Svg";
import useTooltip from "../../hooks/useTooltip/useTooltip";

const StyledCard = styled(Card)`
  background: none;
  max-width: 368px;
  width: 100%;
  margin: 0 auto;
  height: fit-content;
`;

interface CardConfigReturn {
  title: string;
  variant: "blue" | "violet";
  tooltip: string | ReactNode;
}

interface IfoGenericIfoCardElements {
  action: ReactNode;
  content: ReactNode;
}

const IfoGenericIfoCard: React.FC<React.PropsWithChildren<CardConfigReturn & IfoGenericIfoCardElements>> = ({
  title,
  variant,
  action,
  content,
  tooltip,
}) => {
  const { targetRef, tooltip: tooltipMsg, tooltipVisible } = useTooltip(tooltip, { placement: "bottom" });

  return (
    <>
      {tooltipVisible && tooltipMsg}
      <StyledCard>
        <CardHeader p="16px 24px" variant={variant}>
          <Flex justifyContent="space-between" alignItems="center">
            <Text bold fontSize="20px" lineHeight={1}>
              {title}
            </Text>
            {tooltip && (
              <div ref={targetRef} style={{ display: "flex", marginLeft: "8px" }}>
                <HelpIcon />
              </div>
            )}
          </Flex>
        </CardHeader>
        <CardBody p="24px">
          <Flex flexDirection="column" justifyContent="center" alignItems="center">
            {content}
            <Box width="100%" mt="24px">
              {action}
            </Box>
          </Flex>
        </CardBody>
      </StyledCard>
    </>
  );
};

export default IfoGenericIfoCard;
