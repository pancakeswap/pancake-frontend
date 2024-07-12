import { Token } from "@pancakeswap/sdk";
import { Flex, Skeleton, Text } from "@pancakeswap/uikit";
import { styled } from "styled-components";
import { getChainName } from "@pancakeswap/chains";
import { ChainLogo, DoubleCurrencyLogo } from "../CurrencyLogo";

export interface ITokenInfoProps {
  isReady?: boolean;
  title?: React.ReactNode;
  desc?: React.ReactNode;
  icon?: React.ReactNode;
  customContent?: React.ReactNode;
  token: Token;
  quoteToken: Token;
}

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  padding-right: 8px;
  width: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
  }
`;

const DescWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSubtle};

  & img {
    vertical-align: bottom;
  }
`;

export const TokenOverview: React.FC<ITokenInfoProps> = ({
  isReady,
  title,
  desc,
  icon,
  customContent,
  token,
  quoteToken,
}) => {
  if (!isReady) {
    return (
      <Container>
        <Skeleton mr="8px" width={32} height={32} variant="circle" />
        <div>
          <Skeleton width={40} height={10} mb="4px" />
          <Skeleton width={60} height={24} />
        </div>
      </Container>
    );
  }
  return (
    <Container>
      <IconWrapper>{icon ?? <DoubleCurrencyLogo currency0={token} currency1={quoteToken} />}</IconWrapper>
      {customContent ?? (
        <Flex flexDirection="column">
          <Text bold>{title ?? `${token.symbol} / ${quoteToken.symbol}`}</Text>
          <DescWrapper>
            {desc ?? (
              <>
                <ChainLogo width={16} height={16} chainId={token.chainId} />
                {getChainName(token.chainId).toUpperCase()}
              </>
            )}
          </DescWrapper>
        </Flex>
      )}
    </Container>
  );
};
