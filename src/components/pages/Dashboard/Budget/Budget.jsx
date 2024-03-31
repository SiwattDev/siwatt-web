import { AddRounded } from '@mui/icons-material'
import { Box, Fab, Tooltip, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import InConstruction from '../../../../assets/in-construction.png'

function Budget() {
    const navigate = useNavigate()
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                }}
            >
                <img
                    src={InConstruction}
                    alt='Ilustração: em construção'
                    style={{
                        maxWidth: '400px',
                        width: '100%',
                        display: 'block',
                    }}
                />
                <Typography
                    variant='body1'
                    className='text-center'
                    style={{ maxWidth: '400px' }}
                >
                    Essa tela ainda está em construção, clique no botão de mais
                    flutuando no canto inferior direito para criar um novo
                    orçamento
                </Typography>
                <Tooltip title='Novo Orçamento'>
                    <Fab
                        color='black'
                        aria-label='add'
                        className='position-fixed bottom-0 end-0 m-4'
                        onClick={() => navigate('new')}
                    >
                        <AddRounded />
                    </Fab>
                </Tooltip>
            </Box>
        </>
    )
}
export default Budget
