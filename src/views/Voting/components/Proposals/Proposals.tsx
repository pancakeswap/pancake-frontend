import React, { useEffect, useState } from 'react'
import { Card, Flex, Heading, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/layout/Container'
import { Proposal, ProposalState, ProposalType } from '../../types'
import { filterProposalsByType, getProposals } from '../../helpers'
import ProposalsLoading from './ProposalsLoading'
import TabMenu from './TabMenu'
import ProposalRow from './ProposalRow'

enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  ERROR = 'error',
}

interface State {
  loadingState: LoadingState
  proposalType: ProposalType
  filterState: ProposalState
  proposals: Proposal[]
}

const Proposals = () => {
  const { t } = useTranslation()
  const [state, setState] = useState<State>({
    loadingState: LoadingState.LOADING,
    proposalType: ProposalType.CORE,
    filterState: ProposalState.ACTIVE,
    proposals: [],
  })
  const { loadingState, proposalType, filterState, proposals } = state

  useEffect(() => {
    const fetchProposals = async () => {
      const data = await getProposals(100, 0, filterState)
      setState((prevState) => ({
        ...prevState,
        loadingState: LoadingState.IDLE,
        proposals: data,
      }))
    }

    fetchProposals()
  }, [setState, filterState])

  const handleProposalTypeChange = (newProposalType: ProposalType) => {
    setState((prevState) => ({
      ...prevState,
      proposalType: newProposalType,
    }))
  }

  const filteredProposals = filterProposalsByType(proposals, proposalType)

  return (
    <Container py="40px">
      <Heading as="h2" scale="xl" mb="32px">
        {t('Proposals')}
      </Heading>
      <Card>
        <TabMenu proposalType={proposalType} onTypeChange={handleProposalTypeChange} />
        {loadingState === LoadingState.LOADING && <ProposalsLoading />}
        {loadingState === LoadingState.IDLE &&
          filteredProposals.length > 0 &&
          filteredProposals.map((proposal) => {
            return <ProposalRow key={proposal.id} proposal={proposal} />
          })}
        {loadingState === LoadingState.IDLE && filteredProposals.length === 0 && (
          <Flex alignItems="center" justifyContent="center" p="32px">
            <Text fontSize="24px">{t('No proposals found')}</Text>
          </Flex>
        )}
      </Card>
    </Container>
  )
}

export default Proposals
