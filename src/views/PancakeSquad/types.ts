export enum SaleStatusEnum {
  Pending, // Contract is deployed
  Premint, // Tickets are preminted by owner
  Presale, // Tickets are preminted by Gen0 users
  Sale, // Tickets are for sold in general sale
  DrawingRandomness, // Randomness has been drawn
  Claim, // Tickets can be claimed for the token
}

export enum UserStatusEnum {
  UNCONNECTED,
  NO_PROFILE,
  PROFILE_ACTIVE,
  PROFILE_ACTIVE_GEN0,
}
