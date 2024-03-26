import { useTranslation } from '@pancakeswap/localization'
import { Svg, SvgProps, Tag, TagProps } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { memo, useMemo } from 'react'
import {} from 'styled-components'

export const RewardPerDay: React.FC<{ rewardPerSec: number; symbol?: string } & TagProps> = memo(
  ({ rewardPerSec, symbol, ...props }) => {
    const { t } = useTranslation()
    const { theme } = useTheme()
    const cakePerDay = useMemo(() => {
      return rewardPerSec * 60 * 60 * 24
    }, [rewardPerSec])
    return (
      <Tag
        startIcon={<CakeOutlineIcon color={theme.colors.secondary} width={props.scale === 'sm' ? 13 : undefined} />}
        variant="secondary"
        {...props}
      >
        {cakePerDay === 0 ? '0.00' : cakePerDay.toFixed(2)} {symbol ?? t('CAKE')}{' '}
      </Tag>
    )
  },
)

const CakeOutlineIcon: React.FC<React.PropsWithChildren<SvgProps>> = memo((props) => {
  return (
    <Svg viewBox="0 0 13 14" fill="none" {...props}>
      <path
        d="M3.782 3.475c0-.312.07-.561.196-.729.121-.16.307-.262.583-.262.189 0 .338.066.461.184.127.123.232.306.314.545.165.479.227 1.137.235 1.836a.32.32 0 00.319.318h.902a.32.32 0 00.319-.318c.008-.7.069-1.357.234-1.836.083-.239.187-.422.314-.545a.636.636 0 01.462-.184c.275 0 .461.101.583.262.126.168.195.417.195.729 0 .24-.08.619-.182 1-.101.376-.22.739-.29.942a.335.335 0 00.195.417c.246.098.73.325 1.15.73.417.402.77.976.77 1.777 0 .849-.361 1.59-1.059 2.124-.7.536-1.752.869-3.139.87h-.007s0 0 0 0C4.95 11.334 3.9 11 3.198 10.465 2.5 9.93 2.14 9.19 2.14 8.34c0-.8.353-1.375.77-1.777.42-.405.904-.632 1.15-.73a.335.335 0 00.194-.417c-.07-.203-.188-.566-.29-.942-.102-.381-.182-.76-.182-1z"
        stroke="#fff"
        strokeWidth={0.3}
        strokeLinejoin="round"
        fill="transparent"
      />
      <path
        d="M6.337 12.185h.007C7.859 12.184 9.11 11.82 10 11.14c.907-.694 1.391-1.685 1.391-2.8 0-1.082-.487-1.865-1.03-2.388a4.354 4.354 0 00-.984-.704c.052-.168.108-.358.16-.552.102-.378.212-.855.212-1.221 0-.42-.09-.874-.367-1.24-.297-.395-.746-.601-1.261-.601-.417 0-.775.156-1.05.422-.26.25-.422.57-.53.88a4.71 4.71 0 00-.2.89 4.708 4.708 0 00-.201-.89c-.107-.31-.27-.63-.529-.88a1.486 1.486 0 00-1.05-.422c-.516 0-.964.206-1.262.6-.276.367-.367.82-.367 1.24 0 .367.11.844.212 1.222.052.194.108.384.16.552a4.354 4.354 0 00-.984.704c-.543.523-1.03 1.306-1.03 2.389 0 1.114.484 2.105 1.391 2.799.891.681 2.143 1.044 3.656 1.045z"
        stroke="#fff"
        strokeWidth={1.4}
        strokeLinejoin="round"
        fill={props.color || '#7645D9'}
      />
    </Svg>
  )
})
