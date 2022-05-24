import React from "react";
import { SequencePlayer } from "./SequencePlayer";
import {
  bnb2CakeImages,
  cake2BnbImages,
  cakeLoopImages,
  bnbLoopImages,
  bnbOnceImages,
  cakeOnceImages,
} from "./constant";

export default {
  title: "Components/CoinSwitcher",
  component: SequencePlayer,
  argTypes: {},
};

export const CakeOnce: React.FC = () => {
  return (
    <div>
      <SequencePlayer images={cakeOnceImages()} />
    </div>
  );
};

export const BnbOnce: React.FC = () => {
  return (
    <div>
      <SequencePlayer images={bnbOnceImages()} />
    </div>
  );
};

export const CakeLoop: React.FC = () => {
  return (
    <div>
      <SequencePlayer images={cakeLoopImages()} msPerFrame={21} />
    </div>
  );
};

export const bnbLoop: React.FC = () => {
  return (
    <div>
      <SequencePlayer images={bnbLoopImages()} msPerFrame={21} />
    </div>
  );
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
