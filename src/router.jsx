import { onAuthStateChanged } from 'firebase/auth'
import { useContext } from 'react'
import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import Auth from './components/pages/Auth/Auth'
import AfterSales from './components/pages/Dashboard/AfterSales/AfterSales'
import Agents from './components/pages/Dashboard/Agents/Agents'
import BudgetData from './components/pages/Dashboard/Budget/BudgetData'
import BudgetResult from './components/pages/Dashboard/Budget/BudgetResult'
import Clients from './components/pages/Dashboard/Clients/Clients'
import Dashboard from './components/pages/Dashboard/Dashboard'
import Panel from './components/pages/Dashboard/Panel/Panel'
import Partners from './components/pages/Dashboard/Partners/Partners'
import Products from './components/pages/Dashboard/Products/Products'
import Projects from './components/pages/Dashboard/Projects/Projects'
import Sales from './components/pages/Dashboard/Sales/Sales'
import EntityRegistration from './components/template/Dashboard/EntityRegistration/EntityRegistration'
import EntityDetails from './components/template/Dashboard/ListEntities/EntityDetails'
import { UserContext } from './contexts/userContext'
import { auth } from './firebase'
import useFirebase from './hooks/useFirebase'

function AppRouter() {
    const { user, setUser } = useContext(UserContext)
    const { getDocumentById } = useFirebase()

    onAuthStateChanged(auth, (userData) => {
        console.log(userData)
        if (userData && user?.id !== userData.uid) {
            getDocumentById('users', userData.uid).then((data) => setUser(data))
            window.localStorage.setItem('logged', true)
        } else if (!userData) {
            window.localStorage.setItem('logged', false)
            setUser(false)
        }
    })

    return (
        <Router>
            <Routes>
                <Route path='/' element={<Auth />} />
                <Route path='/dashboard' element={<Dashboard />}>
                    <Route index element={<Panel />} />
                    <Route path='panel' element={<Panel />} />
                    <Route path='sales' element={<Sales />} />
                    <Route path='projects' element={<Projects />} />
                    <Route path='aftersales' element={<AfterSales />} />
                    <Route path='clients' element={<Clients />} />
                    <Route path='products' element={<Products />} />
                    <Route path='agents' element={<Agents />} />
                    <Route
                        path='entities/:type/:id'
                        element={<EntityDetails />}
                    />
                    <Route path='partners' element={<Partners />} />
                    <Route
                        path='entity-registration'
                        element={<EntityRegistration />}
                    />
                    <Route
                        path='entity-registration/:type/:action/:id'
                        element={<EntityRegistration />}
                    />
                    <Route path='budget/new/:id' element={<BudgetData />} />
                    <Route path='budget/result' element={<BudgetResult />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default AppRouter
