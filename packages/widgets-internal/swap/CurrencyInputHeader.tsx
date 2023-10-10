import { ReactNode, memo } from "react";
import { Heading, AtomBox, Text } from "@pancakeswap/uikit";

interface Props {
  title: ReactNode;
  subtitle: ReactNode;
}

export const CurrencyInputHeader = memo(({ title, subtitle }: Props) => {
  return (
    <AtomBox width="100%" alignItems="center" flexDirection="column" padding="24px" borderBottom="1">
      <AtomBox display="flex" width="100%" alignItems="center" justifyContent="space-between">
        {title}
      </AtomBox>
      {subtitle}
    </AtomBox>
  );
});

export const CurrencyInputHeaderTitle = memo(({ children }: { children: ReactNode }) => (
  <Heading as="h2">{children}</Heading>
));

export const CurrencyInputHeaderSubTitle = memo(({ children }: { children: ReactNode }) => (
  <Text color="textSubtle" fontSize="14px" textAlign="center">
    {children}
  </Text>
));
