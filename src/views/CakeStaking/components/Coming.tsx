import React from 'react'
import styled from 'styled-components'
import useI18n from '../../../hooks/useI18n'
import Card from './Card'
import CardTitle from './CardTitle'
import CardTokenImg from './CardTokenImg'
import CommunityTag from './CommunityTag'

const Balance = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 40px;
  font-weight: 600;
`

const Label = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
  margin-bottom: 16px;
`

const ApplyNowLink = styled.a`
  align-items: center;
  background-color: transparent;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 16px;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  font-size: 16px;
  height: 48px;
  justify-content: center;
  margin: 16px 0;
  text-decoration: none;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryBright};
    color: ${({ theme }) => theme.colors.primaryBright};
  }
`
const DetailPlaceholder = styled.div`
  display: flex;
  font-size: 14px;
`
const Value = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
`

const Footer = styled.div`
  border-top: 1px solid ${({ theme }) => (theme.isDark ? '#524B63' : '#E9EAEB')};
  padding: 24px;
`
const Coming: React.FC = () => {
  const TranslateString = useI18n()

  return (
    <Card>
      <div style={{ padding: '24px' }}>
        <CardTitle>
          {TranslateString(414, 'Your Project?')}{' '}
          <span role="img" aria-label="eyes">
            👀
          </span>
        </CardTitle>
        <CardTokenImg src="/images/bunny-question.svg" alt="Your project here" />
        <Balance>???</Balance>
        <Label>{TranslateString(416, 'Create a pool for your token')}</Label>
        <ApplyNowLink
          href="https://docs.google.com/forms/d/e/1FAIpQLScGdT5rrVMr4WOWr08pvcroSeuIOtEJf1sVdQGVdcAOqryigQ/viewform"
          target="_blank"
        >
          {TranslateString(418, 'Apply Now')}
        </ApplyNowLink>
        <DetailPlaceholder>
          <div style={{ flex: 1 }}>{TranslateString(352, 'APY')}:</div>
          <Value>??</Value>
        </DetailPlaceholder>
        <DetailPlaceholder>
          <div style={{ flex: 1 }}>
            <span role="img" aria-label="syrup">
              🥞{' '}
            </span>
            {TranslateString(384, 'Your Stake')}:
          </div>
          <Value>??? CAKE</Value>
        </DetailPlaceholder>
      </div>
      <Footer>
        <CommunityTag />
      </Footer>
    </Card>
  )
}

export default Coming
