import {type ReactNode } from "react"
import { ChakraProvider } from "@chakra-ui/react"
import { BrowserRouter } from "react-router-dom"
import { system } from "../../shared/theme"

interface Props {
  children?: ReactNode
}

export const AppProviders = ({ children }: Props) => {
  return (
    <ChakraProvider value={system}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </ChakraProvider>
  )
}