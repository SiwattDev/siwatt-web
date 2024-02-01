import { Box, CircularProgress } from '@mui/material'

function Loading({ action }) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#ffffff30',
                backdropFilter: 'blur(5px)',
            }}
        >
            <CircularProgress
                color='black'
                size={35}
                className='mb-3'
            />
            {action}
        </Box>
    )
}
export default Loading
