import { styled } from "styled-components";
import { Text } from "../Text";
import { Flex } from "../Box";
import { LogoIcon, CircleOutlineIcon, CheckmarkCircleIcon } from "../Svg";

const sharedFlexStyles = `
  min-width: 86px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ExpiredWrapper = styled(Flex)`
  ${sharedFlexStyles}

  svg {
    fill: ${({ theme }) => theme.colors.textSubtle};
  }
`;

const ActiveWrapper = styled(Flex)`
  ${sharedFlexStyles}
`;

const FutureWrapper = styled(Flex)`
  ${sharedFlexStyles}

  svg {
    fill: ${({ theme }) => theme.colors.textDisabled};
  }
`;

const StyledText = styled(Text)`
  margin: 4px 0;
  font-weight: 600;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const StyledDateText = styled(Text)`
  font-size: 12px;
  line-height: 120%;
  min-height: 29px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSubtle};
`;

interface DateStepProps {
  index: number;
  stepText: string;
  activeStepIndex: number;
  dateText: string;
}

const DateStep: React.FC<React.PropsWithChildren<DateStepProps>> = ({ index, stepText, activeStepIndex, dateText }) => {
  const isExpired = index < activeStepIndex;
  const isActive = index === activeStepIndex;
  const isFuture = index > activeStepIndex;

  if (isExpired) {
    return (
      <ExpiredWrapper>
        <CheckmarkCircleIcon />
        <StyledText textTransform="uppercase">{stepText}</StyledText>
        <StyledDateText>{dateText}</StyledDateText>
      </ExpiredWrapper>
    );
  }

  if (isActive) {
    return (
      <ActiveWrapper>
        <LogoIcon />
        <StyledText textTransform="uppercase">{stepText}</StyledText>
        <StyledDateText>{dateText}</StyledDateText>
      </ActiveWrapper>
    );
  }

  if (isFuture) {
    return (
      <FutureWrapper>
        <CircleOutlineIcon />
        <StyledText textTransform="uppercase">{stepText}</StyledText>
        <StyledDateText>{dateText}</StyledDateText>
      </FutureWrapper>
    );
  }

  return <span>Er</span>;
};

export default DateStep;
