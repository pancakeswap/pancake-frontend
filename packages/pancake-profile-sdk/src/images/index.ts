// Common

import bunnyPlaceholder from "./bunny-placeholder.svg";

// Achievements

import easterChampionBronze from "./achievements/easter-champion-bronze.svg";
import easterChampionGold from "./achievements/easter-champion-gold.svg";
import easterChampionSilver from "./achievements/easter-champion-silver.svg";

import easterParticipantBronze from "./achievements/easter-participant-bronze.svg";
import easterParticipantGold from "./achievements/easter-participant-gold.svg";
import easterParticipantSilver from "./achievements/easter-participant-silver.svg";

import easterTop500Bronze from "./achievements/easter-top-500-bronze.svg";
import easterTop500Gold from "./achievements/easter-top-500-gold.svg";
import easterTop500Silver from "./achievements/easter-top-500-silver.svg";

import ifoBelt from "./achievements/ifo-belt.svg";
import ifoBlk from "./achievements/ifo-blk.svg";
import ifoBry from "./achievements/ifo-bry.svg";
import ifoDitto from "./achievements/ifo-ditto.svg";
import ifoHelmet from "./achievements/ifo-helmet.svg";
import ifoHotcross from "./achievements/ifo-hotcross.svg";
import ifoHzn from "./achievements/ifo-hzn.svg";
import ifoKalm from "./achievements/ifo-kalm.svg";
import ifoTen from "./achievements/ifo-ten.svg";
import ifoWatch from "./achievements/ifo-watch.svg";
import ifoWsote from "./achievements/ifo-wsote.svg";

// Team images

import syrupStormSm from "./teams/syrup-storm-sm.png";
import syrupStormMd from "./teams/syrup-storm-md.png";
import syrupStormLg from "./teams/syrup-storm-lg.png";
import syrupStormAlt from "./teams/syrup-storm-alt.png";
import syrupStormBg from "./teams/syrup-storm-bg.svg";

import fearsomeFlippersSm from "./teams/fearsome-flippers-sm.png";
import fearsomeFlippersMd from "./teams/fearsome-flippers-md.png";
import fearsomeFlippersLg from "./teams/fearsome-flippers-lg.png";
import fearsomeFlippersAlt from "./teams/fearsome-flippers-alt.png";
import fearsomeFlippersBg from "./teams/fearsome-flippers-bg.svg";

import chaoticCakersSm from "./teams/chaotic-cakers-sm.png";
import chaoticCakersMd from "./teams/chaotic-cakers-md.png";
import chaoticCakersLg from "./teams/chaotic-cakers-lg.png";
import chaoticCakersAlt from "./teams/chaotic-cakers-alt.png";
import chaoticCakersBg from "./teams/chaotic-cakers-bg.svg";

interface ImageMap {
  [key: string]: string;
}

const achievementBadges: ImageMap = {
  "easter-champion-bronze.svg": easterChampionBronze,
  "easter-champion-gold.svg": easterChampionGold,
  "easter-champion-silver.svg": easterChampionSilver,
  "easter-participant-bronze.svg": easterParticipantBronze,
  "easter-participant-gold.svg": easterParticipantGold,
  "easter-participant-silver.svg": easterParticipantSilver,
  "easter-top-500-bronze.svg": easterTop500Bronze,
  "easter-top-500-gold.svg": easterTop500Gold,
  "easter-top-500-silver.svg": easterTop500Silver,
  "ifo-belt.svg": ifoBelt,
  "ifo-blk.svg": ifoBlk,
  "ifo-bry.svg": ifoBry,
  "ifo-ditto.svg": ifoDitto,
  "ifo-helmet.svg": ifoHelmet,
  "ifo-hotcross.svg": ifoHotcross,
  "ifo-hzn.svg": ifoHzn,
  "ifo-kalm.svg": ifoKalm,
  "ifo-ten.svg": ifoTen,
  "ifo-watch.svg": ifoWatch,
  "ifo-wsote.svg": ifoWsote,
  unknown: bunnyPlaceholder,
};

const teamImages: ImageMap = {
  "syrup-storm-sm.png": syrupStormSm,
  "syrup-storm-md.png": syrupStormMd,
  "syrup-storm-lg.png": syrupStormLg,
  "syrup-storm-alt.png": syrupStormAlt,
  "syrup-storm-bg.svg": syrupStormBg,
  "fearsome-flippers-sm.png": fearsomeFlippersSm,
  "fearsome-flippers-md.png": fearsomeFlippersMd,
  "fearsome-flippers-lg.png": fearsomeFlippersLg,
  "fearsome-flippers-alt.png": fearsomeFlippersAlt,
  "fearsome-flippers-bg.svg": fearsomeFlippersBg,
  "chaotic-cakers-sm.png": chaoticCakersSm,
  "chaotic-cakers-md.png": chaoticCakersMd,
  "chaotic-cakers-lg.png": chaoticCakersLg,
  "chaotic-cakers-alt.png": chaoticCakersAlt,
  "chaotic-cakers-bg.svg": chaoticCakersBg,
};

export { achievementBadges, teamImages, bunnyPlaceholder };
