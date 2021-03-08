import React, { useState } from "react";
import { capitalize, random } from "lodash";
import Box from "../Box/Box";
import Heading from "../Heading/Heading";
import Button from "../Button/Button";
import Progress from "./Progress";
import { variants } from "./types";

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
      {Object.values(variants).map((variant) => {
        return (
          <Box key={variant} mb="16px">
            <Heading size="md" mb="8px">
              {capitalize(variant)}
            </Heading>
            <Progress variant={variant} primaryStep={progress} />
          </Box>
        );
      })}
      <div style={{ marginTop: "32px" }}>
        <Button type="button" scale="sm" onClick={handleClick}>
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
        <Button type="button" scale="sm" onClick={() => setPrimaryStep(random(1, 100))}>
          Random Primary Progress
        </Button>
        <Button style={{ marginTop: "16px" }} type="button" scale="sm" onClick={() => setSecondaryStep(random(1, 100))}>
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
        <Button type="button" scale="sm" onClick={() => setPrimaryStep(random(1, 100))}>
          Random Primary Progress
        </Button>
        <Button style={{ marginTop: "16px" }} type="button" scale="sm" onClick={() => setSecondaryStep(random(1, 100))}>
          Random Secondary Progress
        </Button>
      </div>
    </div>
  );
};
