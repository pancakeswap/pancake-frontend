import { styled } from "styled-components";
import { JSXElementConstructor, ReactNode, createElement } from "react";
import { useTranslation } from "@pancakeswap/localization";
import { LogoIcon } from "../Svg";
import { Heading } from "../Heading";
import { Text } from "../Text";
import { Button } from "../Button";

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  justify-content: center;
`;

const NotFound = ({
  statusCode = 404,
  children,
  LinkComp,
}: {
  LinkComp: JSXElementConstructor<any>;
  statusCode?: number;
  children: ReactNode;
}) => {
  const { t } = useTranslation();

  const linkElement = createElement(
    LinkComp,
    {
      href: "/",
      passHref: true,
    },
    <Button scale="sm">{t("Back Home")}</Button>
  );

  return (
    <>
      {children}
      <StyledNotFound>
        <LogoIcon width="64px" mb="8px" />
        <Heading scale="xxl">{statusCode}</Heading>
        <Text mb="16px">{t("Oops, page not found.")}</Text>
        {linkElement}
      </StyledNotFound>
    </>
  );
};

export default NotFound;
