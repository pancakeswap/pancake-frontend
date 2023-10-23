import { dehydrate, QueryClient } from '@tanstack/react-query'
import { GetStaticProps } from 'next'
import { teamsById } from 'utils/teamsById'
import { getTeams } from 'state/teams/helpers'
import Teams from '../../views/Teams'

const TeamsPage = () => {
  return <Teams />
}

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient()

  const fetchedTeams = await queryClient.fetchQuery(['teams'], getTeams)

  if (fetchedTeams) {
    await queryClient.prefetchQuery(['teams'], () => teamsById)
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
      revalidate: 1,
    }
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60 * 60 * 12,
  }
}

export default TeamsPage
