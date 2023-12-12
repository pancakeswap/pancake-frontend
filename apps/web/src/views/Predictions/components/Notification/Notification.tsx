import { useTranslation } from '@pancakeswap/localization'
import { PredictionSupportedSymbol } from '@pancakeswap/prediction'
import { ArrowBackIcon, Card, CardBody, Heading, IconButton } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { styled } from 'styled-components'
import { useConfig } from 'views/Predictions/context/ConfigProvider'

interface NotificationProps {
  title: string
}

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  height: 100%;
  justify-content: center;
`

const CardWrapper = styled.div`
  width: 320px;
`

const BunnyDecoration = styled.div`
  position: relative;
  top: 12px;
  text-align: center;
  width: 100%;
  z-index: 5;
  cursor: pointer;
`

const BackButtonStyle = styled(IconButton)`
  position: relative;
  top: 120px;
  width: 40%;
`

const BackButton = () => {
  const { t } = useTranslation()

  return (
    <BackButtonStyle variant="primary" width="100%">
      <ArrowBackIcon color="white" mr="8px" />
      {t('Back')}
    </BackButtonStyle>
  )
}

const Notification: React.FC<React.PropsWithChildren<NotificationProps>> = ({ title, children }) => {
  const router = useRouter()
  const config = useConfig()

  return (
    <Wrapper>
      <CardWrapper>
        <BackButton />
        <BunnyDecoration
          onClick={() => {
            if (config?.token?.symbol === PredictionSupportedSymbol.CAKE) {
              router.query.token = PredictionSupportedSymbol.BNB
            } else if (config?.token?.symbol === PredictionSupportedSymbol.BNB) {
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
