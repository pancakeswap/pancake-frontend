import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
      <img src="images/lottery/cadinu_ticket_4.svg" alt="ticket" height="28px" width="30px"
      style={{transform: "rotate(155deg)"}}
      />
  );
};

export default Icon;
