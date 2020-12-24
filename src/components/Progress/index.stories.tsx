import React, { useState } from "react";
import random from "lodash/random";
import Button from "../Button/Button";
import Progress from "./Progress";

export default {
  title: "Components/Progress",
  component: Progress,
  argTypes: {},
};

export const Default: React.FC = () => {
  const [progress, setProgress] = useState(random(1, 100));

  const handleClick = () => setProgress(random(1, 100));

  return (
    <div style={{ padding: "32px", width: "400px" }}>
      <Progress primaryStep={progress} />
      <div style={{ marginTop: "32px" }}>
        <Button type="button" size="sm" onClick={handleClick}>
          Random Progress
        </Button>
      </div>
    </div>
  );
};

export const WithSecondary: React.FC = () => {
  const [primaryStep, setPrimaryStep] = useState(10);
  const [secondaryStep, setSecondaryStep] = useState(40);

  return (
    <div style={{ padding: "32px", width: "400px" }}>
      <Progress primaryStep={primaryStep} secondaryStep={secondaryStep} />
      <div style={{ marginTop: "32px" }}>
        <Button type="button" size="sm" onClick={() => setPrimaryStep(random(1, 100))}>
          Random Primary Progress
        </Button>
        <Button style={{ marginTop: "16px" }} type="button" size="sm" onClick={() => setSecondaryStep(random(1, 100))}>
          Random Secondary Progress
        </Button>
      </div>
    </div>
  );
};

export const WithSecondaryAndProgressBunny: React.FC = () => {
  const [primaryStep, setPrimaryStep] = useState(10);
  const [secondaryStep, setSecondaryStep] = useState(40);

  return (
    <div style={{ padding: "32px", width: "400px" }}>
      <Progress primaryStep={primaryStep} secondaryStep={secondaryStep} showProgressBunny />
      <div style={{ marginTop: "32px" }}>
        <Button type="button" size="sm" onClick={() => setPrimaryStep(random(1, 100))}>
          Random Primary Progress
        </Button>
        <Button style={{ marginTop: "16px" }} type="button" size="sm" onClick={() => setSecondaryStep(random(1, 100))}>
          Random Secondary Progress
        </Button>
      </div>
    </div>
  );
};
