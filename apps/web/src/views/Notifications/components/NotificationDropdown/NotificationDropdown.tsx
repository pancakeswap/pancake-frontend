import { useIsMounted } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Text, UserMenu, UserMenuDivider, UserMenuItem } from '@pancakeswap/uikit'
import SettingsModal from '../NotificationView/NotificationView'
import styled from 'styled-components'

export const StyledInputCurrencyWrapper = styled(Box)`
  width: 380px;
`

export const NotificationDropdown = () => {


  return (
    <UserMenu
      mr="8px"
      variant="default"
      avatarSrc="https://tokens.pancakeswap.finance/images/symbol/apt.png"
      // avatarClassName={aptosLogoClass({
      //   isProduction: isMounted && chain?.id === ChainId.MAINNET,
      // })}
      // placement="bottom"
      // text={
      //   <>
      //     <Box display={['none', null, null, null, null, 'block']}>
      //       {`Aptos${isMounted && chain?.testnet && chain?.name ? ` ${chain?.name}` : ''}`}
      //     </Box>
      //     <Box display={['block', null, null, null, null, 'none']}>APT</Box>
      //   </>
      // }
    >
      {() => (
             <StyledInputCurrencyWrapper>
             {/* <AppBody> */}
           {/* {account && connector && <SignedInView 
           connector={connector}
            handleSubscribe={handleSubscribe}
            handleUnSubscribe={handleUnSubscribe}
            isSubscribed={isSubscribed}
            isSubscribing ={isSubscribing}
            isUnsubscribing={isUnsubscribing}
            renew={onSignInWithSign}
           account={account} />} */}
           {/* <SubscribedView/> */}
           <SettingsModal/>
             {/* </AppBody> */}
           </StyledInputCurrencyWrapper>
      )}
    </UserMenu>
  )
}
