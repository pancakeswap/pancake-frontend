import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { SWRConfig } from 'swr'
import Teams from '../../views/Teams'
import { getTeams } from '../../state/teams/helpers'
import { teamsById } from '../../utils/teamsById'

const TeamsPage = ({ fallback }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <SWRConfig
      value={{
        fallback,
      }}
    >
      <Teams />
    </SWRConfig>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const fetchedTeams = await getTeams()
  if (!fetchedTeams) {
    return {
      props: {
        fallback: {
          teams: teamsById,
        },
      },
      revalidate: 1,
    }
  }

  return {
    props: {
      fallback: {
        teams: fetchedTeams,
      },
    },
    revalidate: 60 * 60 * 12, // 12 hours
  }
}

export default TeamsPage
