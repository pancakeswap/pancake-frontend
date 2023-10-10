import { styled } from "styled-components";
import { useHttpLocations } from "@pancakeswap/hooks";
import { TokenLogo } from "@pancakeswap/uikit";

const StyledListLogo = styled(TokenLogo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`;

export function ListLogo({
  logoURI,
  style,
  size = "24px",
  alt,
}: {
  logoURI: string;
  size?: string;
  style?: React.CSSProperties;
  alt?: string;
}) {
  const srcs: string[] = useHttpLocations(logoURI);

  return <StyledListLogo alt={alt} size={size} srcs={srcs} style={style} />;
}
