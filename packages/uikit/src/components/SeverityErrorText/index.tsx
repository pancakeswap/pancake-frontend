import { PropsWithChildren } from "react";
import { AtomBox, AtomBoxProps } from "../AtomBox";
import { SeverityVariants, severityVariants } from "./SeverityErrorText.css";

const SeverityErrorText = ({ severity, ...props }: PropsWithChildren<AtomBoxProps & SeverityVariants>) => (
  <AtomBox className={severityVariants({ severity })} {...props} />
);

export default SeverityErrorText;
