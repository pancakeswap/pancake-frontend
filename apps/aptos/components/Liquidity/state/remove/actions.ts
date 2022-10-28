import { createAction } from '@reduxjs/toolkit'
import { Field } from '../../type'

export const typeInput = createAction<{ field: Field; typedValue: string }>('burn/typeInputBurn')
