import { Button, ButtonProps } from "./Button";

const IconButton = (props: ButtonProps) => <Button p={0} width={props.scale === "sm" ? "32px" : "48px"} {...props} />;

export default IconButton;
