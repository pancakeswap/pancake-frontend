import { useTranslation } from "@pancakeswap/localization";
import {
  AlpIcon,
  ArbitrumIcon,
  AutoRenewIcon,
  BaseIcon,
  BinanceChainIcon,
  BlockIcon,
  CheckmarkCircleIcon,
  CommunityIcon,
  EthChainIcon,
  LineaIcon,
  LockIcon,
  RefreshIcon,
  RocketIcon,
  Tag,
  TagProps,
  Text,
  TimerIcon,
  TooltipText,
  VerifiedIcon,
  VoteIcon,
  ZkEVMIcon,
  ZkSyncIcon,
  useTooltip,
} from "@pancakeswap/uikit";
import type { FeeAmount } from "@pancakeswap/v3-sdk";
import React, { memo } from "react";

const CoreTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag
      variant="secondary"
      style={{ background: "none", width: "fit-content" }}
      outline
      startIcon={<VerifiedIcon width="18px" color="secondary" mr="4px" />}
      {...props}
    >
      {t("Core")}
    </Tag>
  );
};

const FarmAuctionTagToolTipContent = memo(() => {
  const { t } = useTranslation();
  return <Text color="text">{t("Farm Auction Winner, add liquidity at your own risk.")}</Text>;
});

const FarmAuctionTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<FarmAuctionTagToolTipContent />, { placement: "top" });
  return (
    <>
      {tooltipVisible && tooltip}
      <TooltipText
        ref={targetRef}
        display="flex"
        style={{ textDecoration: "none", justifyContent: "center", alignSelf: "center" }}
      >
        <Tag variant="failure" outline startIcon={<CommunityIcon width="18px" color="failure" mr="4px" />} {...props}>
          {t("Farm Auction")}
        </Tag>
      </TooltipText>
    </>
  );
};

const StableFarmTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  const { targetRef, tooltip, tooltipVisible } = useTooltip("Fees are lower for stable LP", { placement: "top" });
  return (
    <>
      {tooltipVisible && tooltip}
      <TooltipText
        ref={targetRef}
        display="flex"
        style={{ textDecoration: "none", justifyContent: "center", alignSelf: "center" }}
      >
        <Tag variant="textSubtle" style={{ padding: 8 }} {...props}>
          {t("Stable LP")}
        </Tag>
      </TooltipText>
    </>
  );
};

const CommunityTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="failure" outline startIcon={<CommunityIcon width="18px" color="failure" mr="4px" />} {...props}>
      {t("Community")}
    </Tag>
  );
};

const DualTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="textSubtle" outline {...props}>
      {t("Dual")}
    </Tag>
  );
};

const ManualPoolTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="secondary" outline startIcon={<RefreshIcon width="18px" color="secondary" mr="4px" />} {...props}>
      {t("Manual")}
    </Tag>
  );
};

const LockedOrAutoPoolTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="success" outline {...props}>
      {t("Auto")}/{t("Locked")}
    </Tag>
  );
};

const LockedPoolTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="success" outline startIcon={<LockIcon width="18px" color="success" mr="4px" />} {...props}>
      {t("Locked")}
    </Tag>
  );
};

const CompoundingPoolTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="success" outline startIcon={<AutoRenewIcon width="18px" color="success" mr="4px" />} {...props}>
      {t("Auto")}
    </Tag>
  );
};

const VoteNowTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="success" startIcon={<VoteIcon width="18px" color="white" mr="4px" />} {...props}>
      {t("Vote Now")}
    </Tag>
  );
};

const VotedTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag
      variant="success"
      style={{ background: "none" }}
      outline
      startIcon={<CheckmarkCircleIcon width="18px" color="success" mr="4px" />}
      {...props}
    >
      {t("Voted")}
    </Tag>
  );
};

const SoonTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="binance" startIcon={<TimerIcon width="18px" color="white" mr="4px" />} {...props}>
      {t("Soon")}
    </Tag>
  );
};

const ClosedTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="textDisabled" startIcon={<BlockIcon width="18px" color="white" mr="4px" />} {...props}>
      {t("Closed")}
    </Tag>
  );
};

const BoostedTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="success" outline startIcon={<RocketIcon width="18px" color="success" mr="4px" />} {...props}>
      {t("Boosted")}
    </Tag>
  );
};

const V2Tag: React.FC<TagProps> = (props) => (
  <Tag variant="textDisabled" outline {...props}>
    V2
  </Tag>
);

const V3Tag: React.FC<TagProps> = (props) => (
  <Tag variant="secondary" {...props}>
    V3
  </Tag>
);

const V3FeeTag: React.FC<TagProps & { feeAmount?: FeeAmount }> = ({ feeAmount, ...props }) =>
  feeAmount ? (
    <Tag variant="secondary" outline {...props}>
      {feeAmount / 10_000}%
    </Tag>
  ) : null;

const EthTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  return (
    <Tag style={{ background: "#627EEA" }} startIcon={<EthChainIcon width="10px" mr="4px" />} {...props}>
      ETH
    </Tag>
  );
};

const BscTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  return (
    <Tag style={{ background: "#08060B" }} startIcon={<BinanceChainIcon width="18px" mr="4px" />} {...props}>
      BNB
    </Tag>
  );
};

const OpBnbTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  return (
    <Tag style={{ background: "#08060B" }} startIcon={<BinanceChainIcon width="18px" mr="4px" />} {...props}>
      opBNB
    </Tag>
  );
};

const ZkEVMTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  return (
    <Tag
      style={{ background: "linear-gradient(57deg, #A726C1 0%, #803BDF 88.00%, #7B3FE4 100%)" }}
      startIcon={<ZkEVMIcon width="18px" mr="4px" />}
      {...props}
    >
      zkEVM
    </Tag>
  );
};

const ZkSyncTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  return (
    <Tag style={{ background: "#08060B" }} startIcon={<ZkSyncIcon width="18px" mr="4px" />} {...props}>
      zkSync
    </Tag>
  );
};

const ArbTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  return (
    <Tag style={{ background: "#2D374B" }} startIcon={<ArbitrumIcon width="18px" mr="4px" />} {...props}>
      ARB
    </Tag>
  );
};

const BaseTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  return (
    <Tag style={{ background: "#0052FF" }} startIcon={<BaseIcon width="18px" mr="4px" />} {...props}>
      Base
    </Tag>
  );
};

const LineaTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  return (
    <Tag style={{ background: "#121212" }} startIcon={<LineaIcon width="18px" mr="4px" />} {...props}>
      Linea
    </Tag>
  );
};

const AlpBoostedTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag outline {...props} variant="secondary" startIcon={<AlpIcon width="18px" color="#4B3CFF" m="-3px 3px 0 0" />}>
      {t("Boosted")}
    </Tag>
  );
};

const Tags = {
  CoreTag,
  FarmAuctionTag,
  DualTag,
  ManualPoolTag,
  CompoundingPoolTag,
  VoteNowTag,
  SoonTag,
  ClosedTag,
  CommunityTag,
  StableFarmTag,
  LockedPoolTag,
  LockedOrAutoPoolTag,
  BoostedTag,
  VotedTag,
  V2Tag,
  V3FeeTag,
  V3Tag,
  EthTag,
  BscTag,
  ZkEVMTag,
  ZkSyncTag,
  ArbTag,
  BaseTag,
  LineaTag,
  AlpBoostedTag,
  OpBnbTag,
};

export default Tags;
