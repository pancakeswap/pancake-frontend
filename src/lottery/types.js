export const ConfirmationType = {
    Hash: 0,
    Confirmed: 1,
    Both: 2,
    Simulate: 3,
}

export const LotteryStates = {
    BUY_TICKETS_OPEN: 1,
    BUY_TICKETS_CLOSE: 2,
    WINNERS_ANNOUNCED: 3,
}

export function currentLotteryState() {
    return LotteryStates.WINNERS_ANNOUNCED
}