import styled from 'styled-components'
import { Card, CardBody, Heading, Button } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useTranslation } from 'contexts/Localization'
import { PredictionSupportedSymbol } from 'state/types'
import { useConfig } from 'views/Predictions/context/ConfigProvider'

interface NotificationProps {
  title: string
}

// const BunnyDecoration = styled.div`
//   position: absolute;
//   top: -130px; // line up bunny at the top of the modal
//   left: 0px;
//   text-align: center;
//   width: 100%;
// `

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  height: 100%;
  justify-content: center;
`

const CardWrapper = styled.div`
  position: relative;
  width: 320px;
`

const BunnyDecoration = styled.div`
  position: absolute;
  top: -130px;
  left: 0px;
  text-align: center;
  width: 100%;
  z-index: 5;
`

const BackButtonStyle = styled(Button)`
  position: absolute;
  top: -62px;
  width: 50%;
`

const BackButton = () => {
  const { t } = useTranslation()

  return (
    <BackButtonStyle variant="primary" width="100%">
      {t('Back')}
    </BackButtonStyle>
  )
}

const Notification: React.FC<NotificationProps> = ({ title, children }) => {
  const router = useRouter()
  const { token } = useConfig()

  return (
    <Wrapper>
      <CardWrapper>
        <BackButton />
        <BunnyDecoration
          onClick={() => {
            if (token.symbol === PredictionSupportedSymbol.CAKE) {
              router.query.token = PredictionSupportedSymbol.BNB
            } else if (token.symbol === PredictionSupportedSymbol.BNB) {
              router.query.token = PredictionSupportedSymbol.CAKE
            }

            router.push(router)
          }}
        >
          <img src="/images/decorations/hiccup-bunny.png" alt="bunny decoration" height="121px" width="130px" />
        </BunnyDecoration>
        <Card>
          <CardBody>
            <Heading mb="24px">{title}</Heading>
            {children}
          </CardBody>
        </Card>
      </CardWrapper>
    </Wrapper>
  )
}

export default Notification
