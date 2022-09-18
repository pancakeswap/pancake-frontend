import { PropsWithChildren } from "react";
import { Text, TextProps } from "../../components";
import { SeverityVariants, severityVariants } from "./SeverityErrorText.css";

export const SeverityErrorText = ({ severity, ...props }: PropsWithChildren<TextProps & SeverityVariants>) => (
  <Text className={severityVariants({ severity })} {...props} />
);
