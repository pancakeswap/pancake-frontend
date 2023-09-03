// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Test, stdJson, console2} from "forge-std/Test.sol";
import {ERC20} from "solmate/src/tokens/ERC20.sol";
import {UniversalRouter} from "universal-router/UniversalRouter.sol";
import {Permit2} from "permit2/src/Permit2.sol";
import {DeployRouter} from "./utils/DeployRouter.sol";
import {MethodParameters, Interop} from "./utils/Interop.sol";

contract SwapERC20CallParametersTest is Test, Interop, DeployRouter {
    using stdJson for string;

    ERC20 private constant WETH = ERC20(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);
    ERC20 private constant USDC = ERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
    ERC20 private constant DAI = ERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);
    // starting eth balance
    uint256 constant BALANCE = 10 ether;
    uint256 ONE_USDC = 10 ** 6;
    uint256 ONE_DAI = 1 ether;

    function setUp() public {
        fromPrivateKey = 0x1234;
        from = vm.addr(fromPrivateKey);
        string memory root = vm.projectRoot();
        json = vm.readFile(string.concat(root, "/test/forge/interop.json"));

        vm.createSelectFork(vm.envString("FORK_URL"), 16075500);
        vm.startPrank(from);
        deployRouterAndPermit2();
        vm.deal(from, BALANCE);
    }

    function testV2ExactInputSingleNative() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_V2_1_ETH_FOR_USDC");

        assertEq(from.balance, BALANCE);
        assertEq(USDC.balanceOf(RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLe(from.balance, BALANCE - params.value);
        assertGt(USDC.balanceOf(RECIPIENT), 1000 * ONE_USDC);
    }

    function testV2ExactInputSingleNativeWithFee() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_V2_1_ETH_FOR_USDC_WITH_FEE");

        assertEq(from.balance, BALANCE);
        assertEq(USDC.balanceOf(RECIPIENT), 0);
        assertEq(USDC.balanceOf(FEE_RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLe(from.balance, BALANCE - params.value);

        uint256 recipientBalance = USDC.balanceOf(RECIPIENT);
        uint256 feeRecipientBalance = USDC.balanceOf(FEE_RECIPIENT);
        uint256 totalOut = recipientBalance + feeRecipientBalance;
        uint256 expectedFee = totalOut * 500 / 10000;
        assertEq(feeRecipientBalance, expectedFee);
        assertEq(recipientBalance, totalOut - expectedFee);
        assertGt(totalOut, 1000 * ONE_USDC);
    }

    function testV2ExactInputNative() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_V2_1_ETH_FOR_USDC_2_HOP");

        assertEq(from.balance, BALANCE);
        assertEq(DAI.balanceOf(RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLe(from.balance, BALANCE - params.value);
        assertGt(DAI.balanceOf(RECIPIENT), 1000 * ONE_DAI);
        assertEq(WETH.balanceOf(address(router)), 0);
        assertEq(address(router).balance, 0);
    }

    function testV2ExactInputNativeWithFee() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_V2_1_ETH_FOR_USDC_2_HOP_WITH_FEE");

        assertEq(from.balance, BALANCE);
        assertEq(DAI.balanceOf(RECIPIENT), 0);
        assertEq(DAI.balanceOf(FEE_RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLe(from.balance, BALANCE - params.value);

        uint256 recipientBalance = DAI.balanceOf(RECIPIENT);
        uint256 feeRecipientBalance = DAI.balanceOf(FEE_RECIPIENT);
        uint256 totalOut = recipientBalance + feeRecipientBalance;
        uint256 expectedFee = totalOut * 500 / 10000;
        assertEq(feeRecipientBalance, expectedFee);
        assertEq(recipientBalance, totalOut - expectedFee);
        assertGt(totalOut, 1000 * ONE_USDC);

        // Nothing left in the router!
        assertEq(WETH.balanceOf(address(router)), 0);
        assertEq(address(router).balance, 0);
    }

    function testV2ExactInputSingleERC20ForETH() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_V2_1000_USDC_FOR_ETH");

        deal(address(USDC), from, BALANCE);
        USDC.approve(address(permit2), BALANCE);
        permit2.approve(address(USDC), address(router), uint160(BALANCE), uint48(block.timestamp + 1000));

        assertEq(USDC.balanceOf(from), BALANCE);
        uint256 startingRecipientBalance = RECIPIENT.balance;

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLe(USDC.balanceOf(from), BALANCE - 1000 * ONE_USDC);
        assertGe(RECIPIENT.balance, startingRecipientBalance + 0.1 ether);
    }

    function testV2ExactInputSingleERC20ForETHWithWETHFee() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_V2_1000_USDC_FOR_ETH_WITH_WETH_FEE");

        deal(address(USDC), from, BALANCE);
        USDC.approve(address(permit2), BALANCE);
        permit2.approve(address(USDC), address(router), uint160(BALANCE), uint48(block.timestamp + 1000));

        assertEq(USDC.balanceOf(from), BALANCE);
        uint256 startingRecipientBalance = RECIPIENT.balance;
        uint256 startingFeeRecipientBalance = FEE_RECIPIENT.balance;
        assertEq(WETH.balanceOf(FEE_RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLe(USDC.balanceOf(from), BALANCE - 1000 * ONE_USDC);

        uint256 recipientOutETH = RECIPIENT.balance - startingRecipientBalance;
        uint256 feeRecipientOutETH = FEE_RECIPIENT.balance - startingFeeRecipientBalance;
        uint256 feeRecipientOutWETH = WETH.balanceOf(FEE_RECIPIENT);

        uint256 totalOut = recipientOutETH + feeRecipientOutWETH;
        uint256 expectedFee = totalOut * 500 / 10000;

        // Recipient should get ETH, and fee recipient should get WETH (and no ETH)
        assertEq(feeRecipientOutWETH, expectedFee);
        assertEq(feeRecipientOutETH, 0);
        assertEq(recipientOutETH, totalOut - expectedFee);
        assertGt(totalOut, 0.1 ether);

        // Nothing left in the router!
        assertEq(WETH.balanceOf(address(router)), 0);
        assertEq(address(router).balance, 0);
    }

    function testV2ExactInputSingleERC20WithPermit() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_V2_1000_USDC_FOR_ETH_PERMIT");

        deal(address(USDC), from, BALANCE);
        USDC.approve(address(permit2), BALANCE);

        assertEq(USDC.balanceOf(from), BALANCE);
        uint256 startingRecipientBalance = RECIPIENT.balance;

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLe(USDC.balanceOf(from), BALANCE - 1000 * ONE_USDC);
        assertGe(RECIPIENT.balance, startingRecipientBalance + 0.1 ether);
    }

    function testV2ExactInputSingleERC20With2098Permit() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_V2_1000_USDC_FOR_ETH_2098_PERMIT");

        deal(address(USDC), from, BALANCE);
        USDC.approve(address(permit2), BALANCE);

        assertEq(USDC.balanceOf(from), BALANCE);
        uint256 startingRecipientBalance = RECIPIENT.balance;

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLe(USDC.balanceOf(from), BALANCE - 1000 * ONE_USDC);
        assertGe(RECIPIENT.balance, startingRecipientBalance + 0.1 ether);
    }

    function testV2ExactInputSingleERC20With2098PermitZeroRecoveryParam() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_V2_1000_USDC_FOR_ETH_PERMIT_V_RECOVERY_PARAM");

        deal(address(USDC), from, BALANCE);
        USDC.approve(address(permit2), BALANCE);

        assertEq(USDC.balanceOf(from), BALANCE);
        uint256 startingRecipientBalance = RECIPIENT.balance;

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLe(USDC.balanceOf(from), BALANCE - 1000 * ONE_USDC);
        assertGe(RECIPIENT.balance, startingRecipientBalance + 0.1 ether);
    }

    function testV2ExactInputERC20() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_V2_10_DAI_FOR_ETH_2_HOP");

        deal(address(DAI), from, BALANCE);
        DAI.approve(address(permit2), BALANCE);
        permit2.approve(address(DAI), address(router), uint160(BALANCE), uint48(block.timestamp + 1000));
        assertEq(DAI.balanceOf(from), BALANCE);
        uint256 startingRecipientBalance = RECIPIENT.balance;

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLe(DAI.balanceOf(from), BALANCE - 10 * ONE_DAI);
        assertGe(RECIPIENT.balance, startingRecipientBalance + 0.001 ether);
    }

    function testV2ExactOutputSingleNative() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_V2_ETH_FOR_1000_USDC");

        assertEq(from.balance, BALANCE);
        assertEq(USDC.balanceOf(RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLe(from.balance, BALANCE - params.value);
        assertEq(USDC.balanceOf(RECIPIENT), 1000 * ONE_USDC);
        assertEq(WETH.balanceOf(address(router)), 0);
        assertEq(address(router).balance, 0);
    }

    function testV2ExactOutputSingleNativeWithFee() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_V2_ETH_FOR_1000_USDC_WITH_FEE");

        uint256 outputAmount = 1000 * ONE_USDC;
        uint256 feeAmount = ((outputAmount * 10000) / 9500) - outputAmount;

        assertEq(from.balance, BALANCE);
        assertEq(USDC.balanceOf(RECIPIENT), 0);
        assertEq(USDC.balanceOf(FEE_RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLe(from.balance, BALANCE - params.value);
        assertEq(USDC.balanceOf(RECIPIENT), outputAmount);
        assertEq(USDC.balanceOf(FEE_RECIPIENT), feeAmount);
        assertEq(WETH.balanceOf(address(router)), 0);
        assertEq(address(router).balance, 0);
    }

    function testV2ExactOutputSingleERC20() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_V2_USDC_FOR_1_ETH");

        deal(address(USDC), from, BALANCE);
        USDC.approve(address(permit2), BALANCE);
        permit2.approve(address(USDC), address(router), uint160(BALANCE), uint48(block.timestamp + 1000));

        assertEq(USDC.balanceOf(from), BALANCE);
        uint256 startingRecipientBalance = RECIPIENT.balance;

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLe(USDC.balanceOf(from), BALANCE - 1000 * ONE_USDC);
        assertGe(RECIPIENT.balance, startingRecipientBalance + 1 ether);
    }

    function testV3ExactInputSingleNative() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_V3_1_ETH_FOR_USDC");

        assertEq(from.balance, BALANCE);
        assertEq(USDC.balanceOf(RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLe(from.balance, BALANCE - params.value);
        assertGt(USDC.balanceOf(RECIPIENT), 1000 * ONE_USDC);
    }

    function testV3ExactInputSingleNativeWithFee() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_V3_1_ETH_FOR_USDC_WITH_FEE");

        assertEq(from.balance, BALANCE);
        assertEq(USDC.balanceOf(RECIPIENT), 0);
        assertEq(USDC.balanceOf(FEE_RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLe(from.balance, BALANCE - params.value);

        uint256 recipientBalance = USDC.balanceOf(RECIPIENT);
        uint256 feeRecipientBalance = USDC.balanceOf(FEE_RECIPIENT);
        uint256 totalOut = recipientBalance + feeRecipientBalance;
        uint256 expectedFee = totalOut * 500 / 10000;
        assertEq(feeRecipientBalance, expectedFee);
        assertEq(recipientBalance, totalOut - expectedFee);
        assertGt(totalOut, 1000 * ONE_USDC);
    }

    function testV3ExactInputSingleERC20() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_V3_1000_USDC_FOR_ETH");

        deal(address(USDC), from, BALANCE);
        USDC.approve(address(permit2), BALANCE);
        permit2.approve(address(USDC), address(router), uint160(BALANCE), uint48(block.timestamp + 1000));
        assertEq(USDC.balanceOf(from), BALANCE);
        uint256 startingRecipientBalance = RECIPIENT.balance;

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLe(USDC.balanceOf(from), BALANCE - 1000 * ONE_USDC);
        assertGe(RECIPIENT.balance, startingRecipientBalance + 0.1 ether);
    }

    function testV3ExactInputSingleERC20WithWETHFee() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_V3_1000_USDC_FOR_ETH_WITH_WETH_FEE");

        deal(address(USDC), from, BALANCE);
        USDC.approve(address(permit2), BALANCE);
        permit2.approve(address(USDC), address(router), uint160(BALANCE), uint48(block.timestamp + 1000));

        assertEq(USDC.balanceOf(from), BALANCE);
        uint256 startingRecipientBalance = RECIPIENT.balance;
        uint256 startingFeeRecipientBalance = FEE_RECIPIENT.balance;
        assertEq(WETH.balanceOf(FEE_RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLe(USDC.balanceOf(from), BALANCE - 1000 * ONE_USDC);

        uint256 recipientOutETH = RECIPIENT.balance - startingRecipientBalance;
        uint256 feeRecipientOutETH = FEE_RECIPIENT.balance - startingFeeRecipientBalance;
        uint256 feeRecipientOutWETH = WETH.balanceOf(FEE_RECIPIENT);

        uint256 totalOut = recipientOutETH + feeRecipientOutWETH;
        uint256 expectedFee = totalOut * 500 / 10000;

        // Recipient should get ETH, and fee recipient should get WETH (and no ETH)
        assertEq(feeRecipientOutWETH, expectedFee);
        assertEq(feeRecipientOutETH, 0);
        assertEq(recipientOutETH, totalOut - expectedFee);
        assertGt(totalOut, 0.1 ether);

        // Nothing left in the router!
        assertEq(WETH.balanceOf(address(router)), 0);
        assertEq(address(router).balance, 0);
    }

    function testV3ExactInputSingleERC20WithPermit() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_V3_1000_USDC_FOR_ETH_PERMIT");

        deal(address(USDC), from, BALANCE);
        USDC.approve(address(permit2), BALANCE);
        assertEq(USDC.balanceOf(from), BALANCE);
        uint256 startingRecipientBalance = RECIPIENT.balance;

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLe(USDC.balanceOf(from), BALANCE - 1000 * ONE_USDC);
        assertGe(RECIPIENT.balance, startingRecipientBalance + 0.1 ether);
    }

    function testV3ExactInputNative() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_V3_1_ETH_FOR_DAI_2_HOP");

        assertEq(from.balance, BALANCE);
        assertEq(DAI.balanceOf(RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLe(from.balance, BALANCE - params.value);
        assertGt(DAI.balanceOf(RECIPIENT), 1000 * ONE_DAI);
    }

    function testV3ExactOutputSingleNative() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_V3_ETH_FOR_1000_USDC");

        assertEq(from.balance, BALANCE);
        assertEq(USDC.balanceOf(RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLe(from.balance, BALANCE - params.value);
        assertEq(USDC.balanceOf(RECIPIENT), 1000 * ONE_USDC);
    }

    function testV3ExactOutputSingleERC20() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_V3_USDC_FOR_1_ETH");

        deal(address(USDC), from, BALANCE);
        USDC.approve(address(permit2), BALANCE);
        permit2.approve(address(USDC), address(router), uint160(BALANCE), uint48(block.timestamp + 1000));
        assertEq(USDC.balanceOf(from), BALANCE);
        uint256 startingRecipientBalance = RECIPIENT.balance;

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLe(USDC.balanceOf(from), BALANCE - 1000 * ONE_USDC);
        assertGe(RECIPIENT.balance, startingRecipientBalance + 1 ether);
    }

    function testV3ExactOutputNative() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_V3_ETH_FOR_1000_DAI_2_HOP");

        assertEq(from.balance, BALANCE);
        assertEq(DAI.balanceOf(RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLe(from.balance, BALANCE - params.value);
        assertEq(DAI.balanceOf(RECIPIENT), 1000 * ONE_DAI);
    }

    function testV3ExactOutputERC20() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_V3_DAI_FOR_1_ETH_2_HOP");

        uint256 daiAmount = 2000 ether;
        deal(address(DAI), from, daiAmount);
        DAI.approve(address(permit2), daiAmount);
        permit2.approve(address(DAI), address(router), uint160(daiAmount), uint48(block.timestamp + 1000));

        assertEq(DAI.balanceOf(from), daiAmount);
        uint256 startingRecipientBalance = RECIPIENT.balance;

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");

        assertLe(DAI.balanceOf(from), daiAmount - 1000 * ONE_DAI);
        assertGe(RECIPIENT.balance, startingRecipientBalance + 1 ether);
    }

    function testV3ExactOutputERC20WithWETHFee() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_V3_DAI_FOR_1_ETH_2_HOP_WITH_WETH_FEE");

        uint256 daiAmount = 2000 * ONE_DAI;
        uint256 outputAmount = 1 ether;
        uint256 feeAmount = ((outputAmount * 10000) / 9500) - outputAmount;

        deal(address(DAI), from, daiAmount);
        DAI.approve(address(permit2), daiAmount);
        permit2.approve(address(DAI), address(router), uint160(daiAmount), uint48(block.timestamp + 1000));

        assertEq(DAI.balanceOf(from), daiAmount);
        uint256 startingRecipientBalance = RECIPIENT.balance;
        uint256 startingFeeRecipientBalance = FEE_RECIPIENT.balance;
        assertEq(WETH.balanceOf(FEE_RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");

        assertLe(DAI.balanceOf(from), daiAmount - 1000 * ONE_DAI);

        // Fee paid in WETH, and recipient gets ETH
        assertEq(WETH.balanceOf(FEE_RECIPIENT), feeAmount);
        assertEq(FEE_RECIPIENT.balance, startingFeeRecipientBalance);
        assertEq(RECIPIENT.balance, startingRecipientBalance + outputAmount);

        // Nothing left in the router!
        assertEq(WETH.balanceOf(address(router)), 0);
        assertEq(address(router).balance, 0);
    }

    function testMixedExactInputNative() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_MIXED_1_ETH_FOR_DAI");

        assertEq(from.balance, BALANCE);
        assertEq(DAI.balanceOf(RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLe(from.balance, BALANCE - params.value);
        assertGt(DAI.balanceOf(RECIPIENT), 1000 * ONE_DAI);
    }

    function testMixedExactInputNativeV2First() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_MIXED_1_ETH_FOR_DAI_V2_FIRST");

        assertEq(from.balance, BALANCE);
        assertEq(DAI.balanceOf(RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLe(from.balance, BALANCE - params.value);
        assertGt(DAI.balanceOf(RECIPIENT), 1000 * ONE_DAI);
    }

    function testMixedExactInputNativeV2Only() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_MIXED_1_ETH_FOR_DAI_V2_ONLY");

        assertEq(from.balance, BALANCE);
        assertEq(DAI.balanceOf(RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLe(from.balance, BALANCE - params.value);
        assertGt(DAI.balanceOf(RECIPIENT), 1000 * ONE_DAI);
    }

    function testMixedExactInputNativeV3Only() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_MIXED_1_ETH_FOR_DAI_V3_ONLY");

        assertEq(from.balance, BALANCE);
        assertEq(DAI.balanceOf(RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLe(from.balance, BALANCE - params.value);
        assertGt(DAI.balanceOf(RECIPIENT), 1000 * ONE_DAI);
    }

    function testMixedExactInputERC20V2ToV3() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_MIXED_DAI_FOR_ETH");

        uint256 daiAmount = 1000 ether;
        deal(address(DAI), from, daiAmount);
        DAI.approve(address(permit2), daiAmount);
        permit2.approve(address(DAI), address(router), uint160(daiAmount), uint48(block.timestamp + 1000));
        assertEq(DAI.balanceOf(from), daiAmount);
        uint256 startingRecipientBalance = RECIPIENT.balance;

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLe(DAI.balanceOf(from), 0);
        assertGe(RECIPIENT.balance, startingRecipientBalance + 0.1 ether);
    }

    function testTwoRoutesExactInputETHtoUSDC() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_SPLIT_TWO_ROUTES_ETH_TO_USDC");

        assertEq(from.balance, BALANCE);
        assertEq(USDC.balanceOf(RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLe(from.balance, BALANCE - params.value);
        assertGt(USDC.balanceOf(RECIPIENT), 2000 * ONE_USDC);
        assertEq(WETH.balanceOf(address(router)), 0);
        assertEq(address(router).balance, 0);
    }

    function testThreeRoutesExactInputETHtoUSDC() public {
        MethodParameters memory params = readFixture(json, "._UNISWAP_SPLIT_THREE_ROUTES_ETH_TO_USDC");

        assertEq(from.balance, BALANCE);
        assertEq(USDC.balanceOf(RECIPIENT), 0);

        (bool success,) = address(router).call{value: params.value}(params.data);
        require(success, "call failed");
        assertLe(from.balance, BALANCE - params.value);
        assertGt(USDC.balanceOf(RECIPIENT), 3000 * ONE_USDC);
        assertEq(USDC.balanceOf(address(router)), 0);
        assertEq(address(router).balance, 0);
    }
}
