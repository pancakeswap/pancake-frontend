import { ReactNode } from "react-markdown";
import Text from "./Text";
import { TextProps } from "./types";

export const PreTitle = (props: TextProps & { children: ReactNode }) => (
  <Text color="secondary" fontSize="12px" bold textTransform="uppercase" {...props} />
);
