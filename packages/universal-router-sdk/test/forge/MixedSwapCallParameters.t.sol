// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Test, stdJson} from "forge-std/Test.sol";
import {ERC20} from "solmate/src/tokens/ERC20.sol";
import {ERC721} from "solmate/src/tokens/ERC721.sol";
import {UniversalRouter} from "universal-router/UniversalRouter.sol";
import {Permit2} from "permit2/src/Permit2.sol";
import {DeployRouter} from "./utils/DeployRouter.sol";
import {MethodParameters, Interop} from "./utils/Interop.sol";

contract MixedSwapCallParameters is Test, Interop, DeployRouter {
    using stdJson for string;

    ERC20 private constant WETH = ERC20(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);
    ERC20 private constant USDC = ERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
    ERC20 private constant DAI = ERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);
    // starting eth balance
    uint256 constant BALANCE = 50_000 ether;

    ERC721 constant LOOKS_RARE_NFT = ERC721(0xAA107cCFe230a29C345Fd97bc6eb9Bd2fccD0750);
    ERC721 constant SEAPORT_NFT = ERC721(0xcee3C4F9f52cE89e310F19b363a9d4F796B56A68);

    function setUp() public {
        fromPrivateKey = 0x1234;
        from = vm.addr(fromPrivateKey);
        string memory root = vm.projectRoot();
        json = vm.readFile(string.concat(root, "/test/forge/interop.json"));
    }

    function testMixedERC20ForLooksRareNFT() public {
        MethodParameters memory params = readFixture(json, "._ERC20_FOR_1_LOOKSRARE_NFT");

        vm.createSelectFork(vm.envString("FORK_URL"), 17030829);
        vm.startPrank(from);

        deployRouterAndPermit2();
        vm.deal(from, BALANCE);

        deal(address(USDC), from, BALANCE);
        USDC.approve(address(permit2), BALANCE);
        permit2.approve(address(USDC), address(router), uint160(BALANCE), uint48(block.timestamp + 1000));
        assertEq(USDC.balanceOf(from), BALANCE);

        uint256 balanceOfBefore = USDC.balanceOf(from);
        assertEq(LOOKS_RARE_NFT.balanceOf(RECIPIENT), 0);
        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLt(USDC.balanceOf(from), balanceOfBefore);
        assertEq(LOOKS_RARE_NFT.balanceOf(RECIPIENT), 1);
    }

    function testMixedWETHForLooksRareNFTWithPermit() public {
        MethodParameters memory params = readFixture(json, "._PERMIT_AND_WETH_FOR_1_LOOKSRARE_NFT");

        vm.createSelectFork(vm.envString("FORK_URL"), 17030829);
        vm.startPrank(from);

        deployRouterAndPermit2();

        vm.deal(from, BALANCE);

        deal(address(WETH), from, BALANCE);
        WETH.approve(address(permit2), BALANCE);
        assertEq(WETH.balanceOf(from), BALANCE);

        uint256 balanceOfBefore = WETH.balanceOf(from);
        assertEq(LOOKS_RARE_NFT.balanceOf(RECIPIENT), 0);
        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLt(WETH.balanceOf(from), balanceOfBefore);
        assertEq(LOOKS_RARE_NFT.balanceOf(RECIPIENT), 1);
    }

    function testMixedWETHForLooksRareNFT() public {
        MethodParameters memory params = readFixture(json, "._WETH_FOR_1_LOOKSRARE_NFT");

        vm.createSelectFork(vm.envString("FORK_URL"), 17030829);
        vm.startPrank(from);

        deployRouterAndPermit2();

        vm.deal(from, BALANCE);

        deal(address(WETH), from, BALANCE);
        WETH.approve(address(permit2), BALANCE);
        permit2.approve(address(WETH), address(router), uint160(BALANCE), uint48(block.timestamp + 1000));
        assertEq(WETH.balanceOf(from), BALANCE);

        uint256 balanceOfBefore = WETH.balanceOf(from);
        assertEq(LOOKS_RARE_NFT.balanceOf(RECIPIENT), 0);
        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLt(WETH.balanceOf(from), balanceOfBefore);
        assertEq(LOOKS_RARE_NFT.balanceOf(RECIPIENT), 1);
    }

    function testMixedERC20AndETHForLooksRareNFT() public {
        MethodParameters memory params = readFixture(json, "._ERC20_AND_ETH_FOR_1_LOOKSRARE_NFT");

        vm.createSelectFork(vm.envString("FORK_URL"), 17030829);
        vm.startPrank(from);

        deployRouterAndPermit2();
        vm.deal(from, BALANCE);

        deal(address(USDC), from, BALANCE);
        USDC.approve(address(permit2), BALANCE);
        permit2.approve(address(USDC), address(router), uint160(BALANCE), uint48(block.timestamp + 1000));
        assertEq(USDC.balanceOf(from), BALANCE);

        uint256 balanceOfBefore = USDC.balanceOf(from);
        uint256 ethBalanceOfBefore = address(from).balance;
        assertEq(LOOKS_RARE_NFT.balanceOf(RECIPIENT), 0);
        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertEq(balanceOfBefore - USDC.balanceOf(from), 184272629);
        assertEq(ethBalanceOfBefore - address(from).balance, 101892924857227687);
        assertEq(LOOKS_RARE_NFT.balanceOf(RECIPIENT), 1);
        assertEq(address(router).balance, 0);
    }

    function testMixedERC20ForLooksRareAndSeaportNFTs() public {
        MethodParameters memory params = readFixture(json, "._ERC20_FOR_1_LOOKSRARE_NFT_1_SEAPORT_NFT");

        vm.createSelectFork(vm.envString("FORK_URL"), 17030829);
        vm.startPrank(from);

        deployRouterAndPermit2();
        vm.deal(from, BALANCE);

        deal(address(USDC), from, BALANCE);
        USDC.approve(address(permit2), BALANCE);
        permit2.approve(address(USDC), address(router), uint160(BALANCE), uint48(block.timestamp + 1000));
        assertEq(USDC.balanceOf(from), BALANCE);

        uint256 balanceOfBefore = USDC.balanceOf(from);
        uint256 ethBalanceOfBefore = address(from).balance;
        assertEq(LOOKS_RARE_NFT.balanceOf(RECIPIENT), 0);
        assertEq(SEAPORT_NFT.balanceOf(RECIPIENT), 0);
        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertEq(balanceOfBefore - USDC.balanceOf(from), 412470713);
        assertEq(ethBalanceOfBefore - address(from).balance, 0);
        assertEq(LOOKS_RARE_NFT.balanceOf(RECIPIENT), 1);
        assertEq(SEAPORT_NFT.balanceOf(RECIPIENT), 1);
        assertEq(address(router).balance, 0);
    }

    function testMixedERC20AndETHForLooksRareAndSeaportNFTs() public {
        MethodParameters memory params = readFixture(json, "._ERC20_AND_ETH_FOR_1_LOOKSRARE_NFT_1_SEAPORT_NFT");

        vm.createSelectFork(vm.envString("FORK_URL"), 17030829);
        vm.startPrank(from);

        deployRouterAndPermit2();
        vm.deal(from, BALANCE);

        deal(address(USDC), from, BALANCE);
        USDC.approve(address(permit2), BALANCE);
        permit2.approve(address(USDC), address(router), uint160(BALANCE), uint48(block.timestamp + 1000));
        assertEq(USDC.balanceOf(from), BALANCE);

        uint256 balanceOfBefore = USDC.balanceOf(from);
        uint256 ethBalanceOfBefore = address(from).balance;
        assertEq(LOOKS_RARE_NFT.balanceOf(RECIPIENT), 0);
        assertEq(SEAPORT_NFT.balanceOf(RECIPIENT), 0);
        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertEq(balanceOfBefore - USDC.balanceOf(from), 375656349);
        assertEq(ethBalanceOfBefore - address(from).balance, 19599999999999998);
        assertEq(LOOKS_RARE_NFT.balanceOf(RECIPIENT), 1);
        assertEq(SEAPORT_NFT.balanceOf(RECIPIENT), 1);
        assertEq(address(router).balance, 0);
    }

    function testMixedERC20AndERC20For1NFT() public {
        MethodParameters memory params = readFixture(json, "._2_ERC20s_FOR_1_NFT");

        vm.createSelectFork(vm.envString("FORK_URL"), 17030829);
        vm.startPrank(from);

        deployRouterAndPermit2();
        vm.deal(from, BALANCE);

        deal(address(USDC), from, BALANCE);
        deal(address(DAI), from, BALANCE);
        USDC.approve(address(permit2), BALANCE);
        permit2.approve(address(USDC), address(router), uint160(BALANCE), uint48(block.timestamp + 1000));
        DAI.approve(address(permit2), BALANCE);
        permit2.approve(address(DAI), address(router), uint160(BALANCE), uint48(block.timestamp + 1000));
        assertEq(DAI.balanceOf(from), BALANCE);

        uint256 balanceOfBefore = USDC.balanceOf(from);
        uint256 ethBalanceOfBefore = address(from).balance;
        assertEq(LOOKS_RARE_NFT.balanceOf(RECIPIENT), 0);
        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertEq(balanceOfBefore - USDC.balanceOf(from), 187828076);
        assertGt(address(from).balance - ethBalanceOfBefore, 0); // v2 exactOut rounding imprecision
        assertEq(LOOKS_RARE_NFT.balanceOf(RECIPIENT), 1);
        assertEq(address(router).balance, 0);
    }

    function testMixedERC20For1InvalidNFTReverts() public {
        MethodParameters memory params = readFixture(json, "._ERC20_FOR_1_INVALID_NFT");

        vm.createSelectFork(vm.envString("FORK_URL"), 17030829);
        vm.startPrank(from);

        deployRouterAndPermit2();
        vm.deal(from, BALANCE);

        deal(address(USDC), from, BALANCE);
        USDC.approve(address(permit2), BALANCE);
        permit2.approve(address(USDC), address(router), uint160(BALANCE), uint48(block.timestamp + 1000));
        assertEq(USDC.balanceOf(from), BALANCE);

        uint256 balanceOfBefore = USDC.balanceOf(from);
        uint256 ethBalanceOfBefore = address(from).balance;
        assertEq(LOOKS_RARE_NFT.balanceOf(RECIPIENT), 0);
        vm.expectRevert(bytes("error message"));
        (bool success,) = address(router).call{value: params.value}(params.data);
        assertFalse(success, "expectRevert: call did not revert");
        assertEq(balanceOfBefore - USDC.balanceOf(from), 0);
        assertEq(ethBalanceOfBefore - address(from).balance, 0);
        assertEq(LOOKS_RARE_NFT.balanceOf(RECIPIENT), 0);
        assertEq(address(router).balance, 0);
    }

    function testMixedERC20SwapForNFTsPartialFill() public {
        MethodParameters memory params = readFixture(json, "._ERC20_FOR_NFTS_PARTIAL_FILL");

        vm.createSelectFork(vm.envString("FORK_URL"), 17030829);
        vm.startPrank(from);

        deployRouterAndPermit2();
        vm.deal(from, BALANCE);

        deal(address(USDC), from, BALANCE);
        USDC.approve(address(permit2), BALANCE);
        permit2.approve(address(USDC), address(router), uint160(BALANCE), uint48(block.timestamp + 1000));
        assertEq(USDC.balanceOf(from), BALANCE);

        uint256 balanceOfBefore = USDC.balanceOf(from);
        uint256 ethBalanceOfBefore = address(from).balance;
        assertEq(LOOKS_RARE_NFT.balanceOf(RECIPIENT), 0);
        assertEq(SEAPORT_NFT.balanceOf(RECIPIENT), 0);
        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertEq(balanceOfBefore - USDC.balanceOf(from), 412470713);
        assertEq(address(from).balance - ethBalanceOfBefore, 200000000000000000); // earned ETH back from partial fill
        assertEq(LOOKS_RARE_NFT.balanceOf(RECIPIENT), 0);
        assertEq(SEAPORT_NFT.balanceOf(RECIPIENT), 1);
        assertEq(address(router).balance, 0);
    }
}
