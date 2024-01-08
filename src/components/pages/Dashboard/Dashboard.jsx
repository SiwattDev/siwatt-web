import styled from 'styled-components'
import Content from '../../template/Dashboard/Content'
import Header from '../../template/Dashboard/Header'
import Sidebar from '../../template/Dashboard/Sidebar'

const DashboardBox = styled.div`
    display: grid;
    height: 100vh;
    grid-template-columns: 200px auto;
    grid-template-rows: auto 1fr;
    grid-template-areas:
        'header header'
        'sidebar content';
`

function Dashboard() {
    return (
        <DashboardBox>
            <Header />
            <Sidebar />
            <Content />
        </DashboardBox>
    )
}
export default Dashboard
