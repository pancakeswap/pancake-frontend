import React, { useState, useEffect } from "react";
import Skeleton, { SkeletonV2 } from "./Skeleton";

export default {
  title: "Components/Skeleton",
  component: Skeleton,
  argTypes: {
    width: { control: "number" },
    height: { control: "number" },
  },
};

export const Default: React.FC<React.PropsWithChildren> = (args) => {
  return <Skeleton {...args} />;
};

export const Avatar = Default.bind({});
Avatar.args = {
  width: 40,
  height: 40,
  variant: "circle",
};

export const Animation = Default.bind({});
Animation.args = {
  width: 100,
  height: 200,
  animation: "waves",
};

export const ParentSize: React.FC<React.PropsWithChildren> = (args) => {
  return (
    <div style={{ width: 200, height: 90 }}>
      {" "}
      <Skeleton {...args} />{" "}
    </div>
  );
};

export const Text: React.FC<React.PropsWithChildren> = (args) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return <h1 style={{ width: 200 }}>{loading ? <Skeleton {...args} /> : "H1"}</h1>;
};

export const TextWithTransition: React.FC<React.PropsWithChildren> = (args) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <SkeletonV2 {...args} isDataReady={!loading} width={200}>
      <h1>H1</h1>
    </SkeletonV2>
  );
};
