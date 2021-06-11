import Web3 from "web3";
import getRpcUrl from "./getRpcUrl";

const RPC_URL = getRpcUrl();
const httpProvider = new Web3.providers.HttpProvider(RPC_URL, {
  timeout: 10000,
});
const web3NoAccount = new Web3(httpProvider);

export default web3NoAccount;
