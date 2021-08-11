import { TypedUseSelectorHook, useSelector } from 'react-redux'

import { RootState } from 'store/createStore'

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector
