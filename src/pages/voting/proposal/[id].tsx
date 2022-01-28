import React from 'react'
// eslint-disable-next-line camelcase
import { SWRConfig, unstable_serialize } from 'swr'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { getProposal } from 'state/voting/helpers'
import ProposalPageRouter from 'views/Voting/Proposal'

const ProposalPage = ({ fallback }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <SWRConfig
      value={{
        fallback,
      }}
    >
      <ProposalPageRouter />
    </SWRConfig>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    fallback: true,
    paths: [],
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params
  if (typeof id !== 'string') {
    return {
      notFound: true,
    }
  }

  try {
    const fetchedProposal = await getProposal(id)
    if (!fetchedProposal) {
      return {
        notFound: true,
        revalidate: 1,
      }
    }
    return {
      props: {
        fallback: {
          [unstable_serialize(['proposal', id])]: fetchedProposal,
        },
      },
      revalidate: 60 * 60 * 12, // 12 hour
    }
  } catch (error) {
    return {
      props: {},
      revalidate: 60,
    }
  }
}

export default ProposalPage
