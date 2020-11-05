import React from "react";
import { PancakesIcon } from "../Svg";
import Link from "./index";

export default {
  title: "Link",
  component: Link,
  argTypes: {
    fontSize: {
      name: "fontSize",
      table: {
        type: { summary: "string", detail: "Fontsize in px or em" },
        defaultValue: { summary: "16px" },
      },
      control: {
        type: null,
      },
    },
  },
};

export const Default: React.FC = () => {
  return (
    <div>
      <div>
        <Link href="/">Default</Link>
      </div>
      <div>
        <Link href="/">
          With icon
          <PancakesIcon />
        </Link>
      </div>
    </div>
  );
};
