import { dehydrate, QueryClient } from '@tanstack/react-query'
import { GetStaticProps } from 'next'
import { getTeams } from 'state/teams/helpers'
import { teamsById } from 'utils/teamsById'
import Teams from '../../views/Teams'

const TeamsPage = () => {
  return <Teams />
}

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient()

  const fetchedTeams = await queryClient.fetchQuery({ queryKey: ['teams'], queryFn: getTeams })

  if (fetchedTeams) {
    await queryClient.prefetchQuery({ queryKey: ['teams'], queryFn: () => teamsById })
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
