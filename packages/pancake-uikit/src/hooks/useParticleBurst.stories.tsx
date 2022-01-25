import React from "react";
import Button from "../components/Button/Button";
import Text from "../components/Text/Text";
import useParticleBurst from "./useParticleBurst";

const imagePath = "https://via.placeholder.com/10";

export default {
  title: "Hooks/useParticleBurst",
  argTypes: {},
};

export const WithSelector: React.FC = () => {
  useParticleBurst({ imgSrc: imagePath, selector: "button" });

  return (
    <div style={{ padding: "32px" }}>
      <Button type="button" mr="16px">
        Click Me
      </Button>
      <Button type="button" variant="secondary" mr="16px">
        Or Me
      </Button>
      <Button type="button" variant="tertiary">
        Or Me
      </Button>
    </div>
  );
};

export const Document: React.FC = () => {
  useParticleBurst({ imgSrc: imagePath });

  return (
    <div style={{ padding: "32px" }}>
      <Text>Any click (not recommended)</Text>
    </div>
  );
};

export const AdjustDistance: React.FC = () => {
  useParticleBurst({ imgSrc: imagePath, particleOptions: { distance: 800 } });

  return (
    <div style={{ padding: "32px" }}>
      <Text>Adjust distance</Text>
    </div>
  );
};

export const AdjustSize: React.FC = () => {
  useParticleBurst({ imgSrc: imagePath, particleOptions: { size: 80 } });

  return (
    <div style={{ padding: "32px" }}>
      <Text>Adjust size</Text>
    </div>
  );
};

export const AdjustNumberOfParticles: React.FC = () => {
  useParticleBurst({ imgSrc: imagePath, numberOfParticles: 100 });

  return (
    <div style={{ padding: "32px" }}>
      <Text>100 particles (beware of performance)</Text>
    </div>
  );
};

export const DisableUnderCondition: React.FC = () => {
  const disableWhen = () => {
    const date = new Date();
    const currentMinutes = date.getMinutes();

    return currentMinutes % 2 !== 0;
  };
  useParticleBurst({ selector: "button", imgSrc: imagePath, disableWhen });

  return (
    <div style={{ padding: "32px" }}>
      <Text mb="8px">Will only burst when current minute is even</Text>
      <Button variant="success">Click Me</Button>
    </div>
  );
};

export const StopAndStart: React.FC = () => {
  const { initialize, teardown } = useParticleBurst({ imgSrc: imagePath });

  const handleInitialize = () => initialize();
  const handleTeardown = () => teardown();

  return (
    <div style={{ padding: "32px" }}>
      <Text mb="8px">100 particles (beware of performance)</Text>
      <Button variant="secondary" onClick={handleInitialize} mr="8px">
        Start Bursts
      </Button>
      <Button variant="tertiary" onClick={handleTeardown}>
        Stop Bursts
      </Button>
    </div>
  );
};
