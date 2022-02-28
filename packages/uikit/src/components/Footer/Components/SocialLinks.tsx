import React from "react";
import { darkColors } from "../../../theme";
import { FlexProps } from "../../Box";
import Flex from "../../Box/Flex";
import Dropdown from "../../Dropdown/Dropdown";
import Link from "../../Link/Link";
import IconComponent from "../../Svg/IconComponent";
import { socials } from "../config";

const SocialLinks: React.FC<FlexProps> = ({ ...props }) => (
  <Flex {...props}>
    {socials.map((social, index) => {
      const iconProps = {
        iconName: social.icon,
        width: "20px",
        color: darkColors.textSubtle,
        style: { cursor: "pointer" },
      };
      const mr = index < socials.length - 1 ? "24px" : 0;
      if (social.items) {
        return (
          <Dropdown key={social.label} position="top" target={<IconComponent {...iconProps} mr={mr} />}>
            {social.items.map((item) => (
              <Link external key={item.label} href={item.href} aria-label={item.label} color="textSubtle">
                {item.label}
              </Link>
            ))}
          </Dropdown>
        );
      }
      return (
        <Link external key={social.label} href={social.href} aria-label={social.label} mr={mr}>
          <IconComponent {...iconProps} />
        </Link>
      );
    })}
  </Flex>
);

export default React.memo(SocialLinks, () => true);
