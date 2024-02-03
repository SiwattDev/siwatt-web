import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { UserContext } from '../../../contexts/userContext'
import useCompareEffect from '../../../hooks/useCompareEffect'
import Content from '../../template/Dashboard/Content'
import Header from '../../template/Dashboard/Header'
import Sidebar from '../../template/Dashboard/Sidebar'
import Loading from '../../template/Global/Loading'

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
        console.log(user)
        if (user !== 'loading' && !user) navigate('/')
    }, [user])

    return (
        <DashboardBox>
            {user !== 'loading' && user ? (
                <>
                    <Header />
                    <Sidebar />
                    <Content />
                </>
            ) : (
                <Loading action='Verificando usuário...' />
            )}
        </DashboardBox>
    )
}
export default Dashboard
