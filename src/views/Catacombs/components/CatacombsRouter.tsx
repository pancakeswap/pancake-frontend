import { useTranslation } from 'contexts/Localization'
import React from 'react'
import { Router, Route, Switch, useRouteMatch } from 'react-router-dom'
import Home from './Home/Home'
import { CatacombsRoutes } from '../../../../src/components/Catacombs/Menu/catacombs_routes'
import Barracks from './Barracks/Barracks'
import RugRoll from './RugRoll/RugRoll'
import BlackMarket from './BlackMarket/BlackMarket'
import DataLab from './DataLab/DataLab'
import Menu from '../../../components/Catacombs/Menu'
import Page from '../../../components/layout/Page'

const CatacombsRouter: React.FC = (props) => {
  let { path, url } = useRouteMatch();
  console.log(props)
  console.log(path + '/' + CatacombsRoutes.BARRACKS, ' < ======= path')
  console.log(url, ' < ======= url')
  return (
    <Menu>
        <Page>
          <div>
            <Route exact path={path}><Home /></Route>
            <Route exact path={path + '/' + CatacombsRoutes.BARRACKS}><Barracks /></Route>
            <Route exact path={CatacombsRoutes.RUGROLL}><RugRoll /></Route>
            <Route exact path={CatacombsRoutes.DATALAB}><DataLab /></Route>
            <Route exact path={CatacombsRoutes.BLACKMARKET}><BlackMarket /></Route>
          </div>
        </Page>
    </Menu>
  )
}

export default CatacombsRouter