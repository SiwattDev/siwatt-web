import { Box, Typography } from '@mui/material'
import IconLogo from '/src/assets/404.png'

function Page404({
    fullPage = false,
    title = '404',
    message = 'Página não encontrada',
}) {
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
                    alt='Ilustração 404'
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
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        variant={title === '404' ? 'h1' : 'h4'}
                        sx={{ maxWidth: '404px' }}
                    >
                        {title}
                    </Typography>
                    <Typography variant='body1' sx={{ maxWidth: '404px' }}>
                        {message}
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}
export default Page404
