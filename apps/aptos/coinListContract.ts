import { Types } from 'aptos'

export type CoinListAddExtensionArgs = [string, string]

export const coinListAddExtension = (
  args: CoinListAddExtensionArgs,
  typeArgs: [string],
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::coin_list::add_extension',
  }
}

export const coinListAddToList = (typeArgs: [string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: [],
    function: '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::coin_list::add_to_list',
  }
}

export type CoinListAddToRegistryByAdminArgs = [string, string, string, string, string, boolean]

export const coinListAddToRegistryByAdmin = (
  args: CoinListAddToRegistryByAdminArgs,
  typeArgs: [string],
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::coin_list::add_to_registry_by_admin',
  }
}

export type CoinListAddToRegistryBySignerArgs = [string, string, string, string, string, boolean]

export const coinListAddToRegistryBySigner = (
  args: CoinListAddToRegistryBySignerArgs,
  typeArgs: [string],
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::coin_list::add_to_registry_by_signer',
  }
}

export const coinListCreateList = (): Types.EntryFunctionPayload => {
  return {
    type_arguments: [],
    arguments: [],
    function: '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::coin_list::create_list',
  }
}

export type CoinListDropExtensionArgs = [string, string]

export const coinListDropExtension = (
  args: CoinListDropExtensionArgs,
  typeArgs: [string],
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::coin_list::drop_extension',
  }
}

export const coinListFetchAllRegisteredCoinInfo = (): Types.EntryFunctionPayload => {
  return {
    type_arguments: [],
    arguments: [],
    function:
      '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::coin_list::fetch_all_registered_coin_info',
  }
}

export type CoinListFetchFullListArgs = [string]

export const coinListFetchFullList = (args: CoinListFetchFullListArgs): Types.EntryFunctionPayload => {
  return {
    type_arguments: [],
    arguments: args,
    function: '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::coin_list::fetch_full_list',
  }
}

export const coinListInitialize = (): Types.EntryFunctionPayload => {
  return {
    type_arguments: [],
    arguments: [],
    function: '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::coin_list::initialize',
  }
}

export const coinListRemoveFromList = (typeArgs: [string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: [],
    function: '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::coin_list::remove_from_list',
  }
}

export const devnetCoinsDeploy = (): Types.EntryFunctionPayload => {
  return {
    type_arguments: [],
    arguments: [],
    function: '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::deploy',
  }
}

export type DevnetCoinsMintToWalletArgs = [bigint | string]

export const devnetCoinsMintToWallet = (
  args: DevnetCoinsMintToWalletArgs,
  typeArgs: [string],
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::mint_to_wallet',
  }
}
