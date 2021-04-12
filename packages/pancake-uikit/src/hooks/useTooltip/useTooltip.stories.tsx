import React, { useState } from "react";
import styled from "styled-components";
import Input from "../../components/Input/Input";
import Text from "../../components/Text/Text";
import HelpIcon from "../../components/Svg/Icons/Help";
import useTooltip from "./useTooltip";

const GridCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ReferenceElement = styled.div`
  background-color: #1fc7d4;
  width: 160px;
  height: 160px;
  border-radius: 8px;
`;

const Container = styled.div`
  padding: 64px 120px;
  display: grid;
  grid-template-columns: repeat(3, 200px);
  grid-template-rows: repeat(4, 200px);
`;

const ExpandableCard = styled.div`
  width: 300px;
  margin: 0 auto;
  padding: 0 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: rgba(70, 70, 80, 0.2) 0px 7px 29px 0px;
`;

const ExpandableHeader = styled.div`
  height: 40px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default {
  title: "Hooks/useTooltip",
};

export const Placement: React.FC = () => {
  // TOP
  const { targetRef: targetRefTopStart, tooltip: tooltipTopStart } = useTooltip("top-start", "top-start", "click");
  const { targetRef: targetRefTop, tooltip: tooltipTop } = useTooltip("top", "top", "click");
  const { targetRef: targetRefTopEnd, tooltip: tooltipTopEnd } = useTooltip("top-end", "top-end", "click");
  // LEFT
  const { targetRef: targetRefLeftStart, tooltip: tooltipLeftStart } = useTooltip("left-start", "left-start", "click");
  const { targetRef: targetRefLeft, tooltip: tooltipLeft } = useTooltip("left", "left", "click");
  const { targetRef: targetRefLeftEnd, tooltip: tooltipLeftEnd } = useTooltip("left-end", "left-end", "click");
  // RIGHT
  const { targetRef: targetRefRightStart, tooltip: tooltipRightStart } = useTooltip(
    "right-start",
    "right-start",
    "click"
  );
  const { targetRef: targetRefRight, tooltip: tooltipRight } = useTooltip("right", "right", "click");
  const { targetRef: targetRefRightEnd, tooltip: tooltipRightEnd } = useTooltip("right-end", "right-end", "click");
  // BOTTOM
  const { targetRef: targetRefBottomStart, tooltip: tooltipBottomStart } = useTooltip(
    "bottom-start",
    "bottom-start",
    "click"
  );
  const { targetRef: targetRefBottom, tooltip: tooltipBottom } = useTooltip("bottom", "bottom", "click");
  const { targetRef: targetRefBottomEnd, tooltip: tooltipBottomEnd } = useTooltip("bottom-end", "bottom-end", "click");

  return (
    <Container>
      <GridCell>
        <ReferenceElement ref={targetRefTopStart} />
        {tooltipTopStart}
      </GridCell>
      <GridCell>
        <ReferenceElement ref={targetRefTop} />
        {tooltipTop}
      </GridCell>
      <GridCell>
        <ReferenceElement ref={targetRefTopEnd} />
        {tooltipTopEnd}
      </GridCell>
      <GridCell>
        <ReferenceElement ref={targetRefLeftStart} />
        {tooltipLeftStart}
      </GridCell>
      <div />
      <GridCell>
        <ReferenceElement ref={targetRefRightStart} />
        {tooltipRightStart}
      </GridCell>
      <GridCell>
        <ReferenceElement ref={targetRefLeft} />
        {tooltipLeft}
      </GridCell>
      <div />
      <GridCell>
        <ReferenceElement ref={targetRefRight} />
        {tooltipRight}
      </GridCell>
      <GridCell>
        <ReferenceElement ref={targetRefLeftEnd} />
        {tooltipLeftEnd}
      </GridCell>
      <div />
      <GridCell>
        <ReferenceElement ref={targetRefRightEnd} />
        {tooltipRightEnd}
      </GridCell>
      <GridCell>
        <ReferenceElement ref={targetRefBottomStart} />
        {tooltipBottomStart}
      </GridCell>
      <GridCell>
        <ReferenceElement ref={targetRefBottom} />
        {tooltipBottom}
      </GridCell>
      <GridCell>
        <ReferenceElement ref={targetRefBottomEnd} />
        {tooltipBottomEnd}
      </GridCell>
    </Container>
  );
};

export const Triggers: React.FC = () => {
  const { tooltipVisible: tooltipVisibleClick, targetRef: targetRefClick, tooltip: tooltipClick } = useTooltip(
    "You clicked me!",
    "right",
    "click"
  );
  const { tooltipVisible: tooltipVisibleHover, targetRef: targetRefHover, tooltip: tooltipHover } = useTooltip(
    "Hovering",
    "right",
    "hover"
  );

  const { tooltipVisible: tooltipVisibleFocus, targetRef: targetRefFocus, tooltip: tooltipFocus } = useTooltip(
    "You focused me!",
    "right",
    "focus"
  );
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "300px",
        width: "200px",
        justifyContent: "space-evenly",
      }}
    >
      <Input ref={targetRefClick} placeholder="click" />
      {tooltipVisibleClick && tooltipClick}
      <Input ref={targetRefHover} placeholder="hover" />
      {tooltipVisibleHover && tooltipHover}
      <Input ref={targetRefFocus} placeholder="focus" />
      {tooltipVisibleFocus && tooltipFocus}
    </div>
  );
};

export const EventPropagationAndMobile: React.FC = () => {
  const [showExpandedClick, setShowExpandedClick] = useState(false);
  const [showExpandedHover, setShowExpandedHover] = useState(false);
  const { tooltipVisible: tooltipVisibleClick, targetRef: targetRefClick, tooltip: tooltipClick } = useTooltip(
    "You clicked on the help icon but the card did not expand",
    "right",
    "click"
  );
  const { tooltipVisible: tooltipVisibleHover, targetRef: targetRefHover, tooltip: tooltipHover } = useTooltip(
    "You hovered over the help icon",
    "right",
    "hover"
  );
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "600px",
        width: "500px",
        justifyContent: "space-evenly",
      }}
    >
      <Text>
        Events do not propagate to other elements in the tree. This helps to not cause unwanted bahaviour like expanding
        the cards when clicking on the tooltip target.
      </Text>

      <ExpandableCard onClick={() => setShowExpandedClick(!showExpandedClick)}>
        <ExpandableHeader>
          On click {showExpandedClick ? "▴" : "▾"}
          <span ref={targetRefClick}>
            <HelpIcon />
          </span>
        </ExpandableHeader>
        {showExpandedClick && (
          <div style={{ margin: "15px 0" }}>You clicked on the header but not on the help icon inside the header</div>
        )}
        {tooltipVisibleClick && tooltipClick}
      </ExpandableCard>
      <Text>
        On touch screen devices hover interactions are also properly handled with `touchstart` and `touchend` events
        (`mouseenter` and `mouseleave` cause unwated behaviour on some mobile browsers).
      </Text>
      <ExpandableCard onClick={() => setShowExpandedHover(!showExpandedHover)}>
        <ExpandableHeader>
          On hover {showExpandedHover ? "▴" : "▾"}
          <span ref={targetRefHover}>
            <HelpIcon />
          </span>
        </ExpandableHeader>
        {showExpandedHover && (
          <div style={{ margin: "15px 0" }}>
            On mobile hovering (or more specifically touching and holding) over the help icon does not trigger expansion
            of this card
          </div>
        )}
        {tooltipVisibleHover && tooltipHover}
      </ExpandableCard>
    </div>
  );
};

export const FineTuning: React.FC = () => {
  const { tooltipVisible: tooltipVisibleDefault, targetRef: targetRefDefault, tooltip: tooltipDefault } = useTooltip(
    "Just default tooltip",
    "top-start",
    "hover"
  );
  const {
    tooltipVisible: tooltipVisibleFineTuned,
    targetRef: targetRefFineTuned,
    tooltip: tooltipFineTuned,
  } = useTooltip("Didn't you know that 6 comes before 7?", "top-start", "hover", { right: 221 }, undefined, [0, -8]);
  return (
    <div style={{ width: "500px", height: "500px" }}>
      <Text fontSize="20px">Hover over inputs</Text>
      <Text bold>Default placement</Text>
      <Input ref={targetRefDefault} value="0x1234567890000" />
      {tooltipVisibleDefault && tooltipDefault}
      <Text bold>Fine tuned arrow placement</Text>
      <Input ref={targetRefFineTuned} value="0x1234576890000" />
      {tooltipVisibleFineTuned && tooltipFineTuned}
    </div>
  );
};

export const Flipping: React.FC = () => {
  const { targetRef, tooltip } = useTooltip("All tooltips flip automatically when you scroll", "top", "hover");
  return (
    <div style={{ padding: "200px", width: "500px", height: "2000px" }}>
      <ReferenceElement ref={targetRef} />
      {tooltip}
    </div>
  );
};

export const ScreenEdges: React.FC = () => {
  const { targetRef: targetRefLeft, tooltip: tooltipLeft, tooltipVisible: leftVisible } = useTooltip(
    "I should not touch the edge of the screen",
    "top",
    "click"
  );
  const { targetRef: targetRefRight, tooltip: tooltipRight, tooltipVisible: rightVisible } = useTooltip(
    "I should not touch the edge of the screen",
    "top",
    "click"
  );
  const { targetRef: targetRefMiddle, tooltip: tooltipMiddle, tooltipVisible: middleVisible } = useTooltip(
    "I should not touch the edge of the screen",
    "top",
    "click"
  );
  return (
    <div style={{ padding: "16px", height: "800px", backgroundColor: "#EEE" }}>
      <Text>
        This story can be used to visually tooltip behavior when the target element is positioned close to the screen
        edge. Open this screen on the phone or in browser with responsive mode. Tooltips should not touch the screen
        edge.
      </Text>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "24px" }}>
        <span ref={targetRefLeft}>
          <HelpIcon />
        </span>
        {leftVisible && tooltipLeft}
        <span ref={targetRefMiddle}>
          <HelpIcon />
        </span>
        {middleVisible && tooltipMiddle}
        <span ref={targetRefRight}>
          <HelpIcon />
        </span>
        {rightVisible && tooltipRight}
      </div>
    </div>
  );
};
