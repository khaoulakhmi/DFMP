import { Box, type BoxProps, chakra } from "@chakra-ui/react"
import Typography from "../../atoms/typography"
import type { ReactNode } from "react"

// Create a styled label component
const StyledLabel = chakra('label', {
    base: {
        fontSize: 'sm',
        fontWeight: 'medium',
        cursor: 'pointer',
    },
})

export interface FormFieldProps extends BoxProps {
    label?: string | undefined,
    helper?: string ,
    error?: string,
    required?: boolean,
    children: ReactNode,
    labelFor?: string | undefined,
    showRequiredIndicator?: boolean
}

const FormField = ({ 
    label = "", 
    helper = "", 
    error = "", 
    required = false,
    showRequiredIndicator = false,
    children, 
    labelFor,
    ...rest 
}: FormFieldProps) => {

    return(
        <Box width="100%" mb={4} {...rest}>
            {label && (
                <Box mb={1} display="flex" alignItems="center">
                    <StyledLabel 
                        htmlFor={labelFor}
                        color={error ? "fg.error" : "fg.default"}
                    >
                        {label}
                        {required && showRequiredIndicator && (
                            <Typography 
                                as="span" 
                                variant="label" 
                                color="fg.error" 
                                ml={1}
                            >
                                *
                            </Typography>
                        )}
                    </StyledLabel>
                </Box>
            )}
            
            {/* Use CSS object for child styling */}
            <Box 
                role="group"
                css={{
                    '& > input, & > select, & > textarea': {
                        borderColor: error ? 'var(--chakra-colors-border-error)' : 'var(--chakra-colors-border-default)',
                        '&:focus': {
                            borderColor: error ? 'var(--chakra-colors-border-error)' : 'var(--chakra-colors-border-focus)',
                            boxShadow: error ? '0 0 0 1px var(--chakra-colors-border-error)' : '0 0 0 1px var(--chakra-colors-border-focus)'
                        },
                        '&:hover': {
                            borderColor: error ? 'var(--chakra-colors-border-error)' : 'var(--chakra-colors-border-hover)'
                        }
                    }
                }}
            >
                {children}
            </Box>
            
            {(helper || error) && (
                <Box mt={1} minHeight="20px">
                    {error ? (
                        <Typography 
                            variant="caption" 
                            color="fg.error"
                            role="alert"
                        >
                            {error}
                        </Typography>
                    ) : helper && (
                        <Typography 
                            variant="caption" 
                            color="fg.muted"
                        >
                            {helper}
                        </Typography>
                    )}
                </Box>
            )}
        </Box>
    )
}

export default FormField