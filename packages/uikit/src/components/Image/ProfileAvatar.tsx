import React from "react";
import styled from "styled-components";
import BunnyPlaceholder from "../Svg/Icons/BunnyPlaceholder";
import BackgroundImage from "./BackgroundImage";
import { BackgroundImageProps } from "./types";

const StyledProfileAvatar = styled(BackgroundImage)`
  border-radius: 50%;
`;

const StyledBunnyPlaceholder = styled(BunnyPlaceholder)`
  height: 100%;
  width: 100%;
`;

const ProfileAvatar: React.FC<React.PropsWithChildren<BackgroundImageProps>> = (props) => (
  <StyledProfileAvatar loadingPlaceholder={<StyledBunnyPlaceholder />} {...props} />
);

export default ProfileAvatar;
