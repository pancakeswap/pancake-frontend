// eslint-disable-next-line camelcase
import { SWRConfig, unstable_serialize } from 'swr'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { NextSeo } from 'next-seo'
import { getProposal } from 'state/voting/helpers'
import { ProposalState } from 'state/types'
import Overview from 'views/Voting/Proposal/Overview'

const ProposalPage = ({ fallback = {} }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <SWRConfig
      value={{
        fallback,
      }}
    >
      <Overview />
    </SWRConfig>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    fallback: true,
    paths: [],
  }
}

ProposalPage.Meta = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  if (props.id && props.fallback[unstable_serialize(['proposal', props.id])]) {
    const proposal = props.fallback[unstable_serialize(['proposal', props.id])]
    return (
      <NextSeo
        openGraph={{
          description: proposal.title,
        }}
      />
    )
  }
  return null
}

export const getStaticProps = (async ({ params }) => {
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
        id,
      },
      revalidate:
        fetchedProposal.state === ProposalState.CLOSED
          ? 60 * 60 * 12 // 12 hour
          : 3,
    }
  } catch (error) {
    return {
      props: {
        fallback: {},
        id,
      },
      revalidate: 60,
    }
  }
}) satisfies GetStaticProps

export default ProposalPage
