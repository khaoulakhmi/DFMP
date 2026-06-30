import {type ReactNode } from "react"
import { ChakraProvider } from "@chakra-ui/react"
import { system } from "../../shared/theme"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nProvider } from "@/shared/i18n/I18nContext"


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
    <I18nProvider>
      <ChakraProvider value={system}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ChakraProvider>
    </I18nProvider>
  )
}
