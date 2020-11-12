import React, { useState } from "react";
import random from "lodash/random";
import Button from "../Button";
import Progress from "./index";

export default {
  title: "Progress",
  component: Progress,
  argTypes: {},
};

export const Default: React.FC = () => {
  const [progress, setProgress] = useState(random(1, 100));

  const handleClick = () => setProgress(random(1, 100));

  return (
    <div style={{ padding: "32px", width: "400px" }}>
      <Progress step={progress} />
      <div style={{ marginTop: "32px" }}>
        <Button type="button" size="sm" onClick={handleClick}>
          Random Progress
        </Button>
      </div>
    </div>
  );
};
