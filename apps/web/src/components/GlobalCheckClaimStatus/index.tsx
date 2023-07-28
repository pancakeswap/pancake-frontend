import { useEffect, useState } from 'react'
import { ChainId } from '@pancakeswap/sdk'
import { ModalV2 } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useShowOnceAirdropModal } from 'hooks/useShowOnceAirdropModal'
import V3AirdropModal, { WhitelistType } from './V3AirdropModal'
import useAirdropModalStatus from './hooks/useAirdropModalStatus'

interface GlobalCheckClaimStatusProps {
  excludeLocations: string[]
}

// change it to true if we have events to check claim status
const enable = true

const GlobalCheckClaimStatus: React.FC<React.PropsWithChildren<GlobalCheckClaimStatusProps>> = (props) => {
  const { account, chainId } = useAccountActiveChain()
  if (!enable || chainId !== ChainId.BSC || !account) {
    return null
  }
  return <GlobalCheckClaim key={account} {...props} />
}

/**
 * This is represented as a component rather than a hook because we need to keep it
 * inside the Router.
 *
 * TODO: Put global checks in redux or make a generic area to house global checks
 */

const GlobalCheckClaim: React.FC<React.PropsWithChildren<GlobalCheckClaimStatusProps>> = ({ excludeLocations }) => {
  const { address: account } = useAccount()
  const { pathname } = useRouter()
  const [show, setShow] = useState(false)
  const { shouldShowModal, v3WhitelistAddress } = useAirdropModalStatus()
  const [showOnceAirdropModal, setShowOnceAirdropModal] = useShowOnceAirdropModal()

  useEffect(() => {
    if (shouldShowModal && !excludeLocations.some((location) => pathname.includes(location)) && showOnceAirdropModal) {
      setShow(true)
    } else {
      setShow(false)
    }
  }, [account, excludeLocations, pathname, setShow, shouldShowModal, showOnceAirdropModal, v3WhitelistAddress])

  const handleCloseModal = () => {
    if (showOnceAirdropModal) {
      setShowOnceAirdropModal(!showOnceAirdropModal)
    }
    setShow(false)
  }

  return (
    <ModalV2 isOpen={show} onDismiss={() => handleCloseModal()} closeOnOverlayClick>
      <V3AirdropModal
        data={account ? (v3WhitelistAddress?.[account.toLowerCase()] as WhitelistType) : (null as WhitelistType)}
        onDismiss={handleCloseModal}
      />
    </ModalV2>
  )
}

export default GlobalCheckClaimStatus
