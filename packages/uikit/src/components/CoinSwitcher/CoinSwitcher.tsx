import { useRouter } from "next/router";
import { memo, useState } from "react";
import styled from "styled-components";
import { bnb2CakeImages, cake2BnbImages } from "./constant";
import { SequencePlayer } from "./SequencePlayer";

export const CoinSwitcherWrapper = styled.div`
  position: absolute;
  top: -20px;
  left: -10px;
  z-index: 31;
  width: 150px;
  height: 100px;
  overflow: hidden;
  transform: scale(0.7) translateX(-30px);
  ${({ theme }) => theme.mediaQueries.md} {
    transform: scale(0.9) translateX(-10px);
  }
`;

export const SequenceWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  &.hidden {
    opacity: 0;
    pointer-events: none;
  }
`;

export const CoinSwitcher: React.FC<{ onTokenSwitch: () => void }> = memo(({ onTokenSwitch }) => {
  const router = useRouter();
  const { token } = router.query;
  const [isBnb] = useState(() => !(token === "CAKE"));

  return <Inner bnb={isBnb} onTokenSwitch={onTokenSwitch} />;
});

const Inner: React.FC<{ bnb: boolean; onTokenSwitch: () => void }> = memo(({ bnb, onTokenSwitch }) => {
  const [isBnb, setIsBnb] = useState(() => bnb);
  return (
    <CoinSwitcherWrapper>
      <SequenceWrapper className={!isBnb ? "hidden" : undefined}>
        <SequencePlayer
          images={bnb2CakeImages()}
          onPlayStart={() => {
            onTokenSwitch();
          }}
          onPlayFinish={() => {
            setIsBnb(false);
          }}
        />
      </SequenceWrapper>
      <SequenceWrapper className={isBnb ? "hidden" : undefined}>
        <SequencePlayer
          images={cake2BnbImages()}
          onPlayStart={() => {
            onTokenSwitch();
          }}
          onPlayFinish={() => {
            setIsBnb(true);
          }}
        />
      </SequenceWrapper>
    </CoinSwitcherWrapper>
  );
});
