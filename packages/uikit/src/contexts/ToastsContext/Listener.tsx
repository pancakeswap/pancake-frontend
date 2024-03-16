import { useTheme } from "@pancakeswap/hooks";
import { Toaster } from "sonner";

const ToastListener = () => {
  const { isDark } = useTheme();
  return (
    <Toaster
      duration={6000}
      position="top-right"
      gap={24}
      theme={isDark ? "dark" : "light"}
      toastOptions={{
        style: {
          width: "100%",
        },
      }}
    />
  );
};

export default ToastListener;
