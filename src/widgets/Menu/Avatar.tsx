import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Profile } from "./types";
import NoProfileAvatar from "./icons/NoProfileAvatar";

interface AvatarProps {
  profile: Profile;
}

const StyledAvatar = styled.div`
  margin-left: 8px;

  img {
    border-radius: 50%;
  }
`;

const Avatar: React.FC<AvatarProps> = ({ profile }) => {
  const { username = "Bunny", image, profileLink, noProfileLink } = profile;
  const link = profile.username ? profileLink : noProfileLink;
  const isExternal = link.startsWith("http");
  const ariaLabel = "Link to profile";
  const icon = image ? (
    <img src={image} alt="profile avatar" height="32px" width="32px" />
  ) : (
    <NoProfileAvatar width="32px" height="32px" />
  );

  if (isExternal) {
    return (
      <StyledAvatar title={username}>
        <a href={link} aria-label={ariaLabel}>
          {icon}
        </a>
      </StyledAvatar>
    );
  }

  return (
    <StyledAvatar title={username}>
      <Link to={link} aria-label={ariaLabel}>
        {icon}
      </Link>
    </StyledAvatar>
  );
};

export default Avatar;
