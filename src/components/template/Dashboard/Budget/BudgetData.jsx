import {
    Box,
    Card,
    CardContent,
    Paper,
    Step,
    StepLabel,
    Stepper,
} from '@mui/material'

function BudgetData() {
    const steps = [
        'Dados da Conta de Energia',
        'Kit Fotovoltaico',
        'Dados Financeiros',
        'Tema e Validade',
    ]

    return (
        <>
            <Paper>
                <Box sx={{ width: '100%' }}>
                    <Stepper
                        activeStep={1}
                        alternativeLabel
                    >
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
            </Paper>
            <Card>
                <CardContent></CardContent>
            </Card>
        </>
    )
}

export default BudgetData
