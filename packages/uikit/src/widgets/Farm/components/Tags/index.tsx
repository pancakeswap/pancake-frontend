import { useTranslation } from "@pancakeswap/localization";
import { memo } from "react";
import { Text, TooltipText } from "../../../../components/Text";
import { Tag, TagProps } from "../../../../components/Tag/index";
import { useTooltip } from "../../../../hooks/useTooltip";
import {
  AutoRenewIcon,
  BlockIcon,
  CommunityIcon,
  RefreshIcon,
  TimerIcon,
  VerifiedIcon,
  VoteIcon,
  LockIcon,
  RocketIcon,
  CurrencyIcon,
  CheckmarkCircleIcon,
} from "../../../../components/Svg";

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
      <TooltipText ref={targetRef} style={{ textDecoration: "none" }}>
        <Tag
          variant="failure"
          style={{ background: "none" }}
          outline
          startIcon={<CommunityIcon width="18px" color="failure" mr="4px" />}
          {...props}
        >
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
        <Tag
          variant="failure"
          style={{ background: "none" }}
          outline
          startIcon={<CurrencyIcon width="18px" color="failure" mr="4px" />}
          {...props}
        >
          {t("Stable LP")}
        </Tag>
      </TooltipText>
    </>
  );
};

const CommunityTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag
      variant="failure"
      style={{ background: "none" }}
      outline
      startIcon={<CommunityIcon width="18px" color="failure" mr="4px" />}
      {...props}
    >
      {t("Community")}
    </Tag>
  );
};

const DualTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="textSubtle" style={{ background: "none" }} outline {...props}>
      {t("Dual")}
    </Tag>
  );
};

const ManualPoolTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag
      variant="secondary"
      style={{ background: "none" }}
      outline
      startIcon={<RefreshIcon width="18px" color="secondary" mr="4px" />}
      {...props}
    >
      {t("Manual")}
    </Tag>
  );
};

const LockedOrAutoPoolTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="success" style={{ background: "none" }} outline {...props}>
      {t("Auto")}/{t("Locked")}
    </Tag>
  );
};

const LockedPoolTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag
      variant="success"
      style={{ background: "none" }}
      outline
      startIcon={<LockIcon width="18px" color="success" mr="4px" />}
      {...props}
    >
      {t("Locked")}
    </Tag>
  );
};

const CompoundingPoolTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag
      variant="success"
      style={{ background: "none" }}
      outline
      startIcon={<AutoRenewIcon width="18px" color="success" mr="4px" />}
      {...props}
    >
      {t("Auto")}
    </Tag>
  );
};

const VoteNowTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="success" startIcon={<VoteIcon width="18px" color="success" mr="4px" />} {...props}>
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
    <Tag variant="binance" startIcon={<TimerIcon width="18px" color="success" mr="4px" />} {...props}>
      {t("Soon")}
    </Tag>
  );
};

const ClosedTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="textDisabled" startIcon={<BlockIcon width="18px" color="textDisabled" mr="4px" />} {...props}>
      {t("Closed")}
    </Tag>
  );
};

const BoostedTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag
      variant="success"
      style={{ background: "none" }}
      outline
      startIcon={<RocketIcon width="18px" color="success" mr="4px" />}
      {...props}
    >
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
};

export default Tags;
