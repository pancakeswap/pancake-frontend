export class Account {
  constructor(contracts, address) {
    this.contracts = contracts
    this.accountInfo = address
    this.type = ''
    this.allocation = []
    this.balances = {}
    this.status = ''
    this.approvals = {}
    this.walletInfo = {}
  }
}
