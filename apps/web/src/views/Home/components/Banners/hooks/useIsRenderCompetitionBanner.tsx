import { useCompetitionStatus } from 'components/Menu/hooks/useCompetitionStatus'

const useIsRenderCompetitionBanner = () => {
  const competitionStatus = useCompetitionStatus()
  return competitionStatus !== null
}

export default useIsRenderCompetitionBanner
