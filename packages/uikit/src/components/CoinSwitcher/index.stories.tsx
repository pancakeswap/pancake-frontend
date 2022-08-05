import React from "react";
import { SequencePlayer } from "./SequencePlayer";
import { bnb2CakeImages, cake2BnbImages } from "./constant";

export default {
  title: "Components/CoinSwitcher",
  component: SequencePlayer,
  argTypes: {},
};

export const Bnb2Cake: React.FC = () => {
  return (
    <div>
      <SequencePlayer images={bnb2CakeImages()} />
    </div>
  );
};

export const Cake2Bnb: React.FC = () => {
  return (
    <div>
      <SequencePlayer images={cake2BnbImages()} />
    </div>
  );
};
