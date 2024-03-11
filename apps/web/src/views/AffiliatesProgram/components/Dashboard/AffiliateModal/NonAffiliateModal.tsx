import { useTranslation } from '@pancakeswap/localization'
import { Button, Checkbox, Flex, Link, Modal, ModalV2, Text } from '@pancakeswap/uikit'
import { useAtom } from 'jotai'
import { useCallback, useEffect, useState } from 'react'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'
import useAuthAffiliateExist from 'views/AffiliatesProgram/hooks/useAuthAffiliateExist'
import useUserExist from 'views/AffiliatesProgram/hooks/useUserExist'
import { useAccount } from 'wagmi'

const showNonAffiliateModalAtom = atomWithStorageWithErrorCatch('pcs::showNonAffiliateModalAtom', true)

const NonAffiliateModal = () => {
  const { t } = useTranslation()
  const { address } = useAccount()
  const { isAffiliateExist } = useAuthAffiliateExist()
  const [isOpen, setIsOpen] = useState(false)
  const { isFetching } = useUserExist()
  const [isChecked, setIsChecked] = useState(false)
  const [showModal, setShowModal] = useAtom(showNonAffiliateModalAtom)

  useEffect(() => {
    setIsOpen(Boolean(!isAffiliateExist && !isFetching && address && showModal))
  }, [address, isFetching, isAffiliateExist, showModal])

  const handleCheckbox = useCallback(() => setIsChecked((prevState) => !prevState), [])

  const handleCloseButton = useCallback(() => {
    setIsOpen(false)
    setShowModal(false)
  }, [setShowModal])

  return (
    <ModalV2 isOpen={isOpen} closeOnOverlayClick={false}>
      <Modal title={t('Affiliate Program Update')} maxWidth={['100%', '100%', '100%', '480px']} hideCloseButton>
        <Flex flexDirection="column">
          <Text mb="24px">
            <Text as="span">
              {t(
                'For Affiliate program participants: Our affiliate program’s terms and conditions have been updated as of September 1, 2023, with changes related to sections 2 (a), 2.1 (a and b) and 3. Section 2 (a) includes chains such as Polygon zkEVM, zkSync Era, Arbitrum One, Linea, and Base for Swap Commissions. Section 2.1 (a and b) includes updating the “PancakeSwap token” list and adding MATIC, ARB, DAI in the major token pairs for the swap commission.  Section 3, the discount for perpetuals trading fee is limited to v1 perpetual trades.',
              )}
            </Text>
          </Text>
          <label htmlFor="checkbox" style={{ display: 'block', cursor: 'pointer', marginBottom: '24px' }}>
            <Flex alignItems="center">
              <div style={{ flex: 'none' }}>
                <Checkbox id="checkbox" scale="sm" checked={isChecked} onChange={handleCheckbox} />
              </div>
              <Text fontSize="14px" ml="8px">
                {t('I have read and agree to the updated')}
                <Text display="inline-block" as="span" ml="4px">
                  <Link
                    external
                    href="https://docs.pancakeswap.finance/ecosystem-and-partnerships/affiliate-program/terms-and-conditions"
                  >
                    {t('terms and conditions')}
                  </Link>
                </Text>
              </Text>
            </Flex>
          </label>
          <Button width="100%" disabled={!isChecked} onClick={handleCloseButton}>
            {t('Close')}
          </Button>
        </Flex>
      </Modal>
    </ModalV2>
  )
}

export default NonAffiliateModal
