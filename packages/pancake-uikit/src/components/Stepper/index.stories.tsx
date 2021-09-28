import React from "react";
import styled from "styled-components";
import Stepper from "./Stepper";
import { Step, StepNumber } from "./Step";
import { Status } from "./types";
import Card from "../Card/Card";
import CardBody from "../Card/CardBody";

export default {
  title: "Components/Stepper",
  component: Stepper,
  argTypes: {},
};

const mock =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vitae nisl imperdiet, vestibulum lacus at, placerat nisi. Vestibulum quis scelerisque purus. Curabitur non magna tincidunt, fermentum neque sed, finibus neque. Phasellus consequat at lorem a venenatis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vitae nisl imperdiet, vestibulum lacus at, placerat nisi. Vestibulum quis scelerisque purus. Curabitur non magna tincidunt, fermentum neque sed, finibus neque. Phasellus consequat at lorem a venenatis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vitae nisl imperdiet, vestibulum lacus at, placerat nisi. Vestibulum quis scelerisque purus. Curabitur non magna tincidunt, fermentum neque sed, finibus neque. Phasellus consequat at lorem a venenatis.";
const steps = [mock, mock, mock, mock];
const status: Status[] = ["past", "current", "future", "future"];

const Row = styled.div`
  display: flex;
`;

export const Default: React.FC = () => {
  return (
    <Stepper>
      {steps.map((step, index) => (
        <Step key={step} index={index} statusFirstPart={status[index]} statusSecondPart={status[index + 1]}>
          <Card>
            <CardBody>{step}</CardBody>
          </Card>
        </Step>
      ))}
    </Stepper>
  );
};

export const Components: React.FC = () => {
  return (
    <div>
      <Row>
        <StepNumber status="past">1</StepNumber>
        <StepNumber status="current">1</StepNumber>
        <StepNumber status="future">1</StepNumber>
      </Row>
      <Row>
        <Step index={0} statusFirstPart="past">
          <Card>
            <CardBody>
              <h2>Step 0</h2>
              <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vitae nisl imperdiet, vestibulum lacus at,
                placerat nisi. Vestibulum quis scelerisque purus. Curabitur non magna tincidunt, fermentum neque sed,
                finibus neque. Phasellus consequat at lorem a venenatis.
              </div>
            </CardBody>
          </Card>
        </Step>
      </Row>
      <Row>
        <Step index={1} statusFirstPart="current" statusSecondPart="future">
          <Card>
            <CardBody>
              <h2>Step 1</h2>
              <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vitae nisl imperdiet, vestibulum lacus at,
                placerat nisi. Vestibulum quis scelerisque purus. Curabitur non magna tincidunt, fermentum neque sed,
                finibus neque. Phasellus consequat at lorem a venenatis.
              </div>
            </CardBody>
          </Card>
        </Step>
      </Row>
      <Row>
        <Step index={2} statusFirstPart="future">
          <Card>
            <CardBody>
              <h2>Step 2</h2>
              <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vitae nisl imperdiet, vestibulum lacus at,
                placerat nisi. Vestibulum quis scelerisque purus. Curabitur non magna tincidunt, fermentum neque sed,
                finibus neque. Phasellus consequat at lorem a venenatis.
              </div>
            </CardBody>
          </Card>
        </Step>
      </Row>
    </div>
  );
};
