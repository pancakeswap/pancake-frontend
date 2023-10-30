import { GetStaticPaths, GetStaticProps } from 'next'
import { GameType, GAMES_LIST, SUPPORTED_CHAIN_IDS } from '@pancakeswap/games'
import { GameProject } from 'components/Game/project'

const GameProjectPage = () => {
  return <GameProject />
}

GameProjectPage.chains = SUPPORTED_CHAIN_IDS

export default GameProjectPage

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const hasGameConfig: GameType | undefined = GAMES_LIST.find((i) => i.id === params?.projectId)

  if (!hasGameConfig) {
    return {
      redirect: {
        statusCode: 303,
        destination: `/`,
      },
    }
  }

  return {
    props: {},
  }
}
