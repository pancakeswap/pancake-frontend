import { chainNames } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Button } from '@pancakeswap/uikit'
import NextLink from 'next/link'
import { useMemo } from 'react'
import { addQueryToPath } from 'utils/addQueryToPath'
import { PositionInfo, PositionInfoProps } from '../PositionItem/PositionInfo'

export const V3UnstakeModalContent: React.FC<PositionInfoProps> = (props) => {
  const { chainId, link, outOfRange, isStaked } = props
  const { t } = useTranslation()
  const linkWithChain = useMemo(
    () => (link ? addQueryToPath(link, { chain: chainNames[chainId] }) : link),
    [link, chainId],
  )
  return (
    <>
      <PositionInfo {...props} />
      {linkWithChain ? (
        <Box mt="8px">
          <NextLink href={linkWithChain}>
            {outOfRange && !isStaked ? (
              <Button
                external
                variant="primary"
                width="100%"
                as="a"
                href={linkWithChain}
                style={{ whiteSpace: 'nowrap' }}
              >
                {t('View Position')}
              </Button>
            ) : (
              <Button variant="tertiary" width="100%" as="a">
                {t('Manage Position')}
              </Button>
            )}
          </NextLink>
        </Box>
      ) : null}
    </>
  )
}
