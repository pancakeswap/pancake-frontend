import React, { useMemo } from "react";
import styled from "styled-components";
import { ITableViewProps, TableView } from "./Table";
import CardHeader from "../Card/CardHeader";
import Card from "../Card/Card";
import CardBody from "../Card/CardBody";
import { MoreIcon } from "../Svg";
import { Button } from "../Button";
import SubMenu from "../BaseMenu/SubMenu";

export default {
  title: "Components/TableView",
  component: TableView,
};

interface IDataType {
  name: string;
  feeTier: number;
  apr: number;
  tvl: number;
  vol: number;
}

const StyledButton = styled(Button)`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 400;
  padding: 8px 16px;
  line-height: 24px;
  height: auto;
`;

const PoolListItemAction = (_, _poolInfo: IDataType) => {
  return (
    <SubMenu
      component={
        <Button scale="xs" variant="text">
          <MoreIcon />
        </Button>
      }
    >
      <StyledButton scale="sm" variant="text" as="a">
        View pool details
      </StyledButton>
      <StyledButton scale="sm" variant="text" as="a">
        Add Liquidity
      </StyledButton>
      <StyledButton scale="sm" variant="text" as="a">
        View info page
      </StyledButton>
    </SubMenu>
  );
};

const data: ITableViewProps<IDataType>["data"] = Array(10).fill({
  name: "Token1 / Token2",
  feeTier: 0.99,
  apr: 99.99,
  tvl: 999999,
  vol: 999999,
});

const useColumnConfig = (): ITableViewProps<IDataType>["columns"] => {
  return useMemo(
    () => [
      {
        title: "All Pools",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Fee Tier",
        dataIndex: "feeTier",
        key: "feeTier",
      },
      {
        title: "APR",
        dataIndex: "apr",
        key: "apr",
      },
      {
        title: "TVL",
        dataIndex: "tvl",
        key: "tvl",
      },
      {
        title: "Volume 24H",
        dataIndex: "vol",
        key: "vol",
      },
      {
        title: "",
        render: PoolListItemAction,
        dataIndex: null,
        key: "action",
      },
    ],
    []
  );
};

export const Default: React.FC<React.PropsWithChildren> = () => {
  const columns = useColumnConfig();
  return (
    <Card>
      <CardHeader>This is a Table Demo</CardHeader>
      <CardBody>
        <TableView columns={columns} data={data} />
      </CardBody>
    </Card>
  );
};
