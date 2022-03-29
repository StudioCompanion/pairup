import * as React from 'react'
import { Input } from 'native-base'

type PlaceholderProps = {
  placeholder: string
}
export const TextInput = ({ placeholder }: PlaceholderProps) => {
  return <Input variant="underlined" placeholder={placeholder} />
}
