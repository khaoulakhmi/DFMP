import {type ReactNode } from "react"
import { ChakraProvider } from "@chakra-ui/react"
import { system } from "../../shared/theme"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


interface Props {
  children?: ReactNode
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false
        }
    }
})

export const AppProviders = ({ children }: Props) => {
  return (
    <ChakraProvider value={system}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ChakraProvider>
  )
}