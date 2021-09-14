import React, { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'contexts/Localization'

interface SubMenuProps {
  activeIndex: number
  handleClick: Dispatch<SetStateAction<number>>
}

const SubMenu: React.FC<SubMenuProps> = ({ activeIndex, handleClick }) => {
  const { t } = useTranslation()
  console.log(activeIndex)
  return (
    <div>
      <span>{t('Items')}</span>
      <span>{t('Activity')}</span>
    </div>
  )
}

export default SubMenu
