import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { UserContext } from '../../../contexts/userContext'
import useCompareEffect from '../../../hooks/useCompareEffect'
import Content from '../../template/Dashboard/Content'
import Header from '../../template/Dashboard/Header'
import Sidebar from '../../template/Dashboard/Sidebar'

const DashboardBox = styled.div`
    display: grid;
    height: 100vh;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas:
        'header header'
        'sidebar content';
    overflow: hidden;
`

function Dashboard() {
    const { user } = useContext(UserContext)
    const navigate = useNavigate()
    const { useDeepCompareEffect } = useCompareEffect()

    useDeepCompareEffect(() => {
        console.log('Checking...')
        if (!user && user !== 'loading') navigate('/')
    }, [user])

    return (
        <DashboardBox>
            <Header />
            <Sidebar />
            <Content />
        </DashboardBox>
    )
}
export default Dashboard
