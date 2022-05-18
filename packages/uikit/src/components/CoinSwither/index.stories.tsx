import React from "react";
import { SequencePlayer } from "./CoinSwitcher";
import cakeLooperImages from "./assets/cakeloop";
import bnbLooperImages from "./assets/bnbloop";
import cakeImages from "./assets/cake3";
import bnbImages from "./assets/bnb3";
import cake2bnbImages from "./assets/cake2bnb";
import bnb2cakeImages from "./assets/bnb2cake";

export default {
  title: "Components/CoinSwitcher",
  component: SequencePlayer,
  argTypes: {},
};

export const CakeFlip: React.FC = () => {
  return (
    <div>
      <SequencePlayer images={cakeLooperImages} />
    </div>
  );
};

export const BnbFlip: React.FC = () => {
  return (
    <div>
      <SequencePlayer images={bnbLooperImages} />
    </div>
  );
};

export const CakeRotate: React.FC = () => {
  return (
    <div>
      <SequencePlayer images={cakeImages} msPerFrame={21} />
    </div>
  );
};

export const bnbRotate: React.FC = () => {
  return (
    <div>
      <SequencePlayer images={bnbImages} msPerFrame={21} />
    </div>
  );
};

export const Bnb2Cake: React.FC = () => {
  return (
    <div>
      <SequencePlayer images={bnb2cakeImages} />
    </div>
  );
};

export const Cake2Bnb: React.FC = () => {
  return (
    <div>
      <SequencePlayer images={cake2bnbImages} />
    </div>
  );
};
