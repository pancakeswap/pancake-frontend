import React from 'react'
import styled from 'styled-components'
import { Text, Heading, Link, Image } from 'greenteaswap-ui-kit'
import useI18n from 'hooks/useI18n'

const LayoutWrapper = styled.div`
  max-width: 500px;
  margin: 0 auto 40px;
  display: flex;
  flex-direction: column;
`

const StyledHeading = styled(Heading)`
  margin: 16px 0;
`

const StyledImage = styled(Image)`
  align-self: center;
`

const StyledLink = styled(Link)`
  align-self: center;
  margin-top: 16px;
`

const HowItWorks = () => {
  const TranslateString = useI18n()

  return (
    <LayoutWrapper>
      <StyledImage src="/images/greentea-lottery-coins-over-cat.png" alt="lottery bunny" width={158} height={170} />
      <StyledHeading size="lg" as="h3" color="secondary">
        {TranslateString(632, 'Lottery ทำงานอย่างไร')}
      </StyledHeading>
      <Text fontSize="16px">
        {TranslateString(
          999,
          'ซื้อ Ticket ด้วย เหรียญ TEA, 1 Ticket มูลค่าเท่ากับ 1 TEA หรือประมาณ 1 USD, ใน Ticket จะประกอบด้วยตัวเลข 4 ตัว ถูก Random โดย SmartContract Code ถ้าเลข 4 ตัวใน Ticket ตำแหน่งเลข 4, 3 หรือ 2 หลัก ตรงตามเลขรางวัลที่ชนะรับเงินรางวัลตามสัดส่วนที่ชนะ ประกาศผลทุก 6 ชั่วโมง ขอให้คุณโชคดี  ^_^',
        )}
      </Text>
      <StyledLink href="https://docs.pancakeswap.finance/lottery-1">Read more</StyledLink>
    </LayoutWrapper>
  )
}

export default HowItWorks
