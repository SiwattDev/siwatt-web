import { MonetizationOnRounded } from '@mui/icons-material'
import { Box, Button, Paper, Typography } from '@mui/material'
import { useState } from 'react'
import BySeller from './BySeller/BySeller'
import General from './General/General'

function SalesFunnel() {
    const [type, setType] = useState('general')
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
                    onClick={() => setType('general')}
                    sx={{
                        backgroundColor: type === 'general' ? '#000' : '#fff',
                        color: type === 'general' ? 'white' : 'black',
                        '&:hover': {
                            backgroundColor:
                                type === 'general' ? '#000' : '#fff',
                            color: type === 'general' ? 'white' : 'black',
                        },
                    }}
                >
                    Geral
                </Button>
                <Button
                    variant='text'
                    color='inherit'
                    className='rounded-pill border border-black'
                    fullWidth
                    onClick={() => setType('seller')}
                    sx={{
                        backgroundColor: type === 'seller' ? '#000' : '#fff',
                        color: type === 'seller' ? 'white' : 'black',
                        '&:hover': {
                            backgroundColor:
                                type === 'seller' ? '#000' : '#fff',
                            color: type === 'seller' ? 'white' : 'black',
                        },
                    }}
                >
                    Por Vendedor
                </Button>
            </Box>
            {type === 'general' && <General />}
            {type === 'seller' && <BySeller />}
        </>
    )
}

export default SalesFunnel
