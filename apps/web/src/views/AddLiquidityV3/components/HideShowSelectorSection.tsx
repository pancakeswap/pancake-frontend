import { AutoRow, Button, ChevronDownIcon } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import { Dispatch, ReactNode, SetStateAction } from 'react'

interface HideShowSelectorSectionPropsType {
  noHideButton?: boolean
  showOptions: boolean
  setShowOptions: Dispatch<SetStateAction<boolean>>
  heading: ReactNode
  content: ReactNode
}

export default function HideShowSelectorSection({
  noHideButton,
  showOptions,
  setShowOptions,
  heading,
  content,
}: HideShowSelectorSectionPropsType) {
  return (
    <LightGreyCard padding="8px" style={{ height: 'fit-content' }}>
      <AutoRow justifyContent="space-between" marginBottom={showOptions ? '8px' : '0px'}>
        {heading ?? <div />}
        {noHideButton || (
          <Button
            scale="sm"
            onClick={() => setShowOptions((prev) => !prev)}
            variant="text"
            endIcon={
              !showOptions && (
                <ChevronDownIcon
                  style={{
                    marginLeft: '0px',
                  }}
                  color="primary"
                />
              )
            }
          >
            {showOptions ? 'Hide' : 'More'}
          </Button>
        )}
      </AutoRow>
      {showOptions && content}
    </LightGreyCard>
  )
}
