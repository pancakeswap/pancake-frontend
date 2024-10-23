import { FlexGapProps } from "../Layouts/FlexGap";

export interface MotionTabMenuProps extends FlexGapProps {
  children: React.ReactElement[];
  activeIndex?: number;
  autoFocus?: boolean;

  /**
   * Use to disable animation on mobile if it helps performance
   * @default true
   */
  animateOnMobile?: boolean;

  /** Unique Id for use by this tablist and its tabpanels */
  ariaId?: string;

  onItemClick?: (index: number) => void;
}
