import { onAuthStateChanged } from 'firebase/auth'
import { useContext, useEffect } from 'react'
import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import Auth from './components/pages/Auth/Auth'
import Page404 from './components/pages/Dashboard/404/404'
import AfterSales from './components/pages/Dashboard/AfterSales/AfterSales'
import Agents from './components/pages/Dashboard/Agents/Agents'
import Budget from './components/pages/Dashboard/Budget/Budget'
import BudgetData from './components/pages/Dashboard/Budget/BudgetData'
import BudgetResult from './components/pages/Dashboard/Budget/BudgetResult'
import CRM from './components/pages/Dashboard/CRM/CRM'
import SellerVisits from './components/pages/Dashboard/CRM/SellerVisits'
import VisitDetails from './components/pages/Dashboard/CRM/VisitDetails'
import Clients from './components/pages/Dashboard/Clients/Clients'
import Dashboard from './components/pages/Dashboard/Dashboard'
import Partners from './components/pages/Dashboard/Partners/Partners'
import Products from './components/pages/Dashboard/Products/Products'
import Projects from './components/pages/Dashboard/Projects/Projects'
import SalesFunnel from './components/pages/Dashboard/SalesFunnel/SalesFunnel'
import Teams from './components/pages/Dashboard/Teams/Teams'
import EntityRegistration from './components/template/Dashboard/EntityRegistration/EntityRegistration'
import EntityDetails from './components/template/Dashboard/ListEntities/EntityDetails'
import { UserContext } from './contexts/userContext'
import { auth } from './firebase'
import useFirebase from './hooks/useFirebase'

function AppRouter() {
    const { user, setUser } = useContext(UserContext)
    const { getDocumentById } = useFirebase()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (userData) => {
            console.log(userData)
            if (userData && user?.id !== userData.uid) {
                getDocumentById('users', userData.uid).then((data) =>
                    setUser(data)
                )
                window.localStorage.setItem('logged', true)
            } else if (!userData) {
                window.localStorage.setItem('logged', false)
                setUser(false)
            }
        })

        return unsubscribe
    }, [])

    return (
        <Router>
            <Routes>
                <Route path='/' element={<Auth />} />
                <Route path='/dashboard' element={<Dashboard />}>
                    <Route index element={<SalesFunnel />} />
                    <Route path='funnel' element={<SalesFunnel />} />
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
                    <Route path='budget' element={<Budget />} />
                    <Route path='budget/new' element={<BudgetData />} />
                    <Route path='budget/new/:id' element={<BudgetData />} />
                    <Route path='budget/result' element={<BudgetResult />} />
                    <Route
                        path='budget/result/:id'
                        element={<BudgetResult />}
                    />
                    <Route path='budget/edit/:id' element={<BudgetData />} />
                    <Route path='teams' element={<Teams />} />
                    <Route path='visits' element={<CRM />} />
                    <Route
                        path='visits/seller/:id'
                        element={<SellerVisits />}
                    />
                    <Route
                        path='visits/seller/:id/visit/:visitId'
                        element={<VisitDetails />}
                    />
                    <Route path='*' element={<Page404 />} />
                </Route>
                <Route path='*' element={<Page404 fullPage={true} />} />
            </Routes>
        </Router>
    )
}

export default AppRouter
