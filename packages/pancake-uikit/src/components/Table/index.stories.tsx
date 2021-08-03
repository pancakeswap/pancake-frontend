import React from "react";
import Card from "../Card/Card";
import Table from "./Table";

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
              <th>Column 1</th>
              <th>Column 2</th>
              <th>Column 3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Cell 1-1</td>
              <td>Cell 1-2</td>
              <td>Cell 1-3</td>
            </tr>
            <tr>
              <td>Cell 2-1</td>
              <td>Cell 2-2</td>
              <td>Cell 2-3</td>
            </tr>
          </tbody>
        </Table>
      </Card>
    </div>
  );
};
