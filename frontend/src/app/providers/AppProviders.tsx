import {type ReactNode } from "react"
import { Button, ChakraProvider } from "@chakra-ui/react"
import { BrowserRouter } from "react-router-dom"
import { system } from "../../shared/theme"

interface Props {
  children: ReactNode
}

export const AppProviders = ({ children }: Props) => {
  return (
    <ChakraProvider value={system}>
      <BrowserRouter>
        {children}
        <Button variant="primary">Save</Button>
        <Button variant="secondary">Cancel</Button>
        <Button variant="accent">Upgrade</Button>
        <Button variant="danger">Delete</Button>
        <Button variant="ghost">Back</Button>
      </BrowserRouter>
    </ChakraProvider>
  )
}