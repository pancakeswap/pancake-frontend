import React from 'react'
import { Grid, GridProps } from '@tovaswapui/uikit'

const FilterFooter: React.FC<GridProps> = ({ children, ...props }) => (
  <Grid
    gridGap="16px"
    gridTemplateColumns="repeat(2,1fr)"
    {...props}
    px="24px"
    py="16px"
    borderTop="1px solid"
    borderTopColor="cardBorder"
  >
    {children}
  </Grid>
)

export default FilterFooter
