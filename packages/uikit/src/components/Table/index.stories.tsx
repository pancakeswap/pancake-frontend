import React from "react";
import Card from "../Card/Card";
import Table from "./Table";
import { Th, Td } from "./Cell";

export default {
  title: "Components/Table",
  component: Table,
  argTypes: {},
};

export const Default: React.FC = () => {
  return (
    <div style={{ width: "640px" }}>
      <Card>
        <Table>
          <thead>
            <tr>
              <Th textAlign="left">Column 1</Th>
              <Th>Column 2</Th>
              <Th>Column 3</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>Cell 1-1</Td>
              <Td>Cell 1-2</Td>
              <Td>Cell 1-3</Td>
            </tr>
            <tr>
              <Td>Cell 2-1</Td>
              <Td>Cell 2-2</Td>
              <Td>Cell 2-3</Td>
            </tr>
          </tbody>
        </Table>
      </Card>
    </div>
  );
};
