// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.4;

/// @title Interface for CryptoPunksMarket
interface ICryptopunksMarket {
    function balanceOf(address) external returns (uint256);

    function punkIndexToAddress(uint256) external returns (address);

    function buyPunk(uint256 punkIndex) external payable;

    function transferPunk(address to, uint256 punkIndex) external;
}
