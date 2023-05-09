import styled from 'styled-components'
import { Flex, Text, LanguageIcon, SvgProps, Svg, TwitterIcon, Link, TelegramIcon, FlexGap } from '@pancakeswap/uikit'
import { Ifo } from 'config/constants/types'
import { getBlockExploreLinkDefault } from 'utils'
import { IFO_ADDRESS } from 'views/Ifos/constants'
import { useActiveChainId } from 'hooks/useNetwork'

const SmartContractIcon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.6587 5.99089C14.7381 5.99085 14.8167 5.97478 14.8898 5.94367C14.9628 5.91255 15.0288 5.86701 15.0839 5.80978L15.9308 4.92731C15.9831 4.87231 16.0459 4.82848 16.1156 4.79849C16.1853 4.76849 16.2603 4.75294 16.3362 4.75279H16.3725C16.4519 4.75257 16.5304 4.76952 16.6027 4.80248C16.6749 4.83545 16.7392 4.88365 16.791 4.94377L17.5062 5.75051C17.574 5.82572 17.6569 5.88594 17.7494 5.92733C17.8419 5.96873 17.942 5.99037 18.0433 5.99089H19.9581C19.0266 4.75162 17.8193 3.7459 16.4316 3.05324C15.044 2.36059 13.5141 2 11.9629 2C10.4117 2 8.88183 2.36059 7.49418 3.05324C6.10654 3.7459 4.89922 4.75162 3.9677 5.99089H14.6587ZM15.6703 8.68792H17.4334H17.4466H21.4014C21.6811 9.48419 21.8572 10.3131 21.9254 11.1542H14.4937C14.392 11.1543 14.2914 11.1326 14.1987 11.0906C14.106 11.0486 14.0235 10.9872 13.9565 10.9106L13.2414 10.1038C13.1879 10.045 13.1228 9.99799 13.0502 9.96568C12.9776 9.93337 12.8991 9.9165 12.8196 9.91613H12.7866C12.711 9.91605 12.6361 9.93116 12.5665 9.96058C12.4969 9.98999 12.4339 10.0331 12.3812 10.0874L11.531 10.9731C11.4766 11.0303 11.4111 11.0758 11.3386 11.1069C11.2661 11.138 11.188 11.1541 11.1091 11.1542H2C2.06972 10.3133 2.24579 9.48461 2.524 8.68792H12.1736C12.3234 8.68764 12.4714 8.6555 12.6078 8.59361C12.7442 8.53172 12.8658 8.44152 12.9646 8.329L13.5776 7.63751C13.6304 7.57841 13.6952 7.53113 13.7676 7.49876C13.84 7.46639 13.9184 7.44966 13.9977 7.44966C14.0771 7.44966 14.1555 7.46639 14.2279 7.49876C14.3003 7.53113 14.3651 7.57841 14.4179 7.63751L15.1331 8.44425C15.2001 8.5207 15.2827 8.58199 15.3754 8.62401C15.468 8.66603 15.5685 8.68781 15.6703 8.68792ZM7.73956 16.2923C7.6671 16.3234 7.58914 16.3397 7.51028 16.3402L2.95572 16.3468C2.57245 15.556 2.29649 14.7178 2.13511 13.8541H8.62091C8.77093 13.8543 8.91929 13.8227 9.0562 13.7614C9.19311 13.7001 9.31545 13.6105 9.41515 13.4985L10.0281 12.807C10.08 12.7469 10.1442 12.6987 10.2165 12.6657C10.2887 12.6327 10.3673 12.6158 10.4467 12.616C10.5265 12.6162 10.6054 12.6333 10.6782 12.6662C10.7509 12.6991 10.8158 12.7471 10.8685 12.807L11.5837 13.6137C11.6508 13.689 11.733 13.7493 11.825 13.7907C11.917 13.8322 12.0167 13.8537 12.1176 13.8541H21.7902C21.6273 14.7157 21.3502 15.5517 20.9663 16.3402H10.8916C10.7899 16.3397 10.6895 16.3177 10.5969 16.2757C10.5044 16.2337 10.4217 16.1726 10.3544 16.0965L9.64255 15.2898C9.5891 15.231 9.524 15.1839 9.45138 15.1516C9.37876 15.1193 9.30021 15.1024 9.22071 15.1021H9.18446C9.10894 15.1026 9.03425 15.1179 8.96469 15.1473C8.89512 15.1767 8.83205 15.2195 8.7791 15.2733L7.93212 16.1591C7.87749 16.2159 7.81202 16.2612 7.73956 16.2923ZM8.18963 18.8098H10.8097L19.2761 18.823C18.3408 19.8254 17.209 20.6248 15.9512 21.1714C14.6934 21.7179 13.3364 22 11.9648 22C10.5931 22 9.23618 21.7179 7.97835 21.1714C6.72051 20.6248 5.58872 19.8254 4.65342 18.823H4.69296C4.84279 18.823 4.99087 18.7909 5.12728 18.729C5.26369 18.6671 5.38529 18.5768 5.48392 18.4641L6.1002 17.7594C6.15336 17.7003 6.2184 17.6529 6.29108 17.6205C6.36376 17.5881 6.44245 17.5714 6.52204 17.5714C6.60163 17.5714 6.68032 17.5881 6.753 17.6205C6.82568 17.6529 6.89072 17.7003 6.94388 17.7594L7.65574 18.5662C7.72214 18.6425 7.80415 18.7038 7.89624 18.7458C7.98834 18.7879 8.08838 18.8097 8.18963 18.8098Z"
      />
    </Svg>
  )
}

const ProposalIcon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M10.037 6a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5h-7.5zM9.287 9.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM10.037 12a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5h-7.5z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.287 4a2 2 0 012-2h13a2 2 0 012 2v15c0 1.66-1.34 3-3 3h-14c-1.66 0-3-1.34-3-3v-2c0-.55.45-1 1-1h2V4zm0 16h11v-2h-12v1c0 .55.45 1 1 1zm14 0c.55 0 1-.45 1-1V4h-13v12h10c.55 0 1 .45 1 1v2c0 .55.45 1 1 1z"
      />
    </Svg>
  )
}

interface Props {
  ifo: Ifo
  status: string
}

const Container = styled(Flex)`
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  text-align: left;
  gap: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    align-items: initial;
  }
`

const AchievementFlex = styled(Flex)<{ isFinished: boolean }>`
  ${({ isFinished }) => (isFinished ? 'filter: grayscale(100%)' : '')};
  text-align: left;
`

const IfoCardFooter: React.FC<React.PropsWithChildren<Props>> = ({ status, ifo }) => {
  const projectUrl = ifo.token.projectLink
  const chainId = useActiveChainId()

  return (
    <Container p="16px" pb="32px">
      <AchievementFlex isFinished={status === 'finished'} alignItems="flex-start" flex={0.5}>
        <Flex flexDirection="column" ml="8px">
          <FlexGap gap="16px" pl="4px">
            <Link external href={projectUrl}>
              <LanguageIcon color="textSubtle" />
            </Link>
            <Link external href={ifo.articleUrl}>
              <ProposalIcon color="textSubtle" />
            </Link>
            <Link external href={getBlockExploreLinkDefault(IFO_ADDRESS, 'token', chainId)}>
              <SmartContractIcon color="textSubtle" />
            </Link>
            {ifo.twitterUrl && (
              <Link external href={ifo.twitterUrl}>
                <TwitterIcon color="textSubtle" />
              </Link>
            )}
            {ifo.telegramUrl && (
              <Link external href={ifo.telegramUrl}>
                <TelegramIcon color="textSubtle" />
              </Link>
            )}
          </FlexGap>
        </Flex>
      </AchievementFlex>
      {ifo.description && (
        <Flex alignItems="flex-end" flexDirection="column" flex={1.5}>
          <Text fontSize="14px" lineHeight={1.2} style={{ whiteSpace: 'pre-line' }}>
            {ifo.description}
          </Text>
        </Flex>
      )}
    </Container>
  )
}

export default IfoCardFooter
