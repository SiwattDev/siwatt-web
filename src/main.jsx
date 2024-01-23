import { createTheme, ThemeProvider } from '@mui/material/styles'
import 'bootstrap/dist/css/bootstrap.css'
import ReactDOM from 'react-dom/client'
import 'react-toastify/dist/ReactToastify.css'
import Contexts from './contexts/contexts'
import './main.css'
import Router from './router'

const theme = createTheme({
    palette: {
        black: {
            main: '#000000',
            light: '#000000',
            dark: '#000000',
            contrastText: '#ffffff',
        },
    },
    typography: {
        fontFamily: 'Aptos',
    },
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <Contexts>
        <ThemeProvider theme={theme}>
            <Router />
        </ThemeProvider>
    </Contexts>
)
