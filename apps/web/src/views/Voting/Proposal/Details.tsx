import { useTranslation } from '@pancakeswap/localization'
import { Box, Card, CardBody, CardHeader, Flex, Heading, LinkExternal, ScanLink, Text } from '@pancakeswap/uikit'
import truncateHash from '@pancakeswap/utils/truncateHash'
import dayjs from 'dayjs'
import { Proposal, ProposalTypeName } from 'state/types'
import { getBlockExploreLink } from 'utils'
import { IPFS_GATEWAY } from '../config'

interface DetailsProps {
  proposal: Proposal
}

const Details: React.FC<React.PropsWithChildren<DetailsProps>> = ({ proposal }) => {
  const { t } = useTranslation()
  const startDate = new Date(proposal.start * 1000)
  const endDate = new Date(proposal.end * 1000)

  return (
    <Card mb="16px">
      <CardHeader style={{ background: 'transparent' }}>
        <Heading as="h3" scale="md">
          {t('Details')}
        </Heading>
      </CardHeader>
      <CardBody>
        <Flex alignItems="center" mb="8px">
          <Text color="textSubtle" mr="auto">
            {t('Creator')}
          </Text>
          <ScanLink useBscCoinFallback href={getBlockExploreLink(proposal.author, 'address')} ml="8px">
            {truncateHash(proposal.author)}
          </ScanLink>
        </Flex>
        <Flex mb="24px">
          <Text color="textSubtle" mr="auto">
            {t('Voting system')}
          </Text>
          <Text ml="8px">{proposal.type === ProposalTypeName.SINGLE_CHOICE ? t('Binary') : t('Weighted')}</Text>
        </Flex>
        <Flex alignItems="center" mb="8px">
          <Text color="textSubtle" mr="auto">
            {t('Identifier')}
          </Text>
          <LinkExternal href={`${IPFS_GATEWAY}/${proposal.ipfs}`} ml="8px">
            {proposal.ipfs.slice(0, 8)}
          </LinkExternal>
        </Flex>
        <Flex alignItems="center" mb="24px">
          <Text color="textSubtle" mr="auto">
            {t('Snapshot')}
          </Text>
          <ScanLink useBscCoinFallback href={getBlockExploreLink(proposal.snapshot, 'block')} ml="8px">
            {proposal.snapshot}
          </ScanLink>
        </Flex>
        <Box>
          <Flex>
            <Text color="textSubtle" mr="auto">
              {t('Start Date')}
            </Text>
            <Text ml="8px">{dayjs(startDate).format('YYYY-MM-DD HH:mm')}</Text>
          </Flex>
          <Flex>
            <Text color="textSubtle" mr="auto">
              {t('End Date')}
            </Text>
            <Text ml="8px">{dayjs(endDate).format('YYYY-MM-DD HH:mm')}</Text>
          </Flex>
        </Box>
      </CardBody>
    </Card>
  )
}

export default Details
