export const ConfirmationType = {
    Hash: 0,
    Confirmed: 1,
    Both: 2,
    Simulate: 3,
}

export const LotteryStates = {
    BUY_TICKETS_OPEN: false,
    WINNERS_ANNOUNCED: true,
}

export function currentLotteryState() {
    return LotteryStates.WINNERS_ANNOUNCED
}