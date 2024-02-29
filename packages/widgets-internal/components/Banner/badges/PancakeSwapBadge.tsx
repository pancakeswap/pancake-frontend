import { Badge, BadgeLogo, BadgeText } from "./Badge";

const pancakeSwapLogo = "https://assets.pancakeswap.finance/web/banners/pancakeswap-logo.png";

interface PancakeSwapBadgeProps {
  whiteText?: boolean;
}

export const PancakeSwapBadge: React.FC<React.PropsWithChildren<PancakeSwapBadgeProps>> = ({ whiteText }) => {
  return (
    <Badge
      logo={<BadgeLogo src={pancakeSwapLogo} alt="pancakeSwapLogo" />}
      text={<BadgeText color={whiteText ? "#ffffff" : "#090909"}>PancakeSwap</BadgeText>}
    />
  );
};
