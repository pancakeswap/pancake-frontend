// const SimpleRemoveForm = () => {
//   return (
//     <>
//       <BorderCard>
//         <Text fontSize="40px" bold mb="16px" style={{ lineHeight: 1 }}>
//           {formattedAmounts[Field.LIQUIDITY_PERCENT]}%
//         </Text>
//         <Slider
//           name="lp-amount"
//           min={0}
//           max={100}
//           value={innerLiquidityPercentage}
//           onValueChanged={handleChangePercent}
//           mb="16px"
//         />
//         <Flex flexWrap="wrap" justifyContent="space-evenly">
//           <Button variant="tertiary" scale="sm" onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '25')}>
//             25%
//           </Button>
//           <Button variant="tertiary" scale="sm" onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '50')}>
//             50%
//           </Button>
//           <Button variant="tertiary" scale="sm" onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '75')}>
//             75%
//           </Button>
//           <Button variant="tertiary" scale="sm" onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}>
//             {t('Max')}
//           </Button>
//         </Flex>
//       </BorderCard>
//       <>
//         <ColumnCenter>
//           <ArrowDownIcon color="textSubtle" width="24px" my="16px" />
//         </ColumnCenter>
//         <AutoColumn gap="10px">
//           <Text bold color="secondary" fontSize="12px" textTransform="uppercase">
//             {t('Receive')}
//           </Text>
//           <LightGreyCard>
//             <Flex justifyContent="space-between" mb="8px" as="label" alignItems="center">
//               <Flex alignItems="center">
//                 {zapModeStatus && (
//                   <Flex mr="9px">
//                     <Checkbox
//                       disabled={isZapOutA}
//                       scale="sm"
//                       checked={removalCheckedA}
//                       onChange={(e) => setRemovalCheckedA(e.target.checked)}
//                     />
//                   </Flex>
//                 )}
//                 <CurrencyLogo currency={currencyA} />
//                 <Text small color="textSubtle" id="remove-liquidity-tokena-symbol" ml="4px">
//                   {currencyA?.symbol}
//                 </Text>
//               </Flex>
//               <Flex>
//                 <Text small bold>
//                   {formattedAmounts[Field.CURRENCY_A] || '0'}
//                 </Text>
//                 <Text small ml="4px">
//                   ({isZapOutA ? '100' : !isZap ? '50' : '0'}%)
//                 </Text>
//               </Flex>
//             </Flex>
//             <Flex justifyContent="space-between" as="label" alignItems="center">
//               <Flex alignItems="center">
//                 {zapModeStatus && (
//                   <Flex mr="9px">
//                     <Checkbox
//                       disabled={isZapOutB}
//                       scale="sm"
//                       checked={removalCheckedB}
//                       onChange={(e) => setRemovalCheckedB(e.target.checked)}
//                     />
//                   </Flex>
//                 )}
//                 <CurrencyLogo currency={currencyB} />
//                 <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
//                   {currencyB?.symbol}
//                 </Text>
//               </Flex>
//               <Flex>
//                 <Text bold small>
//                   {formattedAmounts[Field.CURRENCY_B] || '0'}
//                 </Text>
//                 <Text small ml="4px">
//                   ({isZapOutB ? '100' : !isZap ? '50' : '0'}%)
//                 </Text>
//               </Flex>
//             </Flex>
//             {chainId && (oneCurrencyIsWNative || oneCurrencyIsNative) ? (
//               <RowBetween style={{ justifyContent: 'flex-end', fontSize: '14px' }}>
//                 {oneCurrencyIsNative ? (
//                   <StyledInternalLink
//                     href={`/remove/${currencyA?.isNative ? WNATIVE[chainId]?.address : currencyIdA}/${
//                       currencyB?.isNative ? WNATIVE[chainId]?.address : currencyIdB
//                     }`}
//                   >
//                     {t('Receive %currency%', { currency: WNATIVE[chainId]?.symbol })}
//                   </StyledInternalLink>
//                 ) : oneCurrencyIsWNative ? (
//                   <StyledInternalLink
//                     href={`/remove/${currencyA && currencyA.equals(WNATIVE[chainId]) ? native?.symbol : currencyIdA}/${
//                       currencyB && currencyB.equals(WNATIVE[chainId]) ? native?.symbol : currencyIdB
//                     }`}
//                   >
//                     {t('Receive %currency%', { currency: native?.symbol })}
//                   </StyledInternalLink>
//                 ) : null}
//               </RowBetween>
//             ) : null}
//           </LightGreyCard>
//         </AutoColumn>
//       </>
//     </>
//   )
// }

// export default SimpleRemoveForm
