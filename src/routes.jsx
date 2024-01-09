import { onAuthStateChanged } from 'firebase/auth'
import { useContext } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Auth from './components/pages/Auth/Auth'
import AfterSales from './components/pages/Dashboard/AfterSales/AfterSales'
import Agents from './components/pages/Dashboard/Agents/Agents'
import Customers from './components/pages/Dashboard/Customers/Customers'
import Dashboard from './components/pages/Dashboard/Dashboard'
import Kits from './components/pages/Dashboard/Kits/Kits'
import Panel from './components/pages/Dashboard/Panel/Panel'
import Partners from './components/pages/Dashboard/Partners/Partners'
import Projects from './components/pages/Dashboard/Projects/Projects'
import Sales from './components/pages/Dashboard/Sales/Sales'
import { UserContext } from './contexts/userContext'
import { auth } from './firebase'

function Routes() {
    const { user, setUser } = useContext(UserContext)

    onAuthStateChanged(auth, (userData) => {
        if (userData) {
            setUser(userData)
            console.log('Usuário logado', user)
        } else setUser(false)
    })

    const router = createBrowserRouter([
        {
            path: '/',
            element: <Auth />,
        },
        {
            path: '/dashboard',
            element: <Dashboard />,
            children: [
                {
                    path: '',
                    element: <Panel />,
                },
                {
                    path: 'panel',
                    element: <Panel />,
                },
                {
                    path: 'sales',
                    element: <Sales />,
                },
                {
                    path: 'projects',
                    element: <Projects />,
                },
                {
                    path: 'aftersales',
                    element: <AfterSales />,
                },
                {
                    path: 'customers',
                    element: <Customers />,
                },
                {
                    path: 'kits',
                    element: <Kits />,
                },
                {
                    path: 'agents',
                    element: <Agents />,
                },
                {
                    path: 'partners',
                    element: <Partners />,
                },
            ],
        },
    ])
    return <RouterProvider router={router} />
}

export default Routes
