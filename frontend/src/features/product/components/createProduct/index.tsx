import type { StepperItem } from "@/shared/components/molecules/stepper"
import { Box } from "@chakra-ui/react"
import GeneralInfo from "./steps/generalInformation"
import Pricing from "./steps/pricing"
import Quantity from "./steps/quantity"
import Stepper from "@/shared/components/molecules/stepper"



const CreateProductPage = () => {

    const steps: StepperItem[] =[
        {title: "general", content: <GeneralInfo/> },
        {title: "pricing", content: <Pricing/>},
        {title: "quantity", content: <Quantity/>}
    ]
    return(
        <Box>
            <Stepper
                steps={steps} 
            />
        </Box>
    )
}


export default CreateProductPage