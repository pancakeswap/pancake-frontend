// export enum ApprovalState {
//   UNKNOWN,
//   NOT_APPROVED,
//   PENDING,
//   APPROVED,
// }

// const EnableText = (approval) => {
//   if (approval === ApprovalState.PENDING) return <Dots>{t('Enabling')}</Dots>

//   if (approval === ApprovalState.APPROVED) return t('Enabled')

//   return 'Enable'
// }

// const ApprovalButton = ({ children }) => {
//   const signatureData = null
//   const approval = false

//   return (
//     <>
//       <Button
//         variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
//         onClick={onAttemptToApprove}
//         disabled={approval !== ApprovalState.NOT_APPROVED}
//         width="100%"
//         mr="0.5rem"
//       >
//         <EnableText approval={approval} />
//       </Button>

//       {children({ approval, signatureData })}
//     </>
//   )
// }

// export default function RemoveLiquidityButton() {
//   if (!account) {
//     return <ConnectWalletButton width="100%" />
//   }

//   // const [onPresentRemoveLiquidity] = useModal(
//   //   <ConfirmLiquidityModal
//   //     title={t('You will receive')}
//   //     customOnDismiss={handleDismissConfirmation}
//   //     attemptingTxn={attemptingTxn}
//   //     hash={txHash || ''}
//   //     allowedSlippage={allowedSlippage}
//   //     onRemove={isZap ? onZapOut : onRemove}
//   //     isZap={isZap}
//   //     pendingText={pendingText}
//   //     approval={approval}
//   //     signatureData={signatureData}
//   //     tokenA={tokenA}
//   //     tokenB={tokenB}
//   //     liquidityErrorMessage={liquidityErrorMessage}
//   //     parsedAmounts={parsedAmounts}
//   //     currencyA={currencyA}
//   //     currencyB={currencyB}
//   //     toggleZapMode={setTemporarilyZapMode}
//   //   />,
//   //   true,
//   //   true,
//   //   'removeLiquidityModal',
//   // )

//   return (
//     <Box position="relative" mt="16px">
//       <RowBetween>
//         <ApprovalButton>
//           {({ approval, signatureData }) => (
//             <Button
//               variant={
//                 !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]
//                   ? 'danger'
//                   : 'primary'
//               }
//               onClick={() => {
//                 // setLiquidityState({
//                 //   attemptingTxn: false,
//                 //   liquidityErrorMessage: undefined,
//                 //   txHash: undefined,
//                 // })
//                 onPresentRemoveLiquidity()
//               }}
//               width="100%"
//               disabled={!isValid || (signatureData === null && approval !== ApprovalState.APPROVED)}
//             >
//               {error || t('Remove')}
//             </Button>
//           )}
//         </ApprovalButton>
//       </RowBetween>
//     </Box>
//   )
// }
