import { Box, Typography } from '@mui/material'
import IconLogo from '/src/assets/404.png'

function Page404({ fullPage = false }) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: fullPage ? '100vh' : '100%',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '20px',
                    flexWrap: 'wrap',
                }}
            >
                <img
                    src={IconLogo}
                    alt='Ilustração de página não encontrada'
                    style={{
                        width: '100%',
                        maxWidth: '300px',
                    }}
                />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant='h1'>404</Typography>
                    <Typography variant='h6'>Página não encontrada</Typography>
                </Box>
            </Box>
        </Box>
    )
}
export default Page404
