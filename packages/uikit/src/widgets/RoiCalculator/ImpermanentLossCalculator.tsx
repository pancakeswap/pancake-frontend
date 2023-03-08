import { useTranslation } from "@pancakeswap/localization";
import { useCallback, useEffect, useState } from "react";

import { Section } from "./DynamicSection";
import { Toggle } from "../../components";
import { AssetCard, Asset } from "./AssetCard";

interface Props {
  assets?: Asset[];
}

const shouldResetAssets = (old?: Asset[], next?: Asset[]) => {
  if (!next) {
    return false;
  }

  if (!old) {
    return true;
  }

  if (old.length !== next.length) {
    return true;
  }

  for (let i = 0; i < old.length; i += 1) {
    if (!old[i].amount.equalTo(next[i].amount)) {
      return true;
    }
  }
  return false;
};

export function ImpermanentLossCalculator({ assets = [] }: Props) {
  const { t } = useTranslation();
  const [on, setOn] = useState(false);
  const [initialAssets, setInitialAssets] = useState<Asset[] | undefined>(assets);
  const [entry, setEntry] = useState<Asset[] | undefined>(assets);
  const [exit, setExit] = useState<Asset[] | undefined>(assets);
  const toggle = useCallback(() => setOn(!on), [on]);
  const resetEntry = useCallback(() => setEntry(initialAssets), [initialAssets]);
  const resetExit = useCallback(() => setExit(initialAssets), [initialAssets]);

  useEffect(() => {
    setInitialAssets(assets);
  }, [assets]);

  useEffect(() => {
    if (shouldResetAssets(entry, initialAssets)) {
      setEntry(initialAssets);
    }
    if (shouldResetAssets(exit, initialAssets)) {
      setExit(initialAssets);
    }
  }, [initialAssets, entry, exit]);

  if (!assets.length) {
    return null;
  }

  const calculator = on ? (
    <>
      <AssetCard mt={16} title={t("Entry price")} assets={entry} onChange={setEntry} />
      <AssetCard title={t("Exit price")} assets={exit} onChange={setExit} />
    </>
  ) : null;

  return (
    <Section title={t("Calculate impermanent loss")}>
      <Toggle checked={on} onChange={toggle} scale="md" />
      {calculator}
    </Section>
  );
}
