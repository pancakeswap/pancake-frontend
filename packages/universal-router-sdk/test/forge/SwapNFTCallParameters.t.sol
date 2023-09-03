// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Test, stdJson, console2} from "forge-std/Test.sol";
import {ERC20} from "solmate/src/tokens/ERC20.sol";
import {ERC721} from "solmate/src/tokens/ERC721.sol";
import {ERC1155} from "solmate/src/tokens/ERC1155.sol";
import {UniversalRouter} from "universal-router/UniversalRouter.sol";
import {DeployRouter} from "./utils/DeployRouter.sol";
import {MethodParameters, Interop} from "./utils/Interop.sol";
import {ICryptopunksMarket} from "./utils/ICryptopunksMarket.sol";

contract swapNFTCallParametersTest is Test, Interop, DeployRouter {
    using stdJson for string;

    ERC20 private constant GALA = ERC20(0x15D4c048F83bd7e37d49eA4C83a07267Ec4203dA);
    // calldata for router.execute with command APPROVE_ERC20, approving Opensea Conduit to spend GALA
    bytes constant APPROVE_GALA_DATA =
        hex"24856bc3000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000001220000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004000000000000000000000000015D4c048F83bd7e37d49eA4C83a07267Ec4203dA0000000000000000000000000000000000000000000000000000000000000000";

    function setUp() public {
        fromPrivateKey = 0x1234;
        from = vm.addr(fromPrivateKey);
        string memory root = vm.projectRoot();
        json = vm.readFile(string.concat(root, "/test/forge/interop.json"));
    }

    function testFoundationBuyItem() public {
        MethodParameters memory params = readFixture(json, "._FOUNDATION_BUY_ITEM");

        vm.createSelectFork(vm.envString("FORK_URL"), 15725945);
        vm.startPrank(from);

        deployRouterAndPermit2();
        ERC721 token = ERC721(0xEf96021Af16BD04918b0d87cE045d7984ad6c38c);
        uint256 balance = 1 ether;
        vm.deal(from, balance);
        assertEq(from.balance, balance);
        assertEq(token.balanceOf(RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertEq(token.balanceOf(RECIPIENT), 1);
        assertEq(from.balance, balance - params.value);
    }

    function testNftxBuyItems() public {
        MethodParameters memory params = readFixture(json, "._NFTX_BUY_ITEMS");

        vm.createSelectFork(vm.envString("FORK_URL"), 17029001);
        vm.startPrank(from);

        deployRouterAndPermit2();
        ERC721 token = ERC721(0x5Af0D9827E0c53E4799BB226655A1de152A425a5);
        uint256 balance = 32 ether;
        vm.deal(from, balance);
        assertEq(from.balance, balance);
        assertEq(token.balanceOf(RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertEq(token.balanceOf(RECIPIENT), 1);
        assertEq(from.balance, balance - params.value);
    }

    function testElementBuyItemsERC721() public {
        address taker = 0x75B6568025f463a98fB01082eEb6dCe04efA3Ae4;
        MethodParameters memory params = readFixture(json, "._ELEMENT_BUY_ITEM_721");

        vm.createSelectFork(vm.envString("FORK_URL"), 16627213);
        vm.startPrank(from);

        deployRouterAndPermit2();

        ERC721 token = ERC721(0x4C69dBc3a2Aa3476c3F7a1227ab70950DB1F4858);
        uint256 balance = 32 ether;
        vm.deal(from, balance);
        assertEq(from.balance, balance);
        assertEq(token.balanceOf(taker), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);

        require(success, "call failed");
        assertEq(token.balanceOf(taker), 1);
        assertEq(from.balance, balance - params.value);
    }

    function testElementBuyitmesERC712WithFees() public {
        MethodParameters memory params = readFixture(json, "._ELEMENT_BUY_ITEM_721_WITH_FEES");

        vm.createSelectFork(vm.envString("FORK_URL"), 16870205);
        vm.startPrank(from);

        deployRouterAndPermit2();
        ERC721 token = ERC721(0x4C69dBc3a2Aa3476c3F7a1227ab70950DB1F4858);
        uint256 balance = 32 ether;
        vm.deal(from, balance);
        assertEq(from.balance, balance);
        assertEq(token.balanceOf(RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);

        require(success, "call failed");
        assertEq(token.balanceOf(RECIPIENT), 1);
        assertEq(from.balance, balance - params.value);
    }

    function testLooksRareV2BuyItemsERC721() public {
        MethodParameters memory params = readFixture(json, "._LOOKSRARE_V2_BUY_ITEM_721");

        vm.createSelectFork(vm.envString("FORK_URL"), 17030829);
        vm.startPrank(from);

        deployRouterAndPermit2();

        ERC721 token = ERC721(0xAA107cCFe230a29C345Fd97bc6eb9Bd2fccD0750);
        uint256 balance = 32 ether;
        vm.deal(from, balance);
        assertEq(from.balance, balance);
        assertEq(token.balanceOf(RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);

        require(success, "call failed");
        assertEq(token.balanceOf(RECIPIENT), 1);
        assertEq(from.balance, balance - params.value);
    }

    function testLooksRareV2BatchBuyItemsERC721() public {
        MethodParameters memory params = readFixture(json, "._LOOKSRARE_V2_BATCH_BUY_ITEM_721");

        vm.createSelectFork(vm.envString("FORK_URL"), 17037139);
        vm.startPrank(from);

        deployRouterAndPermit2();

        ERC721 token = ERC721(0xAA107cCFe230a29C345Fd97bc6eb9Bd2fccD0750);
        uint256 balance = 32 ether;
        vm.deal(from, balance);
        assertEq(from.balance, balance);
        assertEq(token.balanceOf(RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);

        require(success, "call failed");
        assertEq(token.balanceOf(RECIPIENT), 2);
        assertEq(from.balance, balance - params.value);
    }

    function testSeaportV1_5BuyItemsETH() public {
        MethodParameters memory params = readFixture(json, "._SEAPORT_V1_5_BUY_ITEMS_ETH");
        uint256 tokenId0 = 564868729088757849349201848336735231016960;
        uint256 tokenId1 = 580862000334041957131980454886028336955392;

        vm.createSelectFork(vm.envString("FORK_URL"), 17179617);
        vm.startPrank(from);

        deployRouterAndPermit2();
        ERC1155 token = ERC1155(0xc36cF0cFcb5d905B8B513860dB0CFE63F6Cf9F5c);
        uint256 balance = 55 ether;
        vm.deal(from, balance);
        assertEq(from.balance, balance);
        assertEq(token.balanceOf(RECIPIENT, tokenId0), 0);
        assertEq(token.balanceOf(RECIPIENT, tokenId1), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertEq(token.balanceOf(RECIPIENT, tokenId0), 1);
        assertEq(token.balanceOf(RECIPIENT, tokenId1), 1);
        assertEq(from.balance, balance - params.value);
    }

    function testSeaportBuyItemsERC20PermitApprove() public {
        MethodParameters memory params = readFixture(json, "._SEAPORT_V1_4_BUY_ITEMS_ERC20_PERMIT_AND_APPROVE");
        assertEq(params.value, 0);
        uint256 tokenId = 425352958651173079329218259289710264320000;

        vm.createSelectFork(vm.envString("FORK_URL"), 16784347);
        vm.startPrank(from);

        deployRouterAndPermit2();

        vm.deal(from, 1 ether); // for gas
        assertEq(from.balance, 1 ether);

        uint256 balance = 55 ether;
        deal(address(GALA), from, balance);
        GALA.approve(address(permit2), balance);
        assertEq(GALA.balanceOf(from), balance);

        ERC1155 token = ERC1155(0xc36cF0cFcb5d905B8B513860dB0CFE63F6Cf9F5c);
        assertEq(token.balanceOf(RECIPIENT, tokenId), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLt(GALA.balanceOf(from), balance);
        assertEq(GALA.balanceOf(address(router)), 0);
        assertEq(token.balanceOf(RECIPIENT, tokenId), 1);
    }

    function testSeaportBuyItemsERC20Permit() public {
        MethodParameters memory params = readFixture(json, "._SEAPORT_V1_4_BUY_ITEMS_ERC20_PERMIT_NO_APPROVE");
        assertEq(params.value, 0);
        uint256 tokenId = 425352958651173079329218259289710264320000;

        vm.createSelectFork(vm.envString("FORK_URL"), 16784347);
        vm.startPrank(from);

        deployRouterAndPermit2();

        vm.deal(from, 1 ether); // for gas
        assertEq(from.balance, 1 ether);

        uint256 balance = 55 ether;
        deal(address(GALA), from, balance);
        GALA.approve(address(permit2), balance);
        assertEq(GALA.balanceOf(from), balance);

        // a tx to pre-approve GALA for Seaport
        (bool success,) = address(router).call(APPROVE_GALA_DATA);
        require(success, "call failed");

        ERC1155 token = ERC1155(0xc36cF0cFcb5d905B8B513860dB0CFE63F6Cf9F5c);
        assertEq(token.balanceOf(RECIPIENT, tokenId), 0);

        (success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLt(GALA.balanceOf(from), balance);
        assertEq(GALA.balanceOf(address(router)), 0);
        assertEq(token.balanceOf(RECIPIENT, tokenId), 1);
    }

    function testSeaportV1_4BuyItemsETH() public {
        MethodParameters memory params = readFixture(json, "._SEAPORT_V1_4_BUY_ITEMS_ETH");

        vm.createSelectFork(vm.envString("FORK_URL"), 16820453);
        vm.startPrank(from);

        deployRouterAndPermit2();
        ERC1155 token = ERC1155(0x4f3AdeF2F4096740774A955E912B5F03F2C7bA2b);
        uint256 balance = 55 ether;
        vm.deal(from, balance);
        assertEq(from.balance, balance);
        assertEq(token.balanceOf(RECIPIENT, 1), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertEq(token.balanceOf(RECIPIENT, 1), 2);
        // the order is for 3 tokens, but only 2 succeed, so 1/3 of the ETH is returned
        assertEq(from.balance, balance - (params.value * 2 / 3));
    }

    function testCryptopunkBuyItems() public {
        MethodParameters memory params = readFixture(json, "._CRYPTOPUNK_BUY_ITEM");
        // older block 15360000 does not work
        vm.createSelectFork(vm.envString("FORK_URL"), 15898323);
        vm.startPrank(from);

        deployRouterAndPermit2();
        ICryptopunksMarket token = ICryptopunksMarket(0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB);
        uint256 balance = 80 ether;

        vm.deal(from, balance);
        assertEq(from.balance, balance);
        assertEq(token.balanceOf(RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertEq(token.balanceOf(RECIPIENT), 1);

        assertEq(token.punkIndexToAddress(2976), RECIPIENT);
        assertEq(from.balance, balance - params.value);
    }

    function testX2Y2Buy721Item() public {
        MethodParameters memory params = readFixture(json, "._X2Y2_721_BUY_ITEM");

        vm.createSelectFork(vm.envString("FORK_URL"), 15360000);
        vm.startPrank(from);

        deployRouter(address(0));

        ERC721 token = ERC721(0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85);
        uint256 balance = 1 ether;
        vm.deal(from, balance);
        assertEq(from.balance, balance);
        assertEq(token.balanceOf(RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);

        require(success, "call failed");
        assertEq(token.balanceOf(RECIPIENT), 1);
        assertEq(from.balance, balance - params.value);
    }

    function testX2Y2Buy1155Item() public {
        MethodParameters memory params = readFixture(json, "._X2Y2_1155_BUY_ITEM");
        vm.createSelectFork(vm.envString("FORK_URL"), 15978300);
        vm.startPrank(from);

        deployRouter(address(0));

        ERC1155 token = ERC1155(0x93317E87a3a47821803CAADC54Ae418Af80603DA);
        uint256 balance = params.value;
        vm.deal(from, balance);
        assertEq(from.balance, balance);
        assertEq(token.balanceOf(RECIPIENT, 0), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);

        require(success, "call failed");
        assertEq(token.balanceOf(RECIPIENT, 0), 1);
        assertEq(from.balance, balance - params.value);
    }

    function testNFT20BuyItems() public {
        MethodParameters memory params = readFixture(json, "._NFT20_BUY_ITEM");

        vm.createSelectFork(vm.envString("FORK_URL"), 15770228);
        vm.startPrank(from);

        deployRouterAndPermit2();

        ERC721 token = ERC721(0x6d05064fe99e40F1C3464E7310A23FFADed56E20);
        uint256 balance = 20583701229648230;
        vm.deal(from, balance);
        assertEq(from.balance, balance);
        assertEq(token.balanceOf(RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);

        require(success, "call failed");
        assertEq(token.balanceOf(RECIPIENT), 3);
        assertEq(from.balance, balance - params.value);
    }

    function testSudoswapBuyItems() public {
        MethodParameters memory params = readFixture(json, "._SUDOSWAP_BUY_ITEM");

        vm.createSelectFork(vm.envString("FORK_URL"), 15740629);
        vm.startPrank(from);

        deployRouterAndPermit2();

        ERC721 token = ERC721(0xfA9937555Dc20A020A161232de4D2B109C62Aa9c);
        uint256 balance = 73337152777777783;
        vm.deal(from, balance);
        assertEq(from.balance, balance);
        assertEq(token.balanceOf(RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);

        require(success, "call failed");
        assertEq(token.balanceOf(RECIPIENT), 3);
        assertEq(from.balance, balance - params.value);
    }

    function testPartialFillBetweenProtocols() public {
        MethodParameters memory params = readFixture(json, "._PARTIAL_FILL");

        vm.createSelectFork(vm.envString("FORK_URL"), 17030829);
        vm.startPrank(from);

        deployRouterAndPermit2();
        ERC721 LOOKS_RARE_NFT = ERC721(0xAA107cCFe230a29C345Fd97bc6eb9Bd2fccD0750);
        ERC721 SEAPORT_NFT = ERC721(0xcee3C4F9f52cE89e310F19b363a9d4F796B56A68);

        uint256 balance = 54 ether;
        uint256 failedAmount = 200000000000000000;
        vm.deal(from, balance);
        assertEq(from.balance, balance);
        assertEq(LOOKS_RARE_NFT.balanceOf(RECIPIENT), 0);
        assertEq(SEAPORT_NFT.balanceOf(RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertEq(LOOKS_RARE_NFT.balanceOf(RECIPIENT), 0);
        assertEq(SEAPORT_NFT.balanceOf(RECIPIENT), 1);

        assertEq(from.balance, balance - params.value + failedAmount);
    }

    function testPartialFillWithinProtocol() public {
        MethodParameters memory params = readFixture(json, "._PARTIAL_FILL_WITHIN_PROTOCOL");

        vm.createSelectFork(vm.envString("FORK_URL"), 15725945);
        vm.startPrank(from);

        deployRouterAndPermit2();
        ERC721 token = ERC721(0xEf96021Af16BD04918b0d87cE045d7984ad6c38c);
        uint256 balance = 0.02 ether;
        uint256 failedAmount = 0.01 ether;
        vm.deal(from, balance);
        assertEq(from.balance, balance);
        assertEq(token.balanceOf(RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertEq(token.balanceOf(RECIPIENT), 1);
        assertEq(from.balance, balance - params.value + failedAmount);
    }
}
