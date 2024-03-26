import { SolarPowerRounded } from '@mui/icons-material'
import { Box, Paper, Typography } from '@mui/material'
import BackgroundCoverBudget from '../../../../assets/budget/background-cover-budget.png'
import CompanyName from '../../../../assets/budget/company-name.png'
import Logo from '../../../../assets/budget/logo.png'
import SecondaryLogo from '../../../../assets/budget/secondary-logo.png'

function BudgetResult() {
    const styleLogo = {
        position: 'absolute',
        top: '8%',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
    }

    const styleFooter = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        position: 'absolute',
        bottom: '0',
        width: '100%',
        fontWeight: 'bold',
    }

    const budget = {
        client: {
            name: 'Minha Empresa LTDA',
            cnpj: '12.456.789/1011-12',
            phone: '(12) 34567-8910',
        },
        generation: {
            plantSize: 12,
        },
    }

    return (
        <Box>
            <Paper
                className='p-0 m-auto position-relative'
                sx={{ maxWidth: '415px' }}
            >
                <img
                    src={BackgroundCoverBudget}
                    width='100%'
                    alt='Imagem de fundo'
                ></img>
                <Box style={styleLogo}>
                    <img src={Logo} alt='Logo' width='25%' className='mb-2' />
                    <img src={CompanyName} alt='Luz do Sol' width='60%' />
                    <div style={{ background: '#FFC511' }} className='mt-3'>
                        <div
                            className='mx-3 fw-bold text-light py-2 px-1'
                            style={{
                                background:
                                    'linear-gradient(90deg, #0858AF, #0C7AF4, #0858AF)',
                                fontSize: '14px',
                            }}
                        >
                            ORÇAMENTO DE USINA FOTOVOLTAICA
                        </div>
                    </div>
                </Box>
                <Box sx={styleFooter} className='p-3 pb-4'>
                    <Box>
                        <Typography variant='h6' className='fw-bold'>
                            <SolarPowerRounded /> {budget.generation.plantSize}
                            KWp
                        </Typography>
                        <Typography className='fw-bold'>
                            {budget.client.name}
                        </Typography>
                        <Typography className='fw-bold'>
                            CNPJ: {budget.client.cnpj}
                        </Typography>
                        <Typography className='fw-bold'>
                            Telefone: {budget.client.phone}
                        </Typography>
                    </Box>
                    <img
                        src={SecondaryLogo}
                        alt='Logo DR Engenharia'
                        width='100px'
                    />
                </Box>
            </Paper>
        </Box>
    )
}
export default BudgetResult
