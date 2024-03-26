import { useRef, type ReactNode } from "react";
import { Skeleton } from "../Skeleton";
import Text from "./Text";
import { TextProps } from "./types";

type SkeletonTextProps = {
  loading: boolean;
  initialWidth: number;
  initialHeight?: number;
  color?: string;
  children: ReactNode;
};

const SkeletonText = ({
  loading,
  initialWidth,
  initialHeight = 16,
  children,
  ...props
}: TextProps & SkeletonTextProps) => {
  const textRef = useRef<HTMLDivElement>(null);
  return (
    <>
      {loading ? (
        <Skeleton
          isDark
          width={textRef.current?.clientWidth || initialWidth}
          height={textRef.current?.clientHeight || initialHeight}
        />
      ) : (
        <Text ref={textRef} {...props}>
          {children}
        </Text>
      )}
    </>
  );
};

export default SkeletonText;
