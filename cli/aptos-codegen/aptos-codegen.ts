/* eslint-disable no-template-curly-in-string */
/* eslint-disable camelcase */
// polyfill XMLHttpRequest
import "https://deno.land/x/xhr@0.1.0/mod.ts";

import { AptosClient, HexString, TxnBuilderTypes, TypeTagParser } from "aptos";
import yargs from "yargs";
import { type Arguments } from "https://deno.land/x/yargs@v17.5.1-deno/deno-types.ts";
import { camelCase } from "camelcase";
import { defaultChains } from "../../packages/awgmi/core/src/chain.ts";
import { equalsIgnoreCase } from "../../packages/utils/equalsIgnoreCase.ts";

const {
  TypeTagBool,
  TypeTagU128,
  TypeTagAddress,
  TypeTagStruct,
  TypeTagU64,
  TypeTagU8,
  TypeTagVector,
} = TxnBuilderTypes;

// having a hard time to import aptos generated types
type MoveFunction = {
  name: string;
  visibility: string;
  is_entry: boolean;
  generic_type_params: Array<any>;
  params: Array<string>;
  return: Array<string>;
};

type MoveStruct = {
  name: string;
  is_native: boolean;
  abilities: Array<string>;
  generic_type_params: Array<any>;
  fields: Array<{
    name: string;
    type: string;
  }>;
};

type MoveModule = {
  address: string;
  name: string;
  friends: Array<string>;
  exposed_functions: Array<MoveFunction>;
  structs: Array<MoveStruct>;
};

type CodeGenMoveFunction = MoveFunction & {
  fullName: string;
  moduleName: string;
  address: string,
};

class TransactionBuilderABI {
  static fromJson(abi: MoveModule, addressOverride?: string) {
    return abi.exposed_functions
      .filter((ef) => ef.is_entry)
      .map(
        (ef) => ({
          fullName: `${
            addressOverride || abi.address
          }::${abi.name}::${ef.name}`,
          moduleName: abi.name,
          address: addressOverride || abi.address,
          ...ef,
        } as CodeGenMoveFunction),
      );
  }
}


const generateTsModuleConst = (moduleNames: string[]) => {
  return moduleNames.map(moduleName => `export const ${moduleName.toUpperCase()}_MODULE_NAME = '${moduleName}' as const`).join("\n")
}

const generateTsFn = (moveFn: CodeGenMoveFunction) => {
  const originalArgs = moveFn.params.filter((param) =>
    param !== "signer" && param !== "&signer"
  );

  const parsedArgsType = originalArgs.map((arg) =>
    // TODO: handle type refer eg: &type
    new TypeTagParser(arg).parseTypeTag()
  );

  const argsTypeName = `${camelCase(moveFn.moduleName, { pascalCase: true })}${
    camelCase(moveFn.name, { pascalCase: true })
  }Args`;

  // arguments
  const hasArgs = originalArgs.length > 0;
  const typeTemplate = hasArgs
    ? `export type ${argsTypeName} = [${
      parsedArgsType.map(transformArgTypeToTsType).join(", ")
    }]
`
    : "";
  let argsTemplate = hasArgs ? `args: ${argsTypeName}` : "";

  // type_arguments
  const hasTypeArgs = moveFn.generic_type_params.length > 0;

  if (hasTypeArgs) {
    argsTemplate = [
      `${argsTemplate}`,
      `typeArgs: [${
        moveFn.generic_type_params.map(() => "string").join(", ")
      }]`,
    ].filter(Boolean).join(", ");
  }

  return `
${typeTemplate}
export const ${camelCase(moveFn.moduleName)}${
    camelCase(moveFn.name, { pascalCase: true })
  } = (${argsTemplate}): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: ${hasTypeArgs ? "typeArgs" : "[]"},
    arguments: ${hasArgs ? "args" : "[]"},
    function: \`${moveFn.fullName.replace(moveFn.address, "${ADDRESS}").replace(`::${moveFn.moduleName}::`, `::\${${moveFn.moduleName.toUpperCase()}_MODULE_NAME}::`)}\`
  }
}
`.trimStart();
};

const DEFAULT_NETWORK = "mainnet";

interface FetchArgs extends Arguments {
  address: string;
  to?: string;
  network?: string;
}

yargs(Deno.args)
  .alias("a", "address")
  .alias("n", "network")
  .alias("t", "to")
  .command("fetch [address]", "generate ts from fetched abi", (y) => {
    return y
      .positional("address", {
        describe: "address or full name (address::module)",
        type: "string",
      });
  }, async (argv: FetchArgs) => {
    const { address, to: _to, network } = argv;
    const chain = defaultChains.find((c) =>
      equalsIgnoreCase(c.network, network || DEFAULT_NETWORK)
    );
    if (!chain) {
      throw new Error(`Network not found: ${network}`);
    }

    if (!address) {
      throw new Error("[address] not set");
    }

    const aptos = new AptosClient(chain.nodeUrls.default);
    let addr;

    let moduleName: string | undefined;
    if (address && address.includes("::")) {
      [addr, moduleName] = address.split("::");
    } else {
      addr = address;
    }

    addr = HexString.ensure(addr).toShortString()

    const modules = await aptos.getAccountModules(addr);
    let abis = modules.map((mod) => mod.abi).filter((abi) => !!abi).flatMap(
      (abi) => TransactionBuilderABI.fromJson(abi!),
    );

    if (moduleName) {
      abis = abis.filter((abi) => abi.moduleName === moduleName);
    }

    let to = _to || (moduleName && camelCase(moduleName)) || addr;
    if (!to.endsWith(".ts")) {
      to = `${to}.ts`;
    }

    const moduleNames = [...new Set(abis.map(abi => abi.moduleName))]

    const texts = abis.map(generateTsFn);

    const finalTexts =
      `/* eslint-disable camelcase */
import { Types } from 'aptos'

export const ADDRESS = '${addr}' as const

${generateTsModuleConst(moduleNames)}

${texts.join("\n")}`;
    Deno.writeTextFileSync(to, finalTexts);
  })
  .strictCommands()
  .demandCommand(1)
  .parse();

export function transformArgTypeToTsType(argType: unknown) {
  if (argType instanceof TypeTagBool) {
    return "boolean";
  }
  if (argType instanceof TypeTagU8) {
    return "number";
  }
  if (argType instanceof TypeTagU64) {
    return "bigint | string";
  }
  if (argType instanceof TypeTagU128) {
    return "bigint | string";
  }
  if (argType instanceof TypeTagAddress) {
    return "string";
  }
  if (argType instanceof TypeTagVector) {
    return `number[] | Uint8Array`;
  }

  if (argType instanceof TypeTagStruct) {
    const { address, module_name: moduleName, name } = argType.value;
    if (
      `${
        HexString.fromUint8Array(address.address).toShortString()
      }::${moduleName.value}::${name.value}` !== "0x1::string::String"
    ) {
      throw new Error(
        "The only supported struct arg is of type 0x1::string::String",
      );
    }
    return "string";
  }

  throw new Error(`Unknown type for argType: ${argType}`);
}
