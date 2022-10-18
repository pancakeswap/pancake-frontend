import { Box, BoxProps, Grid, GridProps, Skeleton } from '@pancakeswap/uikit'
import times from 'lodash/times'

interface GridPlaceholderProps extends GridProps {
  numItems?: number
}

export const GridPlaceholderItem: React.FC<React.PropsWithChildren<BoxProps>> = (props) => (
  <Box {...props}>
    <Skeleton height="258px" mb="8px" />
    <Skeleton width="30%" mb="4px" />
    <Skeleton width="45%" mb="16px" />
    <Skeleton />
  </Box>
)

const GridPlaceholder: React.FC<React.PropsWithChildren<GridPlaceholderProps>> = ({ numItems = 12, ...props }) => (
  <Grid gridGap="16px" gridTemplateColumns={['1fr', null, null, 'repeat(4, 1fr)']} {...props}>
    {times(numItems).map((itemKey) => (
      <GridPlaceholderItem key={itemKey} />
    ))}
  </Grid>
)

export default GridPlaceholder
