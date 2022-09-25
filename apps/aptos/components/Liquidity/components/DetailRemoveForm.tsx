export const DetailRemoveForm = () => {
  //
}
// const DetailRemoveForm = () => {
//   return (
//     <>
//       <Box my="16px">
//         <CurrencyInputPanel
//           value={formattedAmounts[Field.LIQUIDITY]}
//           onUserInput={onLiquidityInput}
//           onMax={() => {
//             onUserInput(Field.LIQUIDITY_PERCENT, '100')
//           }}
//           showMaxButton={!atMaxAmount}
//           disableCurrencySelect
//           currency={pair?.liquidityToken}
//           pair={pair}
//           id="liquidity-amount"
//           onCurrencySelect={() => null}
//           showCommonBases
//           commonBasesType={CommonBasesType.LIQUIDITY}
//         />
//         <ColumnCenter>
//           <ArrowDownIcon width="24px" my="16px" />
//         </ColumnCenter>
//         <CurrencyInputPanel
//           beforeButton={
//             zapModeStatus && (
//               <ZapCheckbox
//                 disabled={!removalCheckedB && removalCheckedA}
//                 checked={removalCheckedA}
//                 onChange={(e) => {
//                   setRemovalCheckedA(e.target.checked)
//                 }}
//               />
//             )
//           }
//           zapStyle="zap"
//           hideBalance
//           disabled={isZap && !removalCheckedA}
//           value={formattedAmounts[Field.CURRENCY_A]}
//           onUserInput={onCurrencyAInput}
//           onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
//           showMaxButton={!atMaxAmount}
//           currency={currencyA}
//           label={t('Output')}
//           onCurrencySelect={handleSelectCurrencyA}
//           id="remove-liquidity-tokena"
//           showCommonBases
//           commonBasesType={CommonBasesType.LIQUIDITY}
//         />
//         <ColumnCenter>
//           <AddIcon width="24px" my="16px" />
//         </ColumnCenter>
//         <CurrencyInputPanel
//           beforeButton={
//             zapModeStatus && (
//               <ZapCheckbox
//                 disabled={!removalCheckedA && removalCheckedB}
//                 checked={removalCheckedB}
//                 onChange={(e) => {
//                   setRemovalCheckedB(e.target.checked)
//                 }}
//               />
//             )
//           }
//           zapStyle="zap"
//           hideBalance
//           disabled={isZap && !removalCheckedB}
//           value={formattedAmounts[Field.CURRENCY_B]}
//           onUserInput={onCurrencyBInput}
//           onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
//           showMaxButton={!atMaxAmount}
//           currency={currencyB}
//           label={t('Output')}
//           onCurrencySelect={handleSelectCurrencyB}
//           id="remove-liquidity-tokenb"
//           showCommonBases
//           commonBasesType={CommonBasesType.LIQUIDITY}
//         />
//       </Box>
//     </>
//   )
// }

// export default DetailRemoveForm
