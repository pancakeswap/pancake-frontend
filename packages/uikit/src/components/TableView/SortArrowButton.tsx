import { styled } from "styled-components";
import { useCallback, useMemo, useState } from "react";
import { SortArrow, SortDESCIcon } from "../Svg";
import { Button, ButtonProps } from "../Button";

const SortButton = styled(Button)<ISortArrowButton>`
  padding: 1px 2px 3px 2px;
  border-radius: 6px;
  box-sizing: content-box;
  width: ${({ width }) => width ?? "25px"};
  height: ${({ height, width }) => height ?? width ?? "25px"};
  border-color: ${({ theme }) => theme.colors.cardBorder};
  background: ${({ theme }) => (theme.isDark ? theme.colors.backgroundDisabled : theme.colors.input)};
  path {
    fill: ${({ theme }) => (theme.isDark ? "rgba(255, 255, 255, 0.2)" : "#B4ACCF")};
  }
  &.descend {
    background: ${({ theme }) => (theme.isDark ? theme.colors.input : theme.colors.textSubtle)};
    path:first-child {
      fill: rgba(255, 255, 255, 1);
    }
    path:last-child {
      fill: rgba(255, 255, 255, 0.3);
    }
  }
  &.ascend {
    background: ${({ theme }) => (theme.isDark ? theme.colors.input : theme.colors.textSubtle)};
    path:first-child {
      fill: rgba(255, 255, 255, 0.3);
    }
    path:last-child {
      fill: rgba(255, 255, 255, 1);
    }
  }
`;

const SortDESCButton = styled(Button)<ISortArrowButton>`
  padding: 1px 2px 3px 2px;
  border-radius: 6px;
  box-sizing: content-box;
  width: ${({ width }) => width ?? "25px"};
  height: ${({ height, width }) => height ?? width ?? "25px"};
  border-color: ${({ theme }) => theme.colors.cardBorder};
  background: ${({ theme }) => (theme.isDark ? theme.colors.backgroundDisabled : theme.colors.input)};
  path {
    fill: ${({ theme }) => (theme.isDark ? "rgba(255, 255, 255, 0.2)" : theme.colors.textSubtle)};
  }
  &.descend {
    background: ${({ theme }) => (theme.isDark ? theme.colors.input : theme.colors.textSubtle)};
    path:first-child {
      fill: rgba(255, 255, 255, 1);
    }
  }
`;

export enum SORT_ORDER {
  NULL = 0,
  ASC = 1,
  DESC = -1,
}
export type ISortOrder = SORT_ORDER.NULL | SORT_ORDER.ASC | SORT_ORDER.DESC;

type ISortArrowButton = ButtonProps & {
  width?: string;
  height?: string;
  onSort?: (sortOrder: ISortOrder) => void;
  sortOrder?: ISortOrder;
  onlyDESC?: boolean;
};

export const SortArrowButton = (props: ISortArrowButton) => {
  const { onSort, sortOrder, onlyDESC, ...rest } = props;
  const [sortOrderInner, setSortOrderInner] = useState<ISortOrder>(SORT_ORDER.NULL);

  const order = useMemo(() => (onSort ? sortOrder : sortOrderInner), [sortOrder, sortOrderInner, onSort]);

  const handleClick = useCallback(() => {
    const nextSortOrder =
      order === SORT_ORDER.NULL ? SORT_ORDER.DESC : order === SORT_ORDER.DESC ? SORT_ORDER.ASC : SORT_ORDER.NULL;
    if (onSort) {
      onSort(nextSortOrder);
    } else {
      setSortOrderInner(nextSortOrder);
    }
  }, [onSort, order]);

  const cls = useMemo(() => {
    switch (order) {
      case SORT_ORDER.NULL:
        return "";
      case SORT_ORDER.DESC:
        return "descend";
      case SORT_ORDER.ASC:
        return "ascend";
      default:
        return "";
    }
  }, [order]);

  return onlyDESC ? (
    <SortDESCButton {...rest} onClick={handleClick} className={cls}>
      <SortDESCIcon width={props.width} />
    </SortDESCButton>
  ) : (
    <SortButton {...rest} onClick={handleClick} className={cls}>
      <SortArrow width={props.width} />
    </SortButton>
  );
};
