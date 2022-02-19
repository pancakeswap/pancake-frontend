import { memo } from 'react'
import styled from 'styled-components'
import { Text, Flex, Button, ArrowForwardIcon, Heading } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from 'contexts/Localization'
import useSWRImmutable from 'swr/immutable'
import ifoV3Abi from 'config/abi/ifoV3.json'
import ifoV2Abi from 'config/abi/ifoV2.json'
import { multicallv2 } from 'utils/multicall'
import { useCurrentBlock } from 'state/block/hooks'
import { ifosConfig } from 'config/constants'

const StyledSubheading = styled(Heading)`
  background: -webkit-linear-gradient(#ffd800, #eb8c00);
  font-size: 20px;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke: 1px rgba(0, 0, 0, 0.5);
  ${({ theme }) => theme.mediaQueries.xs} {
    font-size: 24px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    -webkit-text-stroke: unset;
  }
  margin-bottom: 8px;
`

const StyledHeading = styled(Heading)`
  color: #ffffff;
  background: -webkit-linear-gradient(#7645d9 0%, #452a7a 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-stroke: 6px transparent;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  text-transform: uppercase;
  margin-bottom: 16px;
`

const Wrapper = styled.div`
  border-radius: 32px;
  width: 100%;
  background-image: linear-gradient(#7645d9, #452a7a);
  max-height: max-content;
  overflow: hidden;
`

const Inner = styled(Flex)`
  position: relative;
  padding: 24px;
  flex-direction: row;
  justify-content: space-between;
  max-height: 220px;
`

const LeftWrapper = styled(Flex)`
  z-index: 1;
  width: 100%;
  flex-direction: column;
  justify-content: center;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 40px;
    padding-bottom: 40px;
  }
`

const RightWrapper = styled.div`
  position: absolute;
  right: -17px;
  opacity: 0.9;
  transform: translate(0, -50%);
  top: 50%;

  & img {
    height: 100%;
    width: 174px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    right: 24px;
    top: 0;
    transform: unset;
    opacity: 1;

    & img {
      height: 130%;
      width: unset;
    }
  }
`

const activeIfo = ifosConfig.find((ifo) => ifo.isActive)

const IFOBanner = () => {
  const { t } = useTranslation()
  const currentBlock = useCurrentBlock()

  const { data: currentIfoBlocks = { startBlock: 0, endBlock: 0 } } = useSWRImmutable(
    activeIfo ? ['ifo', 'currentIfo'] : null,
    async () => {
      const abi = activeIfo.version === 3.1 ? ifoV3Abi : ifoV2Abi
      const [startBlock, endBlock] = await multicallv2(
        abi,
        [
          {
            address: activeIfo.address,
            name: 'startBlock',
          },
          {
            address: activeIfo.address,
            name: 'endBlock',
          },
        ],
        { requireSuccess: false },
      )

      return { startBlock: startBlock ?? 0, endBlock: endBlock ?? 0 }
    },
  )

  const isIfoAlive = !!(activeIfo && currentBlock && currentIfoBlocks && currentIfoBlocks.endBlock > currentBlock)

  return isIfoAlive ? (
    <Wrapper>
      <Inner>
        <LeftWrapper>
          <StyledSubheading>{currentIfoBlocks.startBlock < currentBlock ? t('Live') : t('Soon')}</StyledSubheading>
          <StyledHeading scale="xl">{activeIfo.id} IFO</StyledHeading>
          <NextLinkFromReactRouter to="/ifo">
            <Button>
              <Text color="invertedContrast" bold fontSize="16px" mr="4px">
                {t('Go to IFO')}
              </Text>
              <ArrowForwardIcon color="invertedContrast" />
            </Button>
          </NextLinkFromReactRouter>
        </LeftWrapper>
        <RightWrapper>
          <img
            src={`/images/decorations/3d-ifo-${activeIfo.id}.png`}
            alt={`IFO ${activeIfo.id}`}
            onError={(event) => {
              // @ts-ignore
              // eslint-disable-next-line no-param-reassign
              event.target.style.display = 'none'
            }}
          />
        </RightWrapper>
      </Inner>
    </Wrapper>
  ) : null
}

export default memo(IFOBanner)
