import { ScaleLinear, select, zoom, ZoomBehavior, zoomIdentity, ZoomTransform } from "d3";
import { useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { ZoomInIcon, ZoomOutIcon, AutoRenewIcon } from "../Svg";
import { Box } from "../Box";

import { ZoomLevels } from "./types";

const Wrapper = styled.div<{ count: number }>`
  display: grid;
  grid-template-columns: repeat(${({ count }) => count.toString()}, 1fr);
  grid-gap: 6px;

  position: absolute;
  top: -18px;
  right: 0;
`;

export const ZoomOverlay = styled.rect`
  fill: transparent;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

export default function Zoom({
  svg,
  xScale,
  setZoom,
  width,
  height,
  resetBrush,
  showResetButton,
  zoomLevels,
}: {
  svg: SVGElement | null;
  xScale: ScaleLinear<number, number>;
  setZoom: (transform: ZoomTransform) => void;
  width: number;
  height: number;
  resetBrush: () => void;
  showResetButton: boolean;
  zoomLevels: ZoomLevels;
}) {
  const zoomBehavior = useRef<ZoomBehavior<Element, unknown>>();

  const [zoomIn, zoomOut, zoomInitial, zoomReset] = useMemo(
    () => [
      () =>
        svg &&
        zoomBehavior.current &&
        select(svg as Element)
          .transition()
          .call(zoomBehavior.current.scaleBy, 2),
      () =>
        svg &&
        zoomBehavior.current &&
        select(svg as Element)
          .transition()
          .call(zoomBehavior.current.scaleBy, 0.5),
      () =>
        svg &&
        zoomBehavior.current &&
        select(svg as Element)
          .transition()
          .call(zoomBehavior.current.scaleTo, 0.5),
      () =>
        svg &&
        zoomBehavior.current &&
        select(svg as Element)
          .call(zoomBehavior.current.transform, zoomIdentity.translate(0, 0).scale(1))
          .transition()
          .call(zoomBehavior.current.scaleTo, 0.5),
    ],
    [svg]
  );

  useEffect(() => {
    if (!svg) return;

    zoomBehavior.current = zoom()
      .scaleExtent([zoomLevels.min, zoomLevels.max])
      .extent([
        [0, 0],
        [width, height],
      ])
      .on("zoom", ({ transform }: { transform: ZoomTransform }) => setZoom(transform));

    select(svg as Element).call(zoomBehavior.current);
  }, [height, width, setZoom, svg, xScale, zoomBehavior, zoomLevels, zoomLevels.max, zoomLevels.min]);

  useEffect(() => {
    // reset zoom to initial on zoomLevel change
    zoomInitial();
  }, [zoomInitial, zoomLevels]);

  return (
    <Wrapper count={showResetButton ? 3 : 2}>
      {showResetButton && (
        <Box
          style={{
            cursor: "pointer",
            textAlign: "center",
            paddingTop: "2px",
            paddingLeft: "4px",
          }}
        >
          <AutoRenewIcon
            color="primary"
            width={20}
            onClick={() => {
              resetBrush();
              zoomReset();
            }}
          />
        </Box>
      )}
      <Box
        style={{
          cursor: "pointer",
        }}
      >
        <ZoomInIcon width={24} onClick={zoomIn} color="primary" />
      </Box>
      <Box
        style={{
          cursor: "pointer",
        }}
      >
        <ZoomOutIcon width={24} onClick={zoomOut} color="primary" />
      </Box>
    </Wrapper>
  );
}
