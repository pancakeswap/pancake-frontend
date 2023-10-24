// eslint-disable-next-line camelcase
import { GetStaticPaths, GetStaticProps } from 'next'
import TeamPageRouter from 'views/Teams/TeamPageRouter'
import teams from 'config/constants/teams'
import { getTeam } from 'state/teams/helpers'
import { teamsById } from 'utils/teamsById'
import { dehydrate, QueryClient } from '@tanstack/react-query'

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
  const { id } = params
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

  const fetchedTeam = await queryClient.fetchQuery(['team', id], () => getTeam(idNumber))

  if (!fetchedTeam) {
    await queryClient.prefetchQuery(['team', id], () => teamsById[id])

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
