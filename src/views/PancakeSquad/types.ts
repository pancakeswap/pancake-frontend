export enum SaleStatusEnum {
  Pending = 'Pending', // Contract is deployed
  Premint = 'Premint', // Tickets are preminted by owner
  Presale = 'Presale', // Tickets are preminted by Gen0 users
  Sale = 'Sale', // Tickets are for sold in general sale
  DrawingRandomness = 'DrawingRandomness', // Randomness has been drawn
  Claim = 'Claim', // Tickets can be claimed for the token
}

export enum UserStatusEnum {
  UNCONNECTED,
  NO_PROFILE,
  PROFILE_ACTIVE,
  PROFILE_ACTIVE_GEN0,
}
