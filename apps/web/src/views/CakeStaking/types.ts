export enum CakeLockStatus {
  NotLocked = 'NotLocked',
  Locking = 'Locking',
  Expired = 'Expired',
  Migrate = 'Migrate',
}

export enum ApproveAndLockStatus {
  // no modal
  IDLE,
  // approve token, send tx
  APPROVING_TOKEN,
  // send lock tx
  LOCK_CAKE,
  // lock pending, wait for lock confirmation
  LOCK_CAKE_PENDING,
  // lock confirmed, wait for migrate confirmation
  CONFIRMED,
  // any user rejection
  REJECT,
}
