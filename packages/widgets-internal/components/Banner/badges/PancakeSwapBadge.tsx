import { Badge, BadgeLogo, BadgeText } from "./Badge";

const pancakeSwapLogo = "https://assets.pancakeswap.finance/web/banners/pancakeswap-logo.png";

export function PancakeSwapBadge() {
  return (
    <Badge logo={<BadgeLogo src={pancakeSwapLogo} alt="pancakeSwapLogo" />} text={<BadgeText>PancakeSwap</BadgeText>} />
  );
}
