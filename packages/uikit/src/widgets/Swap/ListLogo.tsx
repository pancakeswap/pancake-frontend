import styled from "styled-components";
import { useHttpLocations } from "@pancakeswap/hooks";
import TokenLogo from "../../components/TokenLogo/TokenLogo";

const StyledListLogo = styled(TokenLogo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`;

export function ListLogo({
  logoURI,
  style,
  size = "24px",
  alt,
  badSrcs,
}: {
  logoURI: string;
  size?: string;
  style?: React.CSSProperties;
  alt?: string;
  badSrcs: { [imageSrc: string]: true };
}) {
  const srcs: string[] = useHttpLocations(logoURI);

  return <StyledListLogo badSrcs={badSrcs} alt={alt} size={size} srcs={srcs} style={style} />;
}
