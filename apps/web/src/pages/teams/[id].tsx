// eslint-disable-next-line camelcase
import { QueryClient, dehydrate } from '@tanstack/react-query'
import teams from 'config/constants/teams'
import { GetStaticPaths, GetStaticProps } from 'next'
import { getTeam } from 'state/teams/helpers'
import { teamsById } from 'utils/teamsById'
import TeamPageRouter from 'views/Teams/TeamPageRouter'

const TeamPage = () => {
  return <TeamPageRouter />
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    fallback: true,
    paths: [],
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const queryClient = new QueryClient()
  const id = params?.id
  if (typeof id !== 'string') {
    return {
      notFound: true,
    }
  }

  const idNumber = Number(id)

  const isValidTeamId = teams.findIndex((team) => team.id === idNumber) !== -1
  if (!isValidTeamId) {
    return {
      notFound: true,
    }
  }

  const fetchedTeam = await queryClient.fetchQuery({ queryKey: ['team', id], queryFn: () => getTeam(idNumber) })

  if (!fetchedTeam) {
    await queryClient.prefetchQuery({ queryKey: ['team', id], queryFn: () => teamsById[id] })

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
    revalidate: 60 * 60, // 1 hour
  }
}

export default TeamPage
