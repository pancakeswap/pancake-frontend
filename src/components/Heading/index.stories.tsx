import React from "react";
import Heading from "./Heading";

export default {
  title: "Components/Heading",
  component: Heading,
  argTypes: {},
};

export const Sizes: React.FC = () => {
  return (
    <div>
      <Heading>Default</Heading>
      <Heading size="md">Size md</Heading>
      <Heading size="lg">Size lg</Heading>
      <Heading size="xl">Size xl</Heading>
      <Heading size="xxl">Size xxl</Heading>
    </div>
  );
};

export const tags: React.FC = () => {
  return (
    <div>
      <Heading>Default</Heading>
      <Heading as="h1">Tag h1</Heading>
      <Heading as="h2">Tag h2</Heading>
      <Heading as="h3">Tag h3</Heading>
      <Heading as="h4">Tag h4</Heading>
      <Heading as="h5">Tag h5</Heading>
      <Heading as="h6">Tag h6</Heading>
    </div>
  );
};
