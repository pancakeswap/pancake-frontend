import React from "react";
import { SpaceProps } from "styled-system";

import { ChevronDownIcon, ChevronUpIcon } from "../Svg";
import Button from "./Button";
import IconButton from "./IconButton";

interface Props extends SpaceProps {
  onClick?: () => void;
  expanded?: boolean;
}

export const ExpandableButton: React.FC<React.PropsWithChildren<Props>> = ({
  onClick,
  expanded,
  children,
  ...rest
}) => {
  return (
    <IconButton aria-label="Hide or show expandable content" onClick={onClick} {...rest}>
      {children}
      {expanded ? <ChevronUpIcon color="invertedContrast" /> : <ChevronDownIcon color="invertedContrast" />}
    </IconButton>
  );
};
ExpandableButton.defaultProps = {
  expanded: false,
};

export const ExpandableLabel: React.FC<React.PropsWithChildren<Props>> = ({ onClick, expanded, children, ...rest }) => {
  return (
    <Button
      paddingRight={0}
      variant="text"
      aria-label="Hide or show expandable content"
      onClick={onClick}
      endIcon={expanded ? <ChevronUpIcon color="primary" /> : <ChevronDownIcon color="primary" />}
      {...rest}
    >
      {children}
    </Button>
  );
};
ExpandableLabel.defaultProps = {
  expanded: false,
};
