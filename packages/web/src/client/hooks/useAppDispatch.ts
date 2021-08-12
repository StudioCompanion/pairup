import { useDispatch } from 'react-redux'

import { AppDispatch } from 'store/createStore'

// Export a hook that can be reused to resolve types
export const useAppDispatch = () => useDispatch<AppDispatch>()
