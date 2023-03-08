import { Flex, Text } from '@pancakeswap/uikit'
import SingleFarmV3Table from 'views/Farms/components/FarmTable/V3/Actions/SingleFarmV3Table'

interface FarmV3TableActionProps {
  title: string
  farm: any
}

const FarmV3TableAction: React.FunctionComponent<React.PropsWithChildren<FarmV3TableActionProps>> = ({
  title,
  farm,
}) => {
  return (
    <Flex flexDirection="column" width="100%" mb="24px">
      <Text
        bold
        fontSize="12px"
        color="textSubtle"
        m={['0 0 8px 0', '0 0 8px 0', '0 0 8px 0', '0 0 8px 0', '0 0 8px 0', '0 0 8px 12px']}
      >
        {title}
      </Text>
      <Flex
        flexWrap="wrap"
        width="100%"
        maxHeight={['500px', '500px', '500px', '100%']}
        overflowY={['auto', 'auto', 'auto', 'initial']}
      >
        {[1, 2].map(() => (
          <SingleFarmV3Table farm={farm} />
        ))}
      </Flex>
    </Flex>
  )
}

export default FarmV3TableAction
