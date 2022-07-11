import { Box } from "@pancakeswap/uikit";
import { useMemo } from "react";
import { darkTheme, lightTheme } from "./theme";

export const STARGATE_CDN_URL = "https://unpkg.com/@layerzerolabs/stargate-ui@0.0.25-testnet.2/element.js";

const stringDarkTheme = JSON.stringify(darkTheme);
const stringLightTheme = JSON.stringify(lightTheme);

export const StargateWidget = ({ theme }: { theme: "dark" | "light" }) => {
  const widgetTheme = useMemo(() => {
    return theme === "dark" ? stringDarkTheme : stringLightTheme;
  }, [theme]);

  return (
    <>
      <Box
        borderTopLeftRadius={32}
        borderTopRightRadius={32}
        bg="backgroundAlt"
        height="12px"
        display={["block", null, "none"]}
      />
      {/* @ts-ignore */}
      <stargate-widget
        partnerId="105"
        feeCollector="0xc13b65f7c53Cd6db2EA205a4b574b4a0858720A6"
        theme={widgetTheme}
        tenthBps={0.4}
      />
    </>
  );
};
