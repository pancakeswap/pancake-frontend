import { memo, useCallback, useState, useMemo } from "react";
import styled from "styled-components";
import { bnb2CakeImages, cake2BnbImages } from "./constant";
import { SequencePlayer } from "./SequencePlayer";

export const CoinSwitcherWrapper = styled.div`
  position: absolute;
  top: -25px;
  left: -25px;
  z-index: 31;
  width: 150px;
  height: 100px;
  overflow: hidden;
  cursor: pointer;
  transform: scale(0.6) translateX(-40px);
  ${({ theme }) => theme.mediaQueries.lg} {
    top: -20px;
    left: -10px;
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

export const CoinSwitcher: React.FC<React.PropsWithChildren<{ isDefaultBnb: boolean; onTokenSwitch: () => void }>> =
  memo(({ isDefaultBnb, onTokenSwitch }) => {
    const onSwitch = useCallback(() => {
      onTokenSwitch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <Inner isDefaultBnb={isDefaultBnb} onTokenSwitch={onSwitch} />;
  });

const Inner: React.FC<React.PropsWithChildren<{ isDefaultBnb: boolean; onTokenSwitch: () => void }>> = memo(
  ({ isDefaultBnb, onTokenSwitch }) => {
    const [isBnb, setIsBnb] = useState(isDefaultBnb);
    const bnb2Cake = useMemo(() => bnb2CakeImages(), []);
    const cake2Bnb = useMemo(() => cake2BnbImages(), []);
    return (
      <CoinSwitcherWrapper>
        <SequenceWrapper className={!isBnb ? "hidden" : undefined}>
          <SequencePlayer
            images={bnb2Cake}
            onPlayStart={onTokenSwitch}
            onPlayFinish={() => {
              setIsBnb(false);
            }}
          />
        </SequenceWrapper>
        <SequenceWrapper className={isBnb ? "hidden" : undefined}>
          <SequencePlayer
            images={cake2Bnb}
            onPlayStart={onTokenSwitch}
            onPlayFinish={() => {
              setIsBnb(true);
            }}
          />
        </SequenceWrapper>
      </CoinSwitcherWrapper>
    );
  }
);
