import React from "react";
import { capitalize } from "lodash";
import Box from "../Box/Box";
import Flex from "../Box/Flex";
import { CommunityIcon, RemoveIcon } from "../Svg";
import Tag from "./Tag";
import { scales, variants } from "./types";

export default {
  title: "Components/Tag",
  argTypes: {},
};

export const Default: React.FC = () => {
  return (
    <Box>
      {Object.values(variants).map((variant) => {
        return (
          <Box key={variant} mb="32px ">
            <Flex alignItems="center">
              {Object.values(scales).map((scale) => {
                return (
                  <Tag scale={scale} variant={variant} mr="8px">
                    {`${capitalize(variant)}: ${scale.toUpperCase()}`}
                  </Tag>
                );
              })}
              <Tag variant={variant} outline mr="8px">
                {`${capitalize(variant)} Outline`}
              </Tag>
              <Tag variant={variant} outline startIcon={<CommunityIcon />} mr="8px">
                {`${capitalize(variant)} Icon Left`}
              </Tag>
              <Tag variant={variant} outline endIcon={<RemoveIcon />} mr="8px">
                {`${capitalize(variant)} Icon Right`}
              </Tag>
              <Tag variant={variant} outline startIcon={<CommunityIcon />} endIcon={<RemoveIcon />}>
                {`${capitalize(variant)} Both`}
              </Tag>
            </Flex>
          </Box>
        );
      })}
    </Box>
  );
};

export const TextVariations: React.FC = () => {
  return (
    <div>
      <Tag textTransform="uppercase" mr="16px">
        uppercase
      </Tag>
      <Tag fontWeight="bold" mr="16px">
        Bold
      </Tag>
    </div>
  );
};
