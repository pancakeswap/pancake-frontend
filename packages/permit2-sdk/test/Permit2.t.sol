// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Test, stdJson, console2} from "forge-std/Test.sol";
import {ISignatureTransfer} from "../permit2/src/interfaces/ISignatureTransfer.sol";
import {Permit2} from "../permit2/src/Permit2.sol";
import {IAllowanceTransfer} from "../permit2/src/interfaces/IAllowanceTransfer.sol";
import {ISignatureTransfer} from "../permit2/src/interfaces/ISignatureTransfer.sol";
import {PermitHash} from "../permit2/src/libraries/PermitHash.sol";
import {MockERC20} from "./mock/MockERC20.sol";
import {MockWitness} from "./mock/MockWitness.sol";

contract Permit2Test is Test {
    using stdJson for string;

    address constant SPENDER = address(1);
    uint48 constant EXPIRATION = 10000000000000;
    uint256 constant AMOUNT = 1 ether;

    address from;
    uint256 fromPrivateKey;
    Permit2 permit2;
    MockERC20 token;
    string json;

    function setUp() public {
        fromPrivateKey = 0x1234;
        from = vm.addr(fromPrivateKey);
        string memory root = vm.projectRoot();
        permit2 = new Permit2{salt: 0x00}();
        token = new MockERC20{salt: 0x00}();
        json = vm.readFile(string.concat(root, "/test/interop.json"));

        vm.prank(from);
        token.approve(address(permit2), type(uint256).max);
    }

    function testPermit() public {
        bytes32 msgHash = json.readBytes32("._PERMIT_HASH");
        permit2.permit(
            from,
            IAllowanceTransfer.PermitSingle({
                details: IAllowanceTransfer.PermitDetails({
                    token: address(token),
                    amount: uint160(AMOUNT),
                    expiration: EXPIRATION,
                    nonce: 0
                }),
                spender: SPENDER,
                sigDeadline: EXPIRATION
            }),
            sign(msgHash)
        );

        (uint160 amount, uint48 expiry, uint48 nonce) = permit2.allowance(from, address(token), SPENDER);
        assertEq(amount, uint160(AMOUNT));
        assertEq(expiry, EXPIRATION);
        assertEq(nonce, 1);
    }

    function testPermitBatch() public {
        bytes32 msgHash = json.readBytes32("._PERMIT_BATCH_HASH");
        IAllowanceTransfer.PermitDetails[] memory details = new IAllowanceTransfer.PermitDetails[](1);
        details[0] = IAllowanceTransfer.PermitDetails({
            token: address(token),
            amount: uint160(AMOUNT),
            expiration: EXPIRATION,
            nonce: 0
        });

        permit2.permit(
            from,
            IAllowanceTransfer.PermitBatch({details: details, spender: SPENDER, sigDeadline: EXPIRATION}),
            sign(msgHash)
        );

        (uint160 amount, uint48 expiry, uint48 nonce) = permit2.allowance(from, address(token), SPENDER);
        assertEq(amount, uint160(AMOUNT));
        assertEq(expiry, EXPIRATION);
        assertEq(nonce, 1);
    }

    function testSignatureTransfer() public {
        bytes32 msgHash = json.readBytes32("._PERMIT_TRANSFER");

        token.mint(from, AMOUNT);

        vm.prank(SPENDER);
        ISignatureTransfer.SignatureTransferDetails memory details =
            ISignatureTransfer.SignatureTransferDetails({to: address(SPENDER), requestedAmount: AMOUNT});
        permit2.permitTransferFrom(
            ISignatureTransfer.PermitTransferFrom({
                permitted: ISignatureTransfer.TokenPermissions({token: address(token), amount: AMOUNT}),
                nonce: 0,
                deadline: EXPIRATION
            }),
            details,
            from,
            sign(msgHash)
        );

        assertEq(token.balanceOf(address(SPENDER)), AMOUNT);
        assertEq(token.balanceOf(address(from)), 0);
    }

    function testSignatureTransferBatch() public {
        bytes32 msgHash = json.readBytes32("._PERMIT_TRANSFER_BATCH");

        ISignatureTransfer.TokenPermissions[] memory permitted = new ISignatureTransfer.TokenPermissions[](1);
        permitted[0] = ISignatureTransfer.TokenPermissions({token: address(token), amount: AMOUNT});

        ISignatureTransfer.SignatureTransferDetails[] memory details =
            new ISignatureTransfer.SignatureTransferDetails[](1);
        details[0] = ISignatureTransfer.SignatureTransferDetails({to: address(SPENDER), requestedAmount: AMOUNT});

        token.mint(from, AMOUNT);

        vm.prank(SPENDER);
        permit2.permitTransferFrom(
            ISignatureTransfer.PermitBatchTransferFrom({permitted: permitted, nonce: 0, deadline: EXPIRATION}),
            details,
            from,
            sign(msgHash)
        );

        assertEq(token.balanceOf(address(SPENDER)), AMOUNT);
        assertEq(token.balanceOf(address(from)), 0);
    }

    function testSignatureTransferWitness() public {
        bytes32 msgHash = json.readBytes32("._PERMIT_TRANSFER_WITNESS");

        token.mint(from, AMOUNT);

        vm.prank(SPENDER);
        ISignatureTransfer.SignatureTransferDetails memory details =
            ISignatureTransfer.SignatureTransferDetails({to: address(SPENDER), requestedAmount: AMOUNT});
        permit2.permitWitnessTransferFrom(
            ISignatureTransfer.PermitTransferFrom({
                permitted: ISignatureTransfer.TokenPermissions({token: address(token), amount: AMOUNT}),
                nonce: 0,
                deadline: EXPIRATION
            }),
            details,
            from,
            MockWitness.hash(0),
            MockWitness.WITNESS_TYPE_STRING,
            sign(msgHash)
        );

        assertEq(token.balanceOf(address(SPENDER)), AMOUNT);
        assertEq(token.balanceOf(address(from)), 0);
    }

    function sign(bytes32 msgHash) public returns (bytes memory sig) {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(fromPrivateKey, msgHash);
        return bytes.concat(r, s, bytes1(v));
    }
}
