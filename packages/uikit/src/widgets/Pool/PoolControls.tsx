import { useCallback, useEffect, useMemo, useRef, useState, ReactElement } from "react";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import partition from "lodash/partition";
import { useTranslation } from "@pancakeswap/localization";
import { useIntersectionObserver } from "@pancakeswap/hooks";
import latinise from "@pancakeswap/utils/latinise";
import { useRouter } from "next/router";

import PoolTabButtons from "./PoolTabButtons";
import { ViewMode } from "../../components/ToggleView/ToggleView";
import { Flex, Text, SearchInput, Select, OptionProps } from "../../components";

import { DeserializedPool, DeserializedPoolVault } from "./types";
import { sortPools } from "./helpers";

const PoolControlsView = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`;

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`;

const ControlStretch = styled(Flex)`
  > div {
    flex: 1;
  }
`;

const NUMBER_OF_POOLS_VISIBLE = 12;

interface ChildrenReturn<T> {
  chosenPools: DeserializedPool<T>[];
  viewMode: ViewMode;
  stakedOnly: boolean;
  showFinishedPools: boolean;
  normalizedUrlSearch: string;
}

interface PoolControlsPropsType<T> {
  pools: DeserializedPool<T>[];
  children: (childrenReturn: ChildrenReturn<T>) => ReactElement;
  stakedOnly: boolean;
  setStakedOnly: (s: boolean) => void;
  viewMode: ViewMode;
  setViewMode: (s: ViewMode) => void;
  account: string;
  threshHold: number;
  hideViewMode?: boolean;
}

export function PoolControls<T>({
  pools,
  children,
  stakedOnly,
  setStakedOnly,
  viewMode,
  setViewMode,
  account,
  threshHold,
  hideViewMode = false,
}: PoolControlsPropsType<T>) {
  const router = useRouter();
  const { t } = useTranslation();

  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(NUMBER_OF_POOLS_VISIBLE);
  const { observerRef, isIntersecting } = useIntersectionObserver();
  const normalizedUrlSearch = useMemo(
    () => (typeof router?.query?.search === "string" ? router.query.search : ""),
    [router.query]
  );
  const [_searchQuery, setSearchQuery] = useState("");
  const searchQuery = normalizedUrlSearch && !_searchQuery ? normalizedUrlSearch : _searchQuery;
  const [sortOption, setSortOption] = useState("hot");
  const chosenPoolsLength = useRef(0);

  const [finishedPools, openPools] = useMemo(() => partition(pools, (pool) => pool.isFinished), [pools]);
  const openPoolsWithStartBlockFilter = useMemo(
    () =>
      openPools.filter((pool) =>
        threshHold > 0 && pool.startTimestamp ? Number(pool.startTimestamp) < threshHold : true
      ),
    [threshHold, openPools]
  );
  const stakedOnlyFinishedPools = useMemo(
    () =>
      finishedPools.filter((pool) => {
        if (pool.vaultKey) {
          const vault = pool as DeserializedPoolVault<T>;
          return vault?.userData?.userShares?.gt(0);
        }
        return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0);
      }),
    [finishedPools]
  );
  const stakedOnlyOpenPools = useCallback(() => {
    return openPoolsWithStartBlockFilter.filter((pool) => {
      if (pool.vaultKey) {
        const vault = pool as DeserializedPoolVault<T>;
        return vault?.userData?.userShares?.gt(0);
      }
      return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0);
    });
  }, [openPoolsWithStartBlockFilter]);
  const hasStakeInFinishedPools = stakedOnlyFinishedPools.length > 0;

  useEffect(() => {
    if (isIntersecting) {
      setNumberOfPoolsVisible((poolsCurrentlyVisible) => {
        if (poolsCurrentlyVisible <= chosenPoolsLength.current) {
          return poolsCurrentlyVisible + NUMBER_OF_POOLS_VISIBLE;
        }
        return poolsCurrentlyVisible;
      });
    }
  }, [isIntersecting]);
  const showFinishedPools = router.pathname.includes("history");

  const handleChangeSearchQuery = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(event.target.value),
    []
  );

  const handleSortOptionChange = useCallback((option: OptionProps) => setSortOption(option.value), []);

  let chosenPools: DeserializedPool<T>[];
  if (showFinishedPools) {
    chosenPools = stakedOnly ? stakedOnlyFinishedPools : finishedPools;
  } else {
    chosenPools = stakedOnly ? stakedOnlyOpenPools() : openPoolsWithStartBlockFilter;
  }

  chosenPools = useMemo(() => {
    const sortedPools = sortPools<T>(account, sortOption, chosenPools).slice(0, numberOfPoolsVisible);

    if (searchQuery) {
      const lowercaseQuery = latinise(searchQuery.toLowerCase());
      return sortedPools.filter((pool) =>
        latinise(pool?.earningToken?.symbol?.toLowerCase() || "").includes(lowercaseQuery)
      );
    }
    return sortedPools;
  }, [account, sortOption, chosenPools, numberOfPoolsVisible, searchQuery]);

  chosenPoolsLength.current = chosenPools.length;

  const childrenReturn: ChildrenReturn<T> = useMemo(
    () => ({ chosenPools, stakedOnly, viewMode, normalizedUrlSearch, showFinishedPools }),
    [chosenPools, normalizedUrlSearch, showFinishedPools, stakedOnly, viewMode]
  );

  return (
    <>
      <PoolControlsView>
        <PoolTabButtons
          stakedOnly={stakedOnly}
          setStakedOnly={setStakedOnly}
          hasStakeInFinishedPools={hasStakeInFinishedPools}
          viewMode={viewMode}
          setViewMode={setViewMode}
          hideViewMode={hideViewMode}
        />
        <FilterContainer>
          <LabelWrapper>
            <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
              {t("Sort by")}
            </Text>
            <ControlStretch>
              <Select
                options={[
                  {
                    label: t("Hot"),
                    value: "hot",
                  },
                  {
                    label: t("APR"),
                    value: "apr",
                  },
                  {
                    label: t("Earned"),
                    value: "earned",
                  },
                  {
                    label: t("Total staked"),
                    value: "totalStaked",
                  },
                  {
                    label: t("Latest"),
                    value: "latest",
                  },
                ]}
                onOptionChange={handleSortOptionChange}
              />
            </ControlStretch>
          </LabelWrapper>
          <LabelWrapper style={{ marginLeft: 16 }}>
            <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
              {t("Search")}
            </Text>
            <SearchInput initialValue={searchQuery} onChange={handleChangeSearchQuery} placeholder="Search Pools" />
          </LabelWrapper>
        </FilterContainer>
      </PoolControlsView>
      {children(childrenReturn)}
      <div ref={observerRef} />
    </>
  );
}
