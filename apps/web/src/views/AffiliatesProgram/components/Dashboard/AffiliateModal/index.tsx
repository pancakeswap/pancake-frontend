import { useTranslation } from '@pancakeswap/localization'
import { Button, Checkbox, Flex, Link, Modal, ModalV2, Text } from '@pancakeswap/uikit'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'
import useAuthAffiliateExist from 'views/AffiliatesProgram/hooks/useAuthAffiliateExist'
import useUserExist from 'views/AffiliatesProgram/hooks/useUserExist'
import { useAccount } from 'wagmi'

const showAffiliateModalAtom = atomWithStorageWithErrorCatch('pcs::showAffiliateModalAtom', true)

const AffiliateModal = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { address } = useAccount()
  const { isAffiliateExist } = useAuthAffiliateExist()
  const { isUserExist, isFetching } = useUserExist()
  const [isOpen, setIsOpen] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [showModal, setShowModal] = useAtom(showAffiliateModalAtom)

  useEffect(() => {
    const { ref, user, discount, perps } = router.query
    // Close when switch address
    setIsOpen(
      Boolean(
        (isAffiliateExist || isUserExist) &&
          !isFetching &&
          address &&
          showModal &&
          !ref &&
          !user &&
          !discount &&
          !perps,
      ),
    )
  }, [address, isAffiliateExist, isUserExist, isFetching, showModal, router])

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
                'Our affiliate program’s terms and conditions have been updated as of May 3rd, 2023, with changes relating to',
              )}
            </Text>
            <Text as="span" bold m="0 4px">
              {t('section 2.1 (c) on slippage during trades.')}
            </Text>
            <Text as="span">{t('Please review the updates to ensure you agree with the revised terms.')}</Text>
          </Text>
          <label htmlFor="checkbox" style={{ display: 'block', cursor: 'pointer', marginBottom: '24px' }}>
            <Flex alignItems="center">
              <div style={{ flex: 'none' }}>
                <Checkbox id="checkbox" scale="sm" checked={isChecked} onChange={handleCheckbox} />
              </div>
              <Text fontSize="14px" ml="8px">
                {t('I have read and agree to the updated')}
                <Text display="inline-block" as="span" ml="4px">
                  <Link external href="https://docs.pancakeswap.finance/affiliate-program/terms-and-conditions">
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

export default AffiliateModal
