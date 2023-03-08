import { useTranslation } from "@pancakeswap/localization";
import { useCallback, useState } from "react";

import { Section } from "./DynamicSection";
import { Toggle } from "../../components";

export function ImpermanentLossCalculator() {
  const { t } = useTranslation();
  const [on, setOn] = useState(false);
  const toggle = useCallback(() => setOn(!on), [on]);

  return (
    <Section title={t("Calculate impermanent loss")}>
      <Toggle checked={on} onChange={toggle} scale="md" />
    </Section>
  );
}
