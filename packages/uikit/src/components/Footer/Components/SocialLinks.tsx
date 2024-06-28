import React from "react";
import useMatchBreakpoints from "../../../contexts/MatchBreakpoints/useMatchBreakpoints";
import { FlexProps } from "../../Box";
import Flex from "../../Box/Flex";
import Dropdown from "../../Dropdown/Dropdown";
import Link from "../../Link/Link";
import { socials } from "../config";

const SocialLinks: React.FC<React.PropsWithChildren<FlexProps>> = ({ ...props }) => {
  const { isMobile } = useMatchBreakpoints();

  return (
    <Flex {...props} data-theme="dark" mb={[12]}>
      {socials.map((social, index) => {
        const iconProps = {
          width: "20px",
          color: "textSubtle",
          style: { cursor: "pointer" },
        };
        const Icon = social.icon;
        const mr = index < socials.length - 1 ? (isMobile ? "16px" : "24px") : 0;
        if (social.items?.length) {
          return (
            <Dropdown key={social.label} position="top" target={<Icon {...iconProps} mr={mr} />}>
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
            <Icon {...iconProps} />
          </Link>
        );
      })}
    </Flex>
  );
};

export default React.memo(SocialLinks, () => true);
