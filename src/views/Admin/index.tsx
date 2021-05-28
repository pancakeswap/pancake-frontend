import React, { useState } from 'react'
import { getContract, getMasterchefContract, getRestorationChefContract } from 'utils/contractHelpers'
import { Heading, Flex, Image, Button, Input } from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/layout/Page'
import PageHeader from 'components/PageHeader'
import { useWeb3React } from '@web3-react/core'
import GraveAbi from './abis/GraveAbi.json'
import TokenAbi from './abis/TokenAbi.json'
import MasterChefAbi from './abis/MasterChef.json'
import UndeadBarAbi from './abis/UndeadBarAbi.json'
import RestorationChefAbi from './abis/RestorationChefAbi.json'
import useWeb3 from '../../hooks/useWeb3'
import { BIG_TEN } from '../../utils/bigNumber'
import { getRestorationChefAddress } from '../../utils/addressHelpers'

const ZombieContract = '0xf3A3a31b90BE814A45170CbC9df0678219c03656'
const RuggedTokenContract = '0x3F70d41e27a46C31f7304954306c7DCb1503e3A9'
const BusdContract = '0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee'
const GraveContract = '0x55cb5A03F9fFa44FC851BC8212E1e38a85096Ae0'
const MasterChefContract = '0x61dd856CF7eC5627083BD4EED64592B5796f0300'
const UndeadBarContract = '0x5C90E0e9988587E748ca2C434A5582aAe6433ceE'
let web3

let grave
let zombie
let ruggedToken
let busd
let undeadBar
let masterChef
let restorationChef
let ruggedTokenAmount
let zombieAmount
let stakingAmount
let accountAddress
const ONE = BIG_TEN.pow(18)

async function InitWeb3() {
  web3 = useWeb3()
   const { account } = useWeb3React()
  accountAddress = account
  // grave = getContract(GraveAbi, GraveContract, web3)
  // zombie = getContract(TokenAbi, ZombieContract, web3)
  // ruggedToken = getContract(TokenAbi, RuggedTokenContract, web3)
  busd = getContract(TokenAbi, BusdContract, web3)
  // masterChef = getContract(MasterChefAbi, MasterChefContract, web3)
  // busd = getContract(TokenAbi, BusdContract, web3)
  // undeadBar = getContract(UndeadBarAbi, UndeadBarContract, web3)
  restorationChef = getContract(RestorationChefAbi,getRestorationChefAddress(), web3)
}

//
// async function MintZombie() {
//   await zombie.methods.mint(account, ONE.times(10000)).send({ from: account })
//     .then(() => {
//       console.log('Minted Zombie')
//     })
//     .catch(() => {
//       console.log('Failed to Mint Zombie')
//     })
// }
//
// async function MintRuggedToken() {
//   await ruggedToken.methods.mint(account, ONE.times(1000)).send({ from: account })
//     .then(() => {
//       console.log('Minted RuggedToken')
//     })
//     .catch(() => {
//       console.log('Failed to Mint RuggedToken')
//     })
// }
//
// async function ApproveZombie() {
//   await zombie.methods.approve(GraveContract, ONE.times(999999)).send({ from: account })
//     .then(() => {
//       console.log('Approved Zombie for grave')
//     })
//     .catch(() => {
//       console.log('Failed to approve zombie')
//     })
// }
//
// async function ApproveZombieMasterChef() {
//   await zombie.methods.approve(MasterChefContract, ONE.times(999999)).send({ from: account })
//     .then(() => {
//       console.log('Approved Zombie for masterchef')
//     })
//     .catch(() => {
//       console.log('Failed to approve zombie')
//     })
// }
//
// async function ApproveRug() {
//   await ruggedToken.methods.approve(GraveContract, ONE.times(999999)).send({ from: account })
//     .then(() => {
//       console.log('Approved rugged token for grave')
//     })
//     .catch(() => {
//       console.log('Failed to approve rugged token')
//     })
// }
//
//
async function ApproveBusd() {
  await busd.methods.approve(getRestorationChefAddress(), ONE.times(999999)).send({ from: accountAddress })
    .then(() => {
      console.log('Approved busd for grave')
    })
    .catch(() => {
      console.log('Failed to approve busd')
    })
}
//
// async function PayUnlockFee() {
//   await grave.methods.unlock().send({ from: account })
//     .then(() => {
//       console.log('Grave successfully unlocked')
//     })
//     .catch(() => {
//       console.log('Failed unlock grave')
//     })
// }
//
async function DepositRuggedToken() {
  await restorationChef.methods.depositRug(0, ONE.times(ruggedTokenAmount)).send({ from: accountAddress })
    .then(() => {
      console.log('Deposited RuggedToken')
    })
    .catch((res) => {
      console.log(res)
    })
}

async function StakeZombie() {
  await restorationChef.methods.stakeZombie(0, ONE.times(zombieAmount)).send({ from: accountAddress })
    .then(() => {
      console.log('Stake Zombie')
    })
    .catch((res) => {
      console.log(res)
    })
}

// async function WithdrawZombie() {
//   await grave.methods.withdrawZombie().send({ from: account })
//     .then(() => {
//       console.log('Withdrew Zombie')
//     })
//     .catch(() => {
//       console.log('Failed to Mint RuggedToken')
//     })
// }
//
// async function WithdrawZombieEarly() {
//   await grave.methods.withdrawZombieEarly().send({ from: account })
//     .then(() => {
//       console.log('Withdraw Zombie')
//     })
//     .catch(() => {
//       console.log('Failed to Mint RuggedToken')
//     })
// }
//
// async function MintNft() {
//   await grave.methods.mintNft().send({ from: account })
//     .then(() => {
//       console.log('Minted Nft')
//     })
//     .catch(() => {
//       console.log('Failed to Mint Nft')
//     })
// }
//
async function getUserInfo(setState) {
  if(typeof accountAddress !== "undefined")
  await restorationChef.methods.userInfo(0, accountAddress).call()
    .then((data) => {
      setState(data)
      console.log(data)
    })
    .catch(() => {
      console.log('Failed to get amount of rug deposited')
    })
}

// async function getAmountOfZombieDeposited(setState) {
//   grave.methods.amountOfZombieStaked(account).call()
//     .then((amount) => {
//       setState(amount / 10 ** 18)
//     })
//     .catch(() => {
//       console.log('Failed to get amount of zombie deposited')
//     })
// }
//
// async function getWithdrawalDate(setState) {
//   grave.methods.withdrawalDate(account).call()
//     .then((amount) => {
//       setState(amount)
//     })
//     .catch(() => {
//       console.log('Failed to get withdrawal date')
//     })
// }
//
// async function getTreasury(setState) {
//   grave.methods.treasury().call()
//     .then((amount) => {
//       setState(amount / 10 ** 18)
//     })
//     .catch(() => {
//       console.log('Failed to get withdrawal date')
//     })
// }

// async function getMinimumStake(setState) {
//   grave.methods.minimumStake().call()
//     .then((amount) => {
//       setState(amount / 10 ** 18)
//     })
//     .catch(() => {
//       console.log('Failed to get minimum stake')
//     })
// }
//
// async function getUnlockingFee(setState) {
//   grave.methods.unlockingFee().call()
//     .then((amount) => {
//       setState(amount / 10 ** 18)
//     })
//     .catch(() => {
//       console.log('Failed to get unlocking fee')
//     })
// }
//
// async function getZombieAllowance(setState) {
//   zombie.methods.allowance(account, GraveContract).call()
//     .then((amount) => {
//       setState(amount / 10 ** 18)
//     })
//     .catch(() => {
//       console.log('Failed to get zombie allowance')
//     })
// }
//
// async function TransferOwnership() {
//   await zombie.methods.transferOwnership(MasterChefContract).send({ from: account })
//     .then(() => {
//       console.log('Zombie ownership transferred to masterchef')
//     })
//     .catch(() => {
//       console.log('Failed to transfer ownership')
//     })
//
//   await undeadBar.methods.transferOwnership(MasterChefContract).send({ from: account })
//     .then(() => {
//       console.log('UndeadBar ownership transferred to masterchef')
//     })
//     .catch(() => {
//       console.log('Failed to transfer ownership')
//     })
// }
//
// async function EnterStaking() {
//   await masterChef.methods.enterStaking(ONE.times(stakingAmount)).send({ from: account })
//     .then(() => {
//       console.log('entered staking')
//     })
//     .catch(() => {
//       console.log('Failed to enter staking')
//     })
// }
//
// async function LeaveStaking() {
//   await masterChef.methods.leaveStaking(ONE.times(stakingAmount)).send({ from: account })
//     .then(() => {
//       console.log('left staking')
//     })
//     .catch(() => {
//       console.log('Failed to leave staking')
//     })
// }
//
// async function UpdatePool() {
//   await masterChef.methods.updatePool(0).send({ from: account })
//     .then(() => {
//       console.log('updated pool')
//     })
//     .catch(() => {
//       console.log('Failed to update pool')
//     })
// }

async function AddGrave() {
  await restorationChef.methods.add(
    RuggedTokenContract,
    10,
    500,
    2592000, // 30 days
    '0x1b709Eb1a00DD8b77D759cEF81Ef75Bdd0e55128',
  ).send({ from: accountAddress })
    .then((res) => {
      console.log('created grave')
      console.log(res)
    })
    .catch((res) => {
      console.log(res)
    })
}

// function getUserInfo() {
//   restorationChef.methods.userInfo(0, account).call()
//     .then((data) => {
//       // setState(data)
//       console.log('itworked')
//       console.log(data)
//     })
//     .catch((res) => {
//       console.log(res)
//     })
// }

function getgraveInfo() {
  restorationChef.methods.graveInfo(0).call()
    .then((data) => {
      // setState(data)
      // console.log('itworked')
      // console.log(data)
    })
    .catch((res) => {
      console.log(res)
    })
}

// async function getUserInfo(setState) {
//   masterChef.methods.userInfo(0).call()
//     .then((amount) => {
//       setState(amount.amount / 10 ** 18)
//     })
//     .catch(() => {
//       console.log('Failed to get zombie allowance')
//     })
// }
//
// async function getPoolInfo(setState) {
//   masterChef.methods.poolInfo(0).call()
//     .then((amount) => {
//       // setState(amount / 10 ** 18)
//       // console.log(amount)
//     })
//     .catch(() => {
//       console.log('Failed to get zombie allowance')
//     })
// }
//
// async function getPendingRewards(setState) {
//   masterChef.methods.pendingCake(0, account).call()
//     .then((amount) => {
//       setState(amount / 10 ** 18)
//     })
//     .catch(() => {
//       console.log('Failed to get zombie allowance')
//     })
// }
//
// async function getAmountStaked(setState) {
//   masterChef.methods.pendingCake(0, account).call()
//     .then((amount) => {
//       setState(amount / 10 ** 18)
//     })
//     .catch(() => {
//       console.log('Failed to get zombie allowance')
//     })
// }

const onChangeZombieAmount = (e) => {
  zombieAmount = e.currentTarget.value
}

const onChangeRuggedTokenAmount = (e) => {
  ruggedTokenAmount = e.currentTarget.value
}

const onChangeStakingAmount = (e) => {
  stakingAmount = e.currentTarget.value
}

const Admin: React.FC = () => {
  const { t } = useTranslation()
  const [resultZombieDeposited, setResultZombieDeposited] = useState(0)
  const [withdrawDate, setWithdrawDate] = useState(0)
  const [treasury, setTreasury] = useState(0)
  const [minimumStake, setMinimumStake] = useState(0)
  const [unlockingFee, setUnlockingFee] = useState(0)
  const [zombieAllowance, setZombieAllowance] = useState(0)
  const [userInfo, setUserInfo] = useState({
    rugDeposited: 0,
    zombieStaked: 0,
  })
  const [poolInfo, setPoolInfo] = useState(0)
  const [pendingRewards, setPendingRewards] = useState(1)

  InitWeb3()
  // getUserInfo()
  // getgraveInfo()
  // getUserInfo(setUserInfo)
  // getAmountOfZombieDeposited(setResultZombieDeposited)
  // getTreasury(setTreasury)
  // getWithdrawalDate(setWithdrawDate)
  // getMinimumStake(setMinimumStake)
  // getUnlockingFee(setUnlockingFee)
  // getZombieAllowance(setZombieAllowance)
  // getUserInfo(setUserInfo)
  // getPoolInfo(setPoolInfo)
  // getPendingRewards(setPendingRewards)
  const backgroundColor = '#101820'

  return (
    <>
      <PageHeader background={backgroundColor}>
        <Flex justifyContent='space-between' flexDirection={['column', null, 'row']}>
          <Flex flexDirection='column' mr={['8px', 0]}>
            <Heading as='h1' size='xxl' color='secondary' mb='24px'>
              {t('Admin')}
            </Heading>
            <Heading size='md' color='text'>
              {t('For Dev contract testing.')}
            </Heading>
            <Heading size='md' color='text'>
              {t('Please return to the homepage.')}
            </Heading>
            <Heading size='md' color='text'>
              {t('WARNING: Interacting with contracts on this page may result in the loss of some tokens')}
            </Heading>
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <Heading size='xl' color='text'>
          ResurrectionChef
        </Heading>
        <br />
        <Flex justifyContent='space-between'>
          <Button onClick={AddGrave}>ADD GRAVE</Button>
        </Flex>
        {/*  <Heading size='xl' color='text'> */}
        {/*    MasterChef */}
        {/*  </Heading> */}
        {/*  <br /> */}
        {/*  <Flex justifyContent='space-between'> */}
        {/*    <Heading>Pending Rewards: {pendingRewards}</Heading> */}
        {/*    /!* <Heading>Amount Staked: {userInfo}</Heading> *!/ */}
        {/*  </Flex> */}
        {/*  <br/> */}
        {/*  <Flex justifyContent='space-between'> */}
        {/*    <Button onClick={TransferOwnership}>Transfer ZMBE & UNDEAD Ownership</Button> */}
        {/*    <Button onClick={ApproveZombieMasterChef}>APPROVE ZOMBIE(MASTERCHEF)</Button> */}
        {/*    <Button onClick={UpdatePool}>UPDATE POOL</Button> */}
        {/*  </Flex> */}
        {/*  <br/> */}
        {/*  <Flex justifyContent='space-between'> */}
        {/*  <Button onClick={EnterStaking}>STAKE</Button> */}
        {/*  <Button onClick={LeaveStaking}>UNSTAKE</Button> */}
        {/*  <Input style={{ width: '300px' }} type='number' inputMode='numeric' min='0' */}
        {/*         onChange={onChangeStakingAmount} */}
        {/*         placeholder='Amount to stake' */}
        {/*  /> */}
        {/* </Flex> */}
        {/*  <br /> */}
        {/*  <Heading size='xl' color='text'> */}
        {/*    Grave */}
        {/*  </Heading> */}
        {/*  <br/> */}
          <Flex justifyContent='space-between'>
            <Heading>Rug Deposited: {userInfo.rugDeposited / 10 ** 18}</Heading>
            <Heading>Zombie Deposited: {resultZombieDeposited}</Heading>
          </Flex>
          <br />
        {/*  <Flex justifyContent='space-between'> */}
        {/*    <Heading>Treasury: {treasury}</Heading> */}
        {/*    <Heading>Withdraw Date: {withdrawDate}</Heading> */}
        {/*  </Flex> */}
        {/*  <br /> */}
        {/*  <Flex justifyContent='space-between'> */}
        {/*    <Heading>Minimum Stake: {minimumStake} ZMBE</Heading> */}
        {/*    <Heading>Unlocking Fee: {unlockingFee} ZMBE</Heading> */}
        {/*    <Heading>Zombie Allowance: {zombieAllowance}</Heading> */}
        {/*  </Flex> */}
        {/*  <br /> */}
        {/*  <Flex justifyContent='space-between'> */}
        {/*    <Button onClick={MintZombie}>MINT ZOMBIE</Button> */}
        {/*    <Button onClick={MintRuggedToken}>MINT RUGGED TOKEN</Button> */}
        {/*  </Flex> */}
        {/*  <br /> */}
          <Flex justifyContent='space-between'>
            {/* <Button onClick={ApproveRug}>APPROVE RUGGED TOKEN</Button> */}
            {/* <Button onClick={ApproveZombie}>APPROVE ZOMBIE</Button> */}
            <Button onClick={ApproveBusd}>APPROVE BUSD</Button>
          </Flex>
          <br />
          <Flex justifyContent='space-between'>
            <Button onClick={DepositRuggedToken}>DEPOSIT RUGGED TOKEN</Button>
            <Input style={{ width: '300px' }} type='number' inputMode='numeric' min='0'
                   onChange={onChangeRuggedTokenAmount}
                   placeholder='Amount of Rug'
            />
          </Flex>
          <br />
        {/*  <Flex justifyContent='space-between'> */}
        {/*    <Button onClick={PayUnlockFee}>PAY UNLOCK FEE</Button> */}
        {/*  </Flex> */}
        {/*  <br /> */}
          <Flex justifyContent='space-between'>
            <Button onClick={StakeZombie}>STAKE ZOMBIE</Button>
            <Input style={{ width: '300px' }} type='number' inputMode='numeric' min='0' onChange={onChangeZombieAmount}
                   placeholder='Amount of Zombie Stake'
            />
          </Flex>
          <br />
        {/*  <Flex justifyContent='space-between'> */}
        {/*    <Button onClick={WithdrawZombie}>WITHDRAW ZOMBIE</Button> */}
        {/*    <Button onClick={WithdrawZombieEarly}>WITHDRAW ZOMBIE EARLY</Button> */}
        {/*    <Button onClick={MintNft}>MINT NFT</Button> */}
        {/*  </Flex> */}
      </Page>
    </>
  )
}

export default Admin
