import { buildList, saveList } from "./buildList";
import checksumAddresses from "./checksum";

const command = process.argv[2];
const listName = process.argv[3];

switch (command) {
  case "checksum":
    checksumAddresses(listName);
    break;
  case "generate":
    saveList(buildList(listName), listName);
    break;
  default:
    console.info("Unknown command");
    break;
}
