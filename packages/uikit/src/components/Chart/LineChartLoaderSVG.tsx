import { Svg, SvgProps } from "../Svg";

const LineChartLoaderSVG: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 50" {...props}>
      <path
        d="M 0 49 C 1 49 1 45 4 47 C 7 49 7 35 11 37 C 13 38 14 32 16 34 C 18 35.6667 20 40 22 39 C 24 38 24 34 26 34 C 27 34 29 39 32 36 C 33 35 34 32 35 32 C 37 32 37 35 39 34 C 40 33 39 29 43 31 C 46 32 45 28 47 30 C 50 32 49 22 51 24 Q 53 26 55 24 C 56 23 56 25 57 26 C 58 27 59 28 60 28 C 63 28 66 17 67 16 C 68 15 69 17 70 16 C 71 15 71 13 74 13 C 76 13 76 14 77 15 C 79 17 80 18 82 18 C 83 18 83 17 84 17 C 87 17 89 24 91 24 C 93 24 95 20 96 17 C 97.6667 13.3333 98 9 101 6"
        stroke="#7645D9"
        strokeWidth="0.2"
        strokeDasharray="156"
        strokeDashoffset="156"
        fill="transparent"
        opacity="0.5"
        filter="url(#glow)"
      >
        <animate
          id="firstline"
          attributeName="stroke-dashoffset"
          dur="2s"
          from="156"
          to="-156"
          begin="0s;firstline.end+0.5s"
        />
      </path>
      <path
        d="M 0 49 C 1 49 1 45 4 47 C 7 49 7 35 11 37 C 13 38 14 32 16 34 C 18 35.6667 20 40 22 39 C 24 38 24 34 26 34 C 27 34 29 39 32 36 C 33 35 34 32 35 32 C 37 32 37 35 39 34 C 40 33 39 29 43 31 C 46 32 45 28 47 30 C 50 32 49 22 51 24 Q 53 26 55 24 C 56 23 56 25 57 26 C 58 27 59 28 60 28 C 63 28 66 17 67 16 C 68 15 69 17 70 16 C 71 15 71 13 74 13 C 76 13 76 14 77 15 C 79 17 80 18 82 18 C 83 18 83 17 84 17 C 87 17 89 24 91 24 C 93 24 95 20 96 17 C 97.6667 13.3333 98 9 101 6"
        stroke="#7645D9"
        strokeWidth="0.2"
        strokeDasharray="156"
        strokeDashoffset="156"
        fill="transparent"
        opacity="0.5"
        filter="url(#glow)"
      >
        <animate
          id="secondline"
          attributeName="stroke-dashoffset"
          dur="2s"
          from="156"
          to="-156"
          begin="1.3s;secondline.end+0.5s"
        />
      </path>
      <defs>
        <filter id="glow">
          <feGaussianBlur className="blur" result="coloredBlur" stdDeviation="4" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </Svg>
  );
};

export default LineChartLoaderSVG;
