import { MotionFlexGap, Text } from "@pancakeswap/uikit";
import { memo } from "react";
import { styled } from "styled-components";

const Divider = styled.div`
  width: 1px;
  background-color: ${({ theme }) => theme.colors.cardBorder};
  height: 16px;
`;

const Wrapper = styled(MotionFlexGap)`
  position: absolute;
  top: 0;
  right: 0px;
`;

const config = [25, 50, 100];

export const AssetSettingButtonList: React.FC<{
  onPercentInput?: (percent: number) => void;
  onFocusChange?: (focus: boolean) => void;
}> = memo(({ onPercentInput, onFocusChange }) => {
  return (
    <Wrapper
      key="AssetSettingButtonList"
      initial={{ x: 10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -10, opacity: 0 }}
      gap="8px"
      justifyContent="center"
      alignItems="center"
    >
      {config.map((percent, index) => {
        return (
          <>
            <Text
              color="#02919D"
              fontSize={12}
              key={`AssetSettingButtonList${percent}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onFocusChange?.(false);
                onPercentInput?.(percent);
              }}
              style={{ cursor: "pointer" }}
              fontWeight={600}
            >
              {percent === 100 ? "MAX" : `${percent}%`}
            </Text>
            {index !== config.length - 1 && <Divider />}
          </>
        );
      })}
    </Wrapper>
  );
});
