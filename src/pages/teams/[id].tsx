import React from 'react'
// eslint-disable-next-line camelcase
import { SWRConfig, unstable_serialize } from 'swr'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import TeamPageRouter from 'views/Teams/TeamPageRouter'
import teams from 'config/constants/teams'
import { getTeam } from 'state/teams/helpers'
import { teamsById } from 'utils/teamsById'

const TeamPage = ({ fallback }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <SWRConfig
      value={{
        fallback,
      }}
    >
      <TeamPageRouter />
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

  const idNumber = Number(id)

  const isValidTeamId = teams.findIndex((team) => team.id === idNumber) !== -1
  if (!isValidTeamId) {
    return {
      notFound: true,
    }
  }

  const fetchedTeam = await getTeam(idNumber)
  if (!fetchedTeam) {
    return {
      props: {
        fallback: {
          [unstable_serialize(['team', id])]: teamsById[id],
        },
      },
      revalidate: 1,
    }
  }

  return {
    props: {
      fallback: {
        [unstable_serialize(['team', id])]: fetchedTeam,
      },
    },
    revalidate: 60 * 60, // 1 hour
  }
}

export default TeamPage
