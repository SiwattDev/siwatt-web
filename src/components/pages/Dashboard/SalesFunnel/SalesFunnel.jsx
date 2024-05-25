import { MonetizationOnRounded } from '@mui/icons-material'
import { Box, Button, Paper, Typography } from '@mui/material'
import BySeller from './BySeller/BySeller'

function SalesFunnel() {
    return (
        <>
            <Paper className='d-flex gap-2 align-items-center px-3 py-2 mb-3'>
                <MonetizationOnRounded color='black' />
                <Typography variant='h6' sx={{ color: 'black' }}>
                    Funil de Vendas
                </Typography>
            </Paper>
            <Box sx={{ display: 'flex', gap: '10px' }}>
                <Button
                    variant='text'
                    color='inherit'
                    className='rounded-pill border border-black'
                    fullWidth
                >
                    Geral
                </Button>
                <Button
                    variant='text'
                    color='inherit'
                    className='rounded-pill border border-black'
                    fullWidth
                >
                    Por Vendedor
                </Button>
            </Box>
            <BySeller />
        </>
    )
}

export default SalesFunnel
