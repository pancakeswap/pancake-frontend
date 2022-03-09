import React, { useEffect } from 'react'
import styled from 'styled-components'
import { ScrollView } from '@binance/mp-components'
import mpService from '@binance/mp-service'
import {
  useModal,
  Button,
  Modal,
  Box,
  Flex,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  Heading,
  Text,
} from '@pancakeswap/uikit'

const TextWrap = styled.div`
  .ba {
    font-size: 14px;
    margin-bottom: 4px;
  }
`
function DisclaimerModal(props) {
  console.log('🚀 ~ file: useDisclaimer.bmp.tsx ~ line 19 ~ DisclaimerModal ~ props', props)
  return (
    <Modal style={{ width: '80vw' }} hideCloseButton title="PancakeSwap Mini-Program User Service Agreement">
      <ScrollView scrollY style={{ maxHeight: '50vh' }}>
        <TextWrap>
          <Text>
            You should always carefully consider whether PancakeSwap Mini-Program and its decentralized exchange
            services offered are consistent with your risk tolerance, investment objectives, investment experience or
            sophistication, financial condition, financial needs, personal circumstances, and other considerations that
            may be relevant to you.
          </Text>
          <Text>
            1. Trading in a decentralized exchange like PancakeSwap is highly risky as all tokens can be freely listed
            on PancakeSwap. Anyone can create a BEP20 token on BNB Smart Chain with any name, including creating fake
            versions of existing tokens and tokens that claim to represent projects that do not have a token. If you
            purchase an arbitrary token, you may be unable to sell it back. As a decentralized exchange trader, you
            acknowledge and agree that you shall access and use the decentralized exchange trading service at your own
            risks;
          </Text>
          <Text>
            2. You should fully understand the risks associated with decentralized exchange trading and be solely
            responsible and liable for any and all trading and non-trading activity on your Binance account, Binance
            DeFi Wallet and in PancakeSwap. Do not enter into a transaction or invest in funds that are above your
            financial abilities;
          </Text>
          <Text>
            3. You are solely responsible and liable for knowing the true status of any holdings in your Binance DeFi
            Wallet, even if presented incorrectly by Binance or PancakeSwap at any time;
          </Text>
          <Text>
            4. You agree to maintain in your Binance DeFi Wallet a sufficient amount of blockchain assets in BNB
            required by BNB Smart Chain blockchain network as gas fees for users to engage in decentralized trading.
            Failure to maintain a sufficient amount of BNB can result in failure of executing any transactions or
            transfers from the Binance DeFi Wallet;
          </Text>
          <Text>
            5. You agree to trade in good faith. No person shall trade with intent to disrupt, or with reckless
            disregard for the adverse impact on, the orderly conduct of trading or the fair execution of transactions.
            Binance reserves the right to prohibit and prosecute any disruptive and manipulative trading practices that
            Binance finds to be abusive to the orderly conduct of trading or the fair execution of transactions. If
            Binance suspects any such accounts to be in violation of this term, Binance shall have the right to
            immediately suspend your Binance Account (and any accounts beneficially owned by related entities or
            affiliates), freeze or lock the Digital Assets or funds in all such accounts, and suspend your access to
            Binance. Binance may, in its sole discretion, perform measures to mitigate potential losses to you on your
            behalf, including, but not limited to, suspending you from trading, transferring balances from your exchange
            account to your Binance DeFi Wallet without any prior notification.
          </Text>
          <Text>
            6. During Binance system maintenance and any system maintenance of PancakeSwap or its smart contracts, you
            agree that you are solely responsible and liable for managing your Binance DeFi Wallet connected to
            PancakeSwap under risks, including but not limited to, keep or sell your assets.
          </Text>
          <Text>
            7. You agree that you conduct all decentralized exchange trading in PancakeSwap Mini-Program on your own
            account and Binance DeFi Wallet, and claim full responsibility for your activities. Binance and PancakeSwap
            do not take any responsibility for any loss or damage incurred as a result of your use of any services or
            your failure to understand the risks involved associated with assets use generally or your use of the
            services.
          </Text>
          <Text>
            8. You agree that all operations conducted on Binance.com, in Binance DeFi Wallet, or in the PancakeSwap
            Mini-Program represent your true investment intentions and that unconditionally accept the potential risks
            and benefits of your investment decisions.
          </Text>
          <Text>
            9. Binance.com reserves the right to suspend or terminate the PancakeSwap Mini-Program service. If
            necessary, Binance.com can suspend and terminate PancakeSwap Mini-Program service at any time.
          </Text>
          <Text>
            10. Due to network delay, computer system failures and other force majeure, which may lead to delay,
            suspension or deviation of PancakeSwap decentralized trading service execution, Binance.com and PancakeSwap
            will use commercially reasonable effort to ensure but not promise that Binance DeFi Wallet and PancakeSwap
            decentralized trading execution system run stably and effectively. Binance.com and PancakeSwap do not take
            any responsibility if the final execution doesn’t match your expectations due to the above factors.
          </Text>
          <Text>
            11. Binance.com reserves the right to delist the PancakeSwap Mini-Program, i.e. removal of the Mini-Program
            from its mobile application, or Mini-Program Marketplace, at any time. PancakeSwap reserves the right to
            include and exclude any asset from its token lists anytime.
          </Text>
          <Text>
            12. I have read and agreed to the PancakeSwap Mini-Program User Service Agreement and have agreed to use
            PancakeSwap Mini-Program service. I am aware of these risks and confirm to use this service.
          </Text>
        </TextWrap>
      </ScrollView>
      <Flex paddingTop="16px" justifyContent={'center'}>
        <Button
          onClick={() => {
            if (props.onClick) props.onClick()
            props.onDismiss()
          }}
        >
          I understand
        </Button>
      </Flex>
    </Modal>
  )
}
const MemoModal = React.memo(DisclaimerModal)
const key = 'isShowDisclaimerBefore'
const isShowDisclaimerBefore = mpService.getStorageSync(key) || false
const useDisclaimer = () => {
  const handleModalClick = () => {
    mpService.setStorage({ key, data: true })
  }
  const [handleClick] = useModal(<MemoModal onClick={handleModalClick} />, false)
  useEffect(() => {
    if (!isShowDisclaimerBefore) {
      handleClick()
    }
  }, [])
}

export { useDisclaimer }
