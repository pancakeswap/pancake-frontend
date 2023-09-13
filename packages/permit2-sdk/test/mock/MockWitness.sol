// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

library MockWitness {
    string public constant NAME = "MockWitness";
    string public constant TYPE = "MockWitness(uint256 mock)";
    bytes32 public constant TYPE_HASH = keccak256(bytes(TYPE));

    string constant WITNESS_TYPE_STRING =
        "MockWitness witness)MockWitness(uint256 mock)TokenPermissions(address token,uint256 amount)";

    function hash(uint256 mock) internal pure returns (bytes32) {
        return keccak256(abi.encode(TYPE_HASH, mock));
    }
}
