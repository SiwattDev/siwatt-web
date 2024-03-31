import { Box, Button, Paper, Step, StepLabel, Stepper } from '@mui/material'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { BudgetContext } from '../../../../contexts/budgetContext'
import useUtilities from './../../../../hooks/useUtilities'
import StepConsumptionData from './Steps/StepConsumptionData'
import StepCustomerData from './Steps/StepCustomerData'
import StepKits from './Steps/StepKits'
import StepReview from './Steps/StepReview'
import StepValidation from './Steps/StepValidation'

const steps = [
    'Dados do Cliente',
    'Dados de Consumo',
    'Kit Fotovoltaico',
    'Validade',
    'Revisão',
]

function getStepContent(stepIndex) {
    switch (stepIndex) {
        case 0:
            return <StepCustomerData />
        case 1:
            return <StepConsumptionData />
        case 2:
            return <StepKits />
        case 3:
            return <StepValidation />
        case 4:
            return <StepReview />
        default:
            return 'Passo desconhecido'
    }
}

function CadastroDados() {
    const [activeStep, setActiveStep] = useState(0)
    const { budget } = useContext(BudgetContext)
    const { showToastMessage } = useUtilities()
    const navigate = useNavigate()

    const handleNext = () => {
        let error = ''
        switch (activeStep) {
            case 0:
                if (!budget || !budget?.client)
                    error = 'Nenhum cliente selecionado.'
                break
            case 1:
                if (!budget.consumption)
                    error = 'Os dados de consumo não foram preenchidos.'
                else if (
                    !budget.consumption.accountForInstallation ||
                    !budget.consumption.typeCeiling ||
                    !budget.consumption.typeNetwork
                )
                    error =
                        'A conta para a instalação, tipo de telhado ou tipo de rede não foram preenchidos.'
                else if (
                    !budget.consumption.energyBills ||
                    budget.consumption.energyBills.length === 0
                )
                    error = 'Nenhuma conta de energia foi registrada.'
                else {
                    for (let bill of budget.consumption.energyBills) {
                        if (!bill.name || !bill.months) {
                            error =
                                'Uma das contas de energia não tem todos os campos preenchidos.'
                            break
                        }
                        for (let month in bill.months)
                            if (!bill.months[month]) {
                                error = `O mês ${month} não está preenchido na conta ${bill.name}.`
                                break
                            }
                    }
                }
                break
            case 2:
                if (!budget.kit) error = 'Nenhum kit foi selecionado.'
                else if (!budget.kit.modules || !budget.kit.inverter)
                    error =
                        'Os dados dos módulos ou do(s) inversor(es) não estão preenchidos.'
                else {
                    for (let key in budget.kit.modules)
                        if (!budget.kit.modules[key]) {
                            error = `O campo ${key} dos módulos não está preenchido.`
                            break
                        }
                    for (let key in budget.kit.inverter)
                        if (!budget.kit.inverter[key]) {
                            error = `O campo ${key} dos inversores não está preenchido.`
                            break
                        }
                }
                break
            case 3:
                if (!budget.validity)
                    error = 'Nenhuma data de validade foi selecionada.'
                break
        }

        if (error) {
            showToastMessage('error', error)
            throw new Error(error)
        } else {
            console.log(activeStep, steps.length)
            if (activeStep + 1 >= steps.length) {
                navigate('/dashboard/budget/result')
            } else {
                setActiveStep((prevActiveStep) => prevActiveStep + 1)
            }
        }
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    return (
        <>
            <Paper className='px-5 py-4'>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step
                            key={label}
                            sx={{
                                '& .MuiStepLabel-root .Mui-completed': {
                                    color: 'black.dark',
                                },
                                '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':
                                    {
                                        color: 'black.dark',
                                    },
                                '& .MuiStepLabel-root .Mui-active': {
                                    color: 'black.main',
                                },
                                '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel':
                                    {
                                        color: 'black.main',
                                    },
                                '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text':
                                    {
                                        fill: 'white',
                                    },
                            }}
                        >
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Box>
                    {getStepContent(activeStep)}
                    <Box className='d-flex gap-2 mt-2'>
                        <Button
                            color='black'
                            variant='contained'
                            disabled={activeStep === 0}
                            onClick={handleBack}
                        >
                            Voltar
                        </Button>
                        <Button
                            color='black'
                            variant='contained'
                            onClick={handleNext}
                        >
                            {activeStep === steps.length - 1
                                ? 'Finalizar'
                                : 'Próximo'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
            <ToastContainer />
        </>
    )
}

export default CadastroDados
