import { Badge, BadgeLogo, BadgeText } from "./Badge";

const pancakeSwapLogo = "https://assets.pancakeswap.finance/web/banners/pancakeswap-logo.png";

interface PancakeSwapBadgeProps {
  whiteText?: boolean;
  compact?: boolean;
}

export const PancakeSwapBadge: React.FC<React.PropsWithChildren<PancakeSwapBadgeProps>> = ({ whiteText, compact }) => {
  return (
    <Badge
      logo={<BadgeLogo src={pancakeSwapLogo} alt="pancakeSwapLogo" />}
      text={compact ? null : <BadgeText color={whiteText ? "#ffffff" : "#090909"}>PancakeSwap</BadgeText>}
    />
  );
};
