import { AtomBox, Heading, Text } from "@pancakeswap/uikit";
import { ReactNode, memo } from "react";

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

interface CurrencyInputHeaderTitleProps {
  color: string;
  children: ReactNode;
}

export const CurrencyInputHeaderTitle = memo((props: CurrencyInputHeaderTitleProps) => {
  const { children, ...rest } = props;
  return (
    <Heading as="h2" {...rest}>
      {children}
    </Heading>
  );
});

export const CurrencyInputHeaderSubTitle = memo(({ children }: { children: ReactNode }) => (
  <Text color="textSubtle" fontSize="14px" textAlign="center">
    {children}
  </Text>
));
