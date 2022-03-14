import { StyledAnimatedIconComponent, StyledIconContainer } from "./styles";
import { IconComponentType } from "./types";

const AnimatedIconComponent: React.FC<IconComponentType> = ({
  icon,
  fillIcon,
  color = "textSubtle",
  activeColor = "secondary",
  activeBackgroundColor,
  isActive = false,
  ...props
}) => {
  const IconElement = icon;
  const IconElementFill = fillIcon;
  return IconElement ? (
    <StyledAnimatedIconComponent isActive={isActive} hasFillIcon={!!IconElementFill} {...props}>
      <StyledIconContainer activeBackgroundColor={activeBackgroundColor}>
        <IconElement color={color} />
      </StyledIconContainer>
      {!!IconElementFill && (
        <StyledIconContainer activeBackgroundColor={activeBackgroundColor} {...props}>
          <IconElementFill color={activeColor} />
        </StyledIconContainer>
      )}
    </StyledAnimatedIconComponent>
  ) : null;
};

export default AnimatedIconComponent;
