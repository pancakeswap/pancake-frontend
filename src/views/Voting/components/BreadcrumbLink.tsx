import { Link } from 'react-router-dom'
import styled from 'styled-components'

const BreadcrumbLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primaryBright};
`

export default BreadcrumbLink
