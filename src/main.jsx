import 'bootstrap/dist/css/bootstrap.css'
import ReactDOM from 'react-dom/client'
import 'react-toastify/dist/ReactToastify.css'
import Contexts from './contexts/Contexts'
import './main.css'
import Router from './router'

ReactDOM.createRoot(document.getElementById('root')).render(
    <Contexts>
        <Router />
    </Contexts>
)
