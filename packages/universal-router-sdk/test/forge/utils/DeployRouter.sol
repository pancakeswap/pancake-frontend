// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {console2} from "forge-std/console2.sol";
import {Test} from "forge-std/Test.sol";
import {UniversalRouter} from "universal-router/UniversalRouter.sol";
import {RouterParameters} from "universal-router/base/RouterImmutables.sol";
import {ERC20} from "solmate/src/tokens/ERC20.sol";
import {Permit2} from "permit2/src/Permit2.sol";
import {IAllowanceTransfer} from "permit2/src/interfaces/IAllowanceTransfer.sol";

contract DeployRouter is Test {
    address public constant LOOKS_TOKEN = 0xf4d2888d29D722226FafA5d9B24F9164c092421E;
    address public constant V2_FACTORY = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address public constant V3_FACTORY = 0x1F98431c8aD98523631AE4a59f267346ea31F984;
    bytes32 public constant PAIR_INIT_CODE_HASH = 0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f;
    bytes32 public constant POOL_INIT_CODE_HASH = 0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54;
    address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public constant SEAPORT_V1_5 = 0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC;
    address public constant SEAPORT_V1_4 = 0x00000000000001ad428e4906aE43D8F9852d0dD6;
    address public constant NFTX_ZAP = 0x941A6d105802CCCaa06DE58a13a6F49ebDCD481C;
    address public constant X2Y2 = 0x74312363e45DCaBA76c59ec49a7Aa8A65a67EeD3;
    address public constant FOUNDATION = 0xcDA72070E455bb31C7690a170224Ce43623d0B6f;
    address public constant SUDOSWAP = 0x2B2e8cDA09bBA9660dCA5cB6233787738Ad68329;
    address public constant NFT20_ZAP = 0xA42f6cADa809Bcf417DeefbdD69C5C5A909249C0;
    address public constant CRYPTOPUNKS = 0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB;
    address public constant LOOKS_RARE_V2 = 0x0000000000E655fAe4d56241588680F86E3b2377;
    address public constant ROUTER_REWARDS_DISTRIBUTOR = 0x0000000000000000000000000000000000000000;
    address public constant LOOKSRARE_REWARDS_DISTRIBUTOR = 0x0554f068365eD43dcC98dcd7Fd7A8208a5638C72;
    address public constant OPENSEA_CONDUIT = 0x1E0049783F008A0085193E00003D00cd54003c71;
    address public constant ELEMENT_MARKET = 0x20F780A973856B93f63670377900C1d2a50a77c4;

    address internal constant RECIPIENT = 0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa;
    address internal constant FEE_RECIPIENT = 0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB;
    address internal constant MAINNET_PERMIT2 = 0x000000000022D473030F116dDEE9F6B43aC78BA3;

    address internal constant FORGE_ROUTER_ADDRESS = 0xE808C1cfeebb6cb36B537B82FA7c9EEf31415a05;

    UniversalRouter public router;
    Permit2 public permit2;

    address from;
    uint256 fromPrivateKey;
    string json;

    function deployRouter(address _permit2) public {
        router = new UniversalRouter(
            RouterParameters({
                permit2: _permit2,
                weth9: WETH9,
                seaportV1_5: SEAPORT_V1_5,
                seaportV1_4: SEAPORT_V1_4,
                openseaConduit: OPENSEA_CONDUIT,
                nftxZap: NFTX_ZAP,
                x2y2: X2Y2,
                foundation: FOUNDATION,
                sudoswap: SUDOSWAP,
                elementMarket: ELEMENT_MARKET,
                nft20Zap: NFT20_ZAP,
                cryptopunks: CRYPTOPUNKS,
                looksRareV2: LOOKS_RARE_V2,
                routerRewardsDistributor: ROUTER_REWARDS_DISTRIBUTOR,
                looksRareRewardsDistributor: LOOKSRARE_REWARDS_DISTRIBUTOR,
                looksRareToken: LOOKS_TOKEN,
                v2Factory: V2_FACTORY,
                v3Factory: V3_FACTORY,
                pairInitCodeHash: PAIR_INIT_CODE_HASH,
                poolInitCodeHash: POOL_INIT_CODE_HASH
            })
        );
    }

    function deployRouterAndPermit2() public {
        permit2 = new Permit2();
        deployRouter(address(permit2));
        require(FORGE_ROUTER_ADDRESS == address(router));
    }
}
