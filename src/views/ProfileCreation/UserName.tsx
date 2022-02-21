import { ChangeEvent, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import {
  Card,
  CardBody,
  Heading,
  Text,
  Input as UIKitInput,
  Button,
  AutoRenewIcon,
  CheckmarkIcon,
  Flex,
  WarningIcon,
  useModal,
  Skeleton,
  Checkbox,
} from '@pancakeswap/uikit'
import { parseISO, formatDistance } from 'date-fns'
import { useWeb3React } from '@web3-react/core'
import { formatUnits } from '@ethersproject/units'
import { API_PROFILE } from 'config/constants/endpoints'
import useToast from 'hooks/useToast'
import { useGetCakeBalance } from 'hooks/useTokenBalance'
import { signMessage } from 'utils/web3React'
import fetchWithTimeout from 'utils/fetchWithTimeout'
import useWeb3Provider from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import { FetchStatus } from 'config/constants/types'
import ConfirmProfileCreationModal from './ConfirmProfileCreationModal'
import useProfileCreation from './contexts/hook'
import { USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, REGISTER_COST } from './config'
import useDebounce from '../../hooks/useDebounce'

enum ExistingUserState {
  IDLE = 'idle', // initial state
  CREATED = 'created', // username has already been created
  NEW = 'new', // username has not been created
}

const InputWrap = styled.div`
  position: relative;
  max-width: 240px;
`

const Input = styled(UIKitInput)`
  padding-right: 40px;
`

const Indicator = styled(Flex)`
  align-items: center;
  height: 24px;
  justify-content: center;
  margin-top: -12px;
  position: absolute;
  right: 16px;
  top: 50%;
  width: 24px;
`

const UserName: React.FC = () => {
  const [isAcknowledged, setIsAcknowledged] = useState(false)
  const { teamId, selectedNft, userName, actions, minimumCakeRequired, allowance } = useProfileCreation()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { toastError } = useToast()
  const { library, connector } = useWeb3Provider()
  const [existingUserState, setExistingUserState] = useState<ExistingUserState>(ExistingUserState.IDLE)
  const [isValid, setIsValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const fetchAbortSignal = useRef<AbortController>(null)
  const { balance: cakeBalance, fetchStatus } = useGetCakeBalance()
  const hasMinimumCakeRequired = fetchStatus === FetchStatus.Fetched && cakeBalance.gte(REGISTER_COST)
  const [onPresentConfirmProfileCreation] = useModal(
    <ConfirmProfileCreationModal
      userName={userName}
      selectedNft={selectedNft}
      account={account}
      teamId={teamId}
      minimumCakeRequired={minimumCakeRequired}
      allowance={allowance}
    />,
    false,
  )
  const isUserCreated = existingUserState === ExistingUserState.CREATED

  const [usernameToCheck, setUsernameToCheck] = useState<string>(undefined)
  const debouncedUsernameToCheck = useDebounce(usernameToCheck, 200)

  useEffect(() => {
    const fetchUsernameToCheck = async (abortSignal) => {
      try {
        setIsLoading(true)
        if (!debouncedUsernameToCheck) {
          setIsValid(false)
          setMessage('')
          fetchAbortSignal.current = null
        } else {
          const res = await fetchWithTimeout(`${API_PROFILE}/api/users/valid/${debouncedUsernameToCheck}`, {
            method: 'get',
            signal: abortSignal,
            timeout: 30000,
          })

          fetchAbortSignal.current = null

          if (res.ok) {
            setIsValid(true)
            setMessage('')
          } else {
            const data = await res.json()
            setIsValid(false)
            setMessage(data?.error?.message)
          }
        }
      } catch (e) {
        setIsValid(false)
        if (e instanceof Error && e.name !== 'AbortError') {
          setMessage(t('Error fetching data'))
          console.error(e)
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (fetchAbortSignal.current) {
      fetchAbortSignal.current.abort()
    }

    fetchAbortSignal.current = new AbortController()

    fetchUsernameToCheck(fetchAbortSignal.current.signal)
  }, [debouncedUsernameToCheck, t])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    actions.setUserName(value)
    setUsernameToCheck(value)
  }

  const handleConfirm = async () => {
    try {
      setIsLoading(true)

      const signature = await signMessage(connector, library, account, userName)
      const response = await fetch(`${API_PROFILE}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: account,
          username: userName,
          signature,
        }),
      })

      if (response.ok) {
        setExistingUserState(ExistingUserState.CREATED)
      } else {
        const data = await response.json()
        toastError(t('Error'), data?.error?.message)
      }
    } catch (error) {
      toastError(error instanceof Error && error?.message ? error.message : JSON.stringify(error))
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcknowledge = () => setIsAcknowledged(!isAcknowledged)

  // Perform an initial check to see if the wallet has already created a username
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_PROFILE}/api/users/${account}`)
        const data = await response.json()

        if (response.ok) {
          const dateCreated = formatDistance(parseISO(data.created_at), new Date())
          setMessage(t('Created %dateCreated% ago', { dateCreated }))

          actions.setUserName(data.username)
          setExistingUserState(ExistingUserState.CREATED)
          setIsValid(true)
        } else {
          setExistingUserState(ExistingUserState.NEW)
        }
      } catch (error) {
        toastError(t('Error'), t('Unable to verify username'))
      }
    }

    if (account) {
      fetchUser()
    }
  }, [account, setExistingUserState, setIsValid, setMessage, actions, toastError, t])

  return (
    <>
      <Text fontSize="20px" color="textSubtle" bold>
        {t('Step %num%', { num: 4 })}
      </Text>
      <Heading as="h3" scale="xl" mb="24px">
        {t('Set Your Name')}
      </Heading>
      <Text as="p" mb="24px">
        {t('This name will be shown in team leaderboards and search results as long as your profile is active.')}
      </Text>
      <Card mb="24px">
        <CardBody>
          <Heading as="h4" scale="lg" mb="8px">
            {t('Set Your Name')}
          </Heading>
          <Text as="p" color="textSubtle" mb="24px">
            {t(
              'Your name must be at least 3 and at most 15 standard letters and numbers long. You can’t change this once you click Confirm.',
            )}
          </Text>
          {existingUserState === ExistingUserState.IDLE ? (
            <Skeleton height="40px" width="240px" />
          ) : (
            <InputWrap>
              <Input
                onChange={handleChange}
                isWarning={userName && !isValid}
                isSuccess={userName && isValid}
                minLength={USERNAME_MIN_LENGTH}
                maxLength={USERNAME_MAX_LENGTH}
                disabled={isUserCreated}
                placeholder={t('Enter your name...')}
                value={userName}
              />
              <Indicator>
                {isLoading && <AutoRenewIcon spin />}
                {!isLoading && isValid && userName && <CheckmarkIcon color="success" />}
                {!isLoading && !isValid && userName && <WarningIcon color="failure" />}
              </Indicator>
            </InputWrap>
          )}
          <Text color="textSubtle" fontSize="14px" py="4px" mb="16px" style={{ minHeight: '30px' }}>
            {message}
          </Text>
          <Text as="p" color="failure" mb="8px">
            {t(
              "Only reuse a name from other social media if you're OK with people viewing your wallet. You can't change your name once you click Confirm.",
            )}
          </Text>
          <label htmlFor="checkbox" style={{ display: 'block', cursor: 'pointer', marginBottom: '24px' }}>
            <Flex alignItems="center">
              <div style={{ flex: 'none' }}>
                <Checkbox id="checkbox" scale="sm" checked={isAcknowledged} onChange={handleAcknowledge} />
              </div>
              <Text ml="8px">{t('I understand that people can view my wallet if they know my username')}</Text>
            </Flex>
          </label>
          <Button onClick={handleConfirm} disabled={!isValid || isUserCreated || isLoading || !isAcknowledged}>
            {t('Confirm')}
          </Button>
        </CardBody>
      </Card>
      <Button
        onClick={onPresentConfirmProfileCreation}
        disabled={!isValid || !isUserCreated}
        id="completeProfileCreation"
      >
        {t('Complete Profile')}
      </Button>
      {!hasMinimumCakeRequired && (
        <Text color="failure" mt="16px">
          {t('A minimum of %num% CAKE is required', { num: formatUnits(REGISTER_COST) })}
        </Text>
      )}
    </>
  )
}

export default UserName
