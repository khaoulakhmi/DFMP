import { toaster } from "./toaster-instance"
import { CustomToast } from "./customToaster"
import { Toaster as ChakraToaster, Portal } from "@chakra-ui/react"

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast) => {
          console.log("Rendering toast:", toast)
          return (
            <CustomToast
              title={String(toast.title ?? "")}
              {...(toast.description && { description: String(toast.description) })}
              status={toast.type as "success" | "error" | "warning" | "info"}
            />
          )
        }}
      </ChakraToaster>
    </Portal>
  )
}