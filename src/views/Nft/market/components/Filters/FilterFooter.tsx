import { Grid, GridProps } from '@pancakeswap/uikit'

const FilterFooter: React.FC<React.PropsWithChildren<GridProps>> = ({ children, ...props }) => (
  <Grid
    gap="16px"
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
