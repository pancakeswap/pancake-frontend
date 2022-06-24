import { memo } from "react";
import { SunIcon, MoonIcon } from "../Svg";
import { Toggle } from "../Toggle";

export interface Props {
  isLight: boolean;
  toggleTheme: (isLight: boolean) => void;
}

const ThemeSwitcher: React.FC<Props> = ({ isLight, toggleTheme }) => (
  <Toggle
    checked={isLight}
    defaultColor="textDisabled"
    checkedColor="textDisabled"
    onChange={() => toggleTheme(!isLight)}
    scale="md"
    startIcon={(isActive = false) => <SunIcon color={isActive ? "warning" : "backgroundAlt"} />}
    endIcon={(isActive = false) => <MoonIcon color={isActive ? "secondary" : "backgroundAlt"} />}
  />
);

export default memo(ThemeSwitcher, (prev, next) => prev.isLight === next.isLight);
