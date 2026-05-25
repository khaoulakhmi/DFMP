import { Box } from "@chakra-ui/react"
import { forwardRef, useState } from "react"

interface SwitchProps {
  checked?: boolean | undefined
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  size?: "sm" | "md" | "lg"
  label?: string
  name?: string
}

const sizeConfig = {
  sm: { w: 32, h: 18, thumb: 14 },
  md: { w: 40, h: 22, thumb: 18 },
  lg: { w: 48, h: 26, thumb: 22 },
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = "md",
  label,
  name,
}, ref) => {

  const isControlled = checked !== undefined
  const [internal, setInternal] = useState(defaultChecked)
  const isOn = isControlled ? checked : internal

  const config = sizeConfig[size]

  const handleToggle = () => {
    if (disabled) return
    const next = !isOn
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  return (
    <Box
      display="inline-flex"
      alignItems="center"
      gap={3}
      cursor={disabled ? "not-allowed" : "pointer"}
      opacity={disabled ? 0.5 : 1}
      onClick={handleToggle}
    >

      {/* Hidden input */}
      <input
        ref={ref}
        type="checkbox"
        name={name}
        checked={isOn}
        readOnly
        style={{ display: "none" }}
      />

      {/* Track */}
      <Box
        width={`${config.w}px`}
        height={`${config.h}px`}
        borderRadius="full"
        bg={isOn ? "success.500" : "neutral.300"}
        position="relative"
        transition="all 0.25s ease"
        boxShadow="inset 0 0 0 1px rgba(0,0,0,0.05)"
        _hover={!disabled ? {
          bg: isOn ? "success.600" : "neutral.400"
        } : {}}
        _focusWithin={{
          boxShadow: "0 0 0 3px rgba(47,156,109,0.25)"
        }}
      >

        {/* Thumb */}
        <Box
          position="absolute"
          top="50%"
          left="2px"
          transform={`translate(${isOn ? config.w - config.thumb - 4 : 0}px, -50%)`}
          width={`${config.thumb}px`}
          height={`${config.thumb}px`}
          borderRadius="full"
          bg="white"
          transition="transform 0.25s ease"
          boxShadow="0 2px 6px rgba(0,0,0,0.15)"
        />
      </Box>

      {/* Label */}
      {label && (
        <Box
          fontSize="sm"
          fontWeight="medium"
          color="text.secondary"
        >
          {label}
        </Box>
      )}
    </Box>
  )
})

Switch.displayName = "Switch"
export default Switch