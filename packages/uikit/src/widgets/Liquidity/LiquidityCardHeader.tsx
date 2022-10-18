import { Text, Heading, IconButton, ArrowBackIcon, QuestionHelper } from "@pancakeswap/uikit";
import Link from "next/link";
import { AtomBox } from "@pancakeswap/ui";
import styled from "styled-components";

interface LiquidityCardHeaderProps {
  title: string;
  subtitle?: string;
  helper?: string;
  backTo?: string | (() => void);
  config?: React.ReactElement;
}

const AppHeaderContainer = styled(AtomBox)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`;

const LiquidityCardHeader: React.FC<React.PropsWithChildren<LiquidityCardHeaderProps>> = ({
  title,
  subtitle,
  helper,
  backTo,
  config,
}) => {
  return (
    <AppHeaderContainer display="flex" alignItems="center" justifyContent="space-between" padding="24px" width="100%">
      <AtomBox display="flex" alignItems="center" width="100%" style={{ gap: "16px" }}>
        {backTo &&
          (typeof backTo === "string" ? (
            <Link passHref href={backTo}>
              <IconButton as="a" scale="sm">
                <ArrowBackIcon width="32px" />
              </IconButton>
            </Link>
          ) : (
            <IconButton scale="sm" variant="text" onClick={backTo}>
              <ArrowBackIcon width="32px" />
            </IconButton>
          ))}
        <AtomBox display="flex" flexDirection="column" width="100%">
          <AtomBox display="flex" mb="8px" alignItems="center" justifyContent="space-between">
            <AtomBox display="flex">
              <Heading as="h2">{title}</Heading>
              {helper && <QuestionHelper text={helper} ml="4px" placement="top-start" />}
            </AtomBox>
            {config}
          </AtomBox>
          <AtomBox display="flex" alignItems="center">
            <Text color="textSubtle" fontSize="14px">
              {subtitle}
            </Text>
          </AtomBox>
        </AtomBox>
      </AtomBox>
    </AppHeaderContainer>
  );
};

export default LiquidityCardHeader;
