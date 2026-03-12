import {
  RadioGroup, HStack
} from '@chakra-ui/react'
import Typography from './typography';


interface RadioProps extends Omit<RadioGroup.RootProps, 'variant'> {
  items: { value: string; label: string }[]
  variant?: 'outline' | 'filled' | 'solid'
}


const Radio = ({items, variant = "outline" , ...props}: RadioProps) => {

const getVariantStyles = (variant: RadioProps['variant']) => {
  switch (variant) {
    case 'outline':
      return {
        // Unchecked state
        border: '2px solid',
        borderColor: 'neutral.300',
        bg: 'transparent',
        color: 'neutral.700',
        transition: 'all 0.2s',
        
        _hover: {
          borderColor: 'primary.400',
          bg: 'primary.50',
        },
        
        // Checked state - filled with primary color
        _checked: {
          bg: 'primary.500',
          borderColor: 'primary.500',
          color: 'white',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          
          _hover: {
            bg: 'primary.600',
            borderColor: 'primary.600',
          },
        },
        
        _focus: {
          boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.3)',
          outline: 'none',
        },
        
        _disabled: {
          opacity: 0.5,
          cursor: 'not-allowed',
          borderColor: 'neutral.200',
          bg: 'neutral.100',
          _hover: {
            borderColor: 'neutral.200',
            bg: 'neutral.100',
          },
          _checked: {
            bg: 'neutral.400',
            borderColor: 'neutral.400',
          },
        },
      }

    case 'filled':
      return {
        // Unchecked state - subtle background
        bg: 'neutral.300',
        border: '2px solid',
        borderColor: 'transparent',
        color: 'neutral.700',
        transition: 'all 0.2s',
        
        _hover: {
          bg: 'neutral.200',
        },
        
        // Checked state - pill style with no outline, just background
        _checked: {
          bg: 'primary.100',
          color: 'primary.700',
          borderColor: 'primary.200',
          fontWeight: 'medium',
          
          _hover: {
            bg: 'primary.200',
          },
        },
        
        _focus: {
          boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.3)',
          outline: 'none',
        },
        
        _disabled: {
          opacity: 0.5,
          cursor: 'not-allowed',
          bg: 'neutral.100',
          _hover: {
            bg: 'neutral.100',
          },
          _checked: {
            bg: 'neutral.300',
            color: 'neutral.500',
            borderColor: 'neutral.300',
          },
        },
      }

    case 'solid':
      return {
        // Unchecked state - card-like with border and shadow
        bg: 'white',
        border: '2px solid',
        borderColor: 'neutral.200',
        color: 'neutral.700',
        boxShadow: 'sm',
        transition: 'all 0.2s',
        
        _hover: {
          borderColor: 'primary.300',
          boxShadow: 'md',
          transform: 'translateY(-1px)',
        },
        
        // Checked state - elevated with colored border
        _checked: {
          bg: 'white',
          borderColor: 'primary.500',
          borderWidth: '2px',
          color: 'primary.700',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transform: 'translateY(-1px)',
          
          _hover: {
            borderColor: 'primary.600',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        },
        
        _focus: {
          boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.3)',
          outline: 'none',
        },
        
        _disabled: {
          opacity: 0.5,
          cursor: 'not-allowed',
          bg: 'neutral.50',
          borderColor: 'neutral.200',
          boxShadow: 'none',
          transform: 'none',
          _hover: {
            borderColor: 'neutral.200',
            bg: 'neutral.50',
            transform: 'none',
          },
          _checked: {
            bg: 'neutral.100',
            borderColor: 'neutral.400',
            color: 'neutral.500',
            boxShadow: 'none',
          },
        },
      }

    default:
      return {}
  }
}



  return (
    <RadioGroup.Root {...props}>
      <HStack gap="6">
        {items.map((item) => (
          <RadioGroup.Item key={item.value} value={item.value}>
            <RadioGroup.ItemHiddenInput />
            <RadioGroup.ItemIndicator {...getVariantStyles(variant)}/>
            <RadioGroup.ItemText>
              <Typography variant="body-sm" color="neutral.700">
                {item.label}
              </Typography>
            </RadioGroup.ItemText>
          </RadioGroup.Item>
        ))}
      </HStack>
    </RadioGroup.Root>
  )
}


export default Radio