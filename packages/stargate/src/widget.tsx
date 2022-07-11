import { darkTheme, lightTheme } from "./theme";

export const STARGATE_CDN_URL = "https://unpkg.com/@layerzerolabs/stargate-ui@0.0.25-testnet.2/element.js";

export const StargateWidget = ({ theme }: { theme: "dark" | "light" }) => {
  return (
    // @ts-ignore
    <stargate-widget
      partnerId="105"
      feeCollector="0xc13b65f7c53Cd6db2EA205a4b574b4a0858720A6"
      theme={theme === "dark" ? JSON.stringify(darkTheme) : JSON.stringify(lightTheme)}
      tenthBps={0.4}
    />
  );
};
