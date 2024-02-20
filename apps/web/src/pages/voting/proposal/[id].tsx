// eslint-disable-next-line camelcase
import { QueryClient, dehydrate } from '@tanstack/react-query'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { NextSeo } from 'next-seo'
import { ProposalState } from 'state/types'
import { getProposal } from 'state/voting/helpers'
import Overview from 'views/Voting/Proposal/Overview'

const ProposalPage = () => {
  return <Overview />
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    fallback: true,
    paths: [],
  }
}

ProposalPage.Meta = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  if (props.id && props.dehydratedState?.queries?.[0]?.state?.data) {
    // @ts-ignore
    const title = props.dehydratedState?.queries?.[0]?.state?.data?.ttile
    if (title) {
      return (
        <NextSeo
          openGraph={{
            description: title,
          }}
        />
      )
    }
  }
  return null
}

export const getStaticProps = (async ({ params }) => {
  const queryClient = new QueryClient()
  const id = params?.id
  if (typeof id !== 'string') {
    return {
      notFound: true,
    }
  }

  try {
    const fetchedProposal = await queryClient.fetchQuery({
      queryKey: ['voting', 'proposal', id],
      queryFn: () => getProposal(id),
    })
    if (!fetchedProposal) {
      return {
        notFound: true,
        revalidate: 1,
      }
    }
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
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
        dehydratedState: dehydrate(queryClient),
        id,
      },
      revalidate: 60,
    }
  }
}) satisfies GetStaticProps

export default ProposalPage
