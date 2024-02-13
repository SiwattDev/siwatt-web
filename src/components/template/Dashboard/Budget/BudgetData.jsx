import { Box, Button, Paper, Step, StepLabel, Stepper } from '@mui/material'
// import { useState } from 'react'

function BudgetData() {
    // const [budgetData, setBudgetData] = useState()
    const steps = [
        'Dados do Cliente',
        'Dados da Conta de Energia',
        'Kit Fotovoltaico',
        'Dados Financeiros',
        'Validade',
    ]

    return (
        <>
            <Paper className='p-4'>
                <Box sx={{ width: '100%' }}>
                    <Stepper
                        activeStep={1}
                        alternativeLabel
                    >
                        {steps.map((label) => (
                            <Step
                                key={label}
                                sx={{
                                    '& .MuiStepLabel-root .Mui-completed': {
                                        color: '#000000',
                                    },
                                    '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':
                                        {
                                            color: 'grey.500',
                                        },
                                    '& .MuiStepLabel-root .Mui-active': {
                                        color: '#000000',
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
                </Box>
                <Box className='mt-5'></Box>
                <Button
                    variant='contained'
                    color='black'
                    className='mt-3'
                >
                    Próximo
                </Button>
            </Paper>
        </>
    )
}

export default BudgetData
