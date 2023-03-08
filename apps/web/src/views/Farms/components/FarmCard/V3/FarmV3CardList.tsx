import { Flex, Text } from '@pancakeswap/uikit'
import SingleFarmV3Card from 'views/Farms/components/FarmCard/V3/SingleFarmV3Card'

interface FarmV3CardListProps {
  title: string
  farm: any
}

const FarmV3CardList: React.FunctionComponent<React.PropsWithChildren<FarmV3CardListProps>> = ({ title, farm }) => {
  return (
    <Flex flexDirection="column" width="100%" mb="24px">
      <Text bold fontSize="12px" color="textSubtle" m="0 0 8px 0">
        {title}
      </Text>
      <Flex flexWrap="wrap" width="100%">
        {[1, 2].map(() => (
          <SingleFarmV3Card farm={farm} />
        ))}
      </Flex>
    </Flex>
  )
}

export default FarmV3CardList
