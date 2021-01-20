import React from "react";

type CellProps = {
  filters?: string[];
  isHeader?: boolean;
  onClick?: () => void;
};

const Cell: React.FC<CellProps> = ({ isHeader, children, onClick }) => {
  return isHeader ? <th onClick={onClick}>{children}</th> : <td>{children}</td>;
};

Cell.defaultProps = {
  isHeader: false,
}

export default Cell;
