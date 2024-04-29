import { useTranslation } from '@pancakeswap/localization'
import {
  BarChartIcon,
  Box,
  CopyIcon,
  Flex,
  Link,
  MoreIcon,
  TelegramIcon,
  Text,
  TwitterIcon,
  copyText,
  useToast,
} from '@pancakeswap/uikit'
import { MouseEvent, useRef, useState } from 'react'
import { styled } from 'styled-components'
import { Dropdown } from 'views/DashboardCampaigns/components/Dropdown'

const StyledDropdown = styled(Dropdown)`
  width: 200px;
  left: -120px;
  top: 30px;
`

const Container = styled(Box)`
  position: relative;

  &:before {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    height: 30px;
    width: 100%;
  }
`

export const Share = () => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const openShareIconRef = useRef<HTMLDivElement>(null)
  const [isOpenShareIcon, setIsOpenShareIcon] = useState(false)

  const openMoreIconRef = useRef<HTMLDivElement>(null)
  const [isOpenMoreIcon, setIsOpenMoreIcon] = useState(false)

  const toggleShareIcon = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpenMoreIcon(false)
    setIsOpenShareIcon(!isOpenShareIcon)
  }

  const toggleMoreIcon = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpenShareIcon(false)
    setIsOpenMoreIcon(!isOpenMoreIcon)
  }

  const handleCopyText = () => {
    const link = window?.location?.href
    copyText(link)
    toastSuccess(t('Link'), t('Copied!'))
    setIsOpenShareIcon(false)
  }

  return (
    <Flex position="relative" ml="auto">
      <Container onMouseEnter={() => setIsOpenShareIcon(true)} onMouseLeave={() => setIsOpenShareIcon(false)}>
        <Text color="primary" bold style={{ cursor: 'pointer' }} onClick={(e: MouseEvent) => toggleShareIcon(e)}>
          {t('Share')}
        </Text>
        {isOpenShareIcon && (
          <StyledDropdown setIsOpen={setIsOpenShareIcon} dropdownRef={openShareIconRef}>
            <Flex onClick={handleCopyText}>
              <Flex alignSelf="flex-start">
                <CopyIcon color="primary" width="20px" height="20px" />
              </Flex>
              <Text ml="8px" lineHeight="20px">
                {t('Copy the link')}
              </Text>
            </Flex>
            <Link href={`https://twitter.com/intent/post?text=HelloWorld.&url=${window?.location?.href}`} external>
              <Flex>
                <Flex alignSelf="flex-start">
                  <TwitterIcon color="primary" width="20px" height="20px" />
                </Flex>
                <Text ml="8px" lineHeight="20px">
                  {t('Share on X')}
                </Text>
              </Flex>
            </Link>
            <Link href={`https://telegram.me/share/url?text=HelloWorld.&url=${window?.location?.href}`} external>
              <Flex>
                <Flex alignSelf="flex-start">
                  <TelegramIcon color="primary" width="20px" height="20px" />
                </Flex>
                <Text ml="8px" lineHeight="20px">
                  {t('Share on Telegram')}
                </Text>
              </Flex>
            </Link>
          </StyledDropdown>
        )}
      </Container>

      <Container onMouseEnter={() => setIsOpenMoreIcon(true)} onMouseLeave={() => setIsOpenMoreIcon(false)}>
        <Flex style={{ cursor: 'pointer' }} alignSelf="center" onClick={(e: MouseEvent) => toggleMoreIcon(e)}>
          <MoreIcon ml="6px" color="primary" />
        </Flex>
        {isOpenMoreIcon && (
          <StyledDropdown setIsOpen={setIsOpenMoreIcon} dropdownRef={openMoreIconRef}>
            <Link href="/" external>
              <Flex>
                <Flex alignSelf="flex-start">
                  <BarChartIcon color="primary" width="20px" height="20px" />
                </Flex>
                <Text ml="8px" lineHeight="20px">
                  {t('See the executing smart contract')}
                </Text>
              </Flex>
            </Link>
          </StyledDropdown>
        )}
      </Container>
    </Flex>
  )
}
