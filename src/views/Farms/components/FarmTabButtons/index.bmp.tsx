import React from 'react'
import styled from 'styled-components'
import { ButtonMenu, ButtonMenuItem, NotificationDot } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useFarms, FarmsPage } from 'views/BmpHome/context/farmsContext.bmp'
// import { useRouter } from 'next/router'
// import { NextLinkFromReactRouter } from 'components/NextLink'

interface FarmTabButtonsProps {
  hasStakeInFinishedFarms: boolean
}

const FarmTabButtons: React.FC<FarmTabButtonsProps> = ({ hasStakeInFinishedFarms }) => {
  // const router = useRouter()
  const { t } = useTranslation()
  const {
    dispatch,
    state: { page },
  } = useFarms()
  let activeIndex
  switch (page) {
    case FarmsPage.Farms:
      activeIndex = 0
      break
    case FarmsPage.History:
      activeIndex = 1
      break
    // case '/farms/archived':
    //   activeIndex = 2
    //   break
    default:
      activeIndex = 0
      break
  }

  return (
    <Wrapper>
      <ButtonMenu activeIndex={activeIndex} scale="sm" variant="subtle">
        <ButtonMenuItem
          onClick={() => {
            dispatch({ type: 'setPage', page: FarmsPage.Farms })
          }}
          to="/farms"
        >
          {t('Live')}
        </ButtonMenuItem>
        <NotificationDot show={hasStakeInFinishedFarms}>
          <ButtonMenuItem
            onClick={() => {
              dispatch({ type: 'setPage', page: FarmsPage.History })
            }}
            to="/farms/history"
            id="finished-farms-button"
          >
            {t('Finished')}
          </ButtonMenuItem>
        </NotificationDot>
      </ButtonMenu>
    </Wrapper>
  )
}

export default FarmTabButtons

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  /* FIXME */
  a {
    padding-left: 12px;
    padding-right: 12px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 16px;
  }
`
