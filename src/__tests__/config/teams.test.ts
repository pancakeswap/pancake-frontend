import teams from 'config/constants/teams'

describe('Config teams', () => {
  it.each(teams.map((team) => team.id))('Team #%d has an unique id', (id) => {
    const duplicates = teams.filter((t) => id === t.id)
    expect(duplicates).toHaveLength(1)
  })
})
