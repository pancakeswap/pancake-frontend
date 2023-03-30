import PoweredBy from 'components/layerZero/PoweredBy'
import { LinkExternal } from '@pancakeswap/uikit'

const AptosBridgeFooter = ({ isCake }: { isCake?: boolean }) => {
  return (
    <>
      <PoweredBy />
      {isCake ? (
        <LinkExternal m="20px auto" href="https://docs.pancakeswap.finance">
          Need Help?
        </LinkExternal>
      ) : (
        <>
          <LinkExternal m="20px auto" href="https://docs.pancakeswap.finance/get-started-aptos/aptos-faq#cake-bridging">
            Need Help?
          </LinkExternal>
          <LinkExternal m="20px auto" href="https://docs.pancakeswap.finance/get-started-aptos/aptos-coin-guide">
            Don’t see your assets?
          </LinkExternal>
        </>
      )}
    </>
  )
}

export default AptosBridgeFooter
