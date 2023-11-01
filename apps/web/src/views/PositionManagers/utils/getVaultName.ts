export function getVaultName(id: string | number, managerName: string) {
  return `(${managerName}#${id})`
}
