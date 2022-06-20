import React from "react";
import times from "lodash/times";
import random from "lodash/random";
import styled from "styled-components";
import Flex from "../Box/Flex";
import Box from "../Box/Box";
import Text from "../Text/Text";
import BackgroundImage from "./BackgroundImage";
import Img from "./Image";
import TokenImage from "./TokenImage";
import TokenPairImage from "./TokenPairImage";
import ProfileAvatarComponent from "./ProfileAvatar";
import tokenList from "./tokens";

export default {
  title: "Components/Image",
  argTypes: {},
};

export const Image: React.FC = () => {
  return (
    <div>
      <Img src="https://via.placeholder.com/800x400" width={800} height={400} alt="test" />
      <div>Image</div>
    </div>
  );
};

export const Background: React.FC = () => {
  return (
    <div>
      <BackgroundImage src="https://via.placeholder.com/800x400" width={800} height={400} mr="16px" />
      <div>Background Image</div>
    </div>
  );
};

export const LazyImages: React.FC = () => {
  return (
    <Flex flexWrap="wrap">
      {times(40, (index) => (
        <Img
          key={index}
          src={`https://via.placeholder.com/${150 + index}`}
          width={150}
          height={150}
          mb="16px"
          mr="16px"
        />
      ))}
    </Flex>
  );
};

export const LazyBackgrounds: React.FC = () => {
  return (
    <Flex flexWrap="wrap">
      {times(40, (index) => (
        <BackgroundImage
          key={index}
          src={`https://via.placeholder.com/${150 + index}`}
          width={150}
          height={150}
          mb="16px"
          mr="16px"
        />
      ))}
    </Flex>
  );
};

const StyledBox = styled(Box)`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  flex-basis: 100px;
  text-align: center;
`;

export const TokenImages: React.FC = () => {
  const tokens = Object.values(tokenList).filter((token) => !!token?.address);
  return (
    <Flex flexWrap="wrap">
      {tokens.map((token) => {
        const src = `https://pancakeswap.finance/images/tokens/${token.address[56]}.png`;

        return (
          <StyledBox key={token.symbol} p="16px">
            <Text fontSize="14px" color="textSubtle">
              {token.symbol}
            </Text>
            <TokenImage src={src} height={64} width={64} title={token.symbol} />
          </StyledBox>
        );
      })}
    </Flex>
  );
};

export const TokenPairImages: React.FC = () => {
  const tokens = Object.values(tokenList).filter((token) => !!token?.address);
  return (
    <Flex flexWrap="wrap">
      {tokens.map((token) => {
        const randomTokenIndex = random(0, tokens.length - 1);
        const primarySrc = `https://pancakeswap.finance/images/tokens/${token.address[56]}.png`;
        const secondarySrc = `https://pancakeswap.finance/images/tokens/${tokens[randomTokenIndex].address[56]}.png`;

        return (
          <StyledBox key={token.symbol} p="16px">
            <TokenPairImage
              primarySrc={primarySrc}
              secondarySrc={secondarySrc}
              height={64}
              width={64}
              title={token.symbol}
              mb="16px"
            />
            <TokenPairImage
              variant="inverted"
              primarySrc={secondarySrc}
              secondarySrc={primarySrc}
              height={64}
              width={64}
              title={token.symbol}
            />
          </StyledBox>
        );
      })}
    </Flex>
  );
};

export const ProfileAvatar: React.FC = () => {
  return (
    <div>
      <Text>Shows Placeholder until image is downloaded</Text>
      <ProfileAvatarComponent src="https://via.placeholder.com/960x960" width={64} height={64} alt="test" mb="16px" />
      <Text>Shows placeholder if the image does not download</Text>
      <ProfileAvatarComponent src="https://via.placeholder.com" width={64} height={64} alt="test" />
    </div>
  );
};
