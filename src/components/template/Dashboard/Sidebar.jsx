import {
    AssessmentRounded,
    AutoAwesomeRounded,
    BadgeRounded,
    ConstructionRounded,
    HandshakeRounded,
    ManageHistoryRounded,
    MonetizationOnRounded,
    PeopleAltRounded,
    SolarPowerRounded,
} from '@mui/icons-material'
import { Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
// import { useState } from 'react'

const SidebarContainer = styled.div`
    grid-area: sidebar;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`

const Links = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    & > a {
        width: 100%;
    }
`

function Sidebar() {
    // const [value, setValue] = useState(0)

    return (
        <SidebarContainer>
            <Links>
                <Link to='/dashboard/'>
                    <Button
                        variant='text'
                        color='black'
                        className='rounded-0 text-capitalize px-4 w-100 justify-content-start'
                        startIcon={<AssessmentRounded />}
                        size='large'
                    >
                        <Typography variant='h6'>Painel</Typography>
                    </Button>
                </Link>
                <Link to='/dashboard/sales'>
                    <Button
                        variant='text'
                        color='black'
                        className='rounded-0 text-capitalize px-4 w-100 justify-content-start'
                        startIcon={<MonetizationOnRounded />}
                        size='large'
                    >
                        <Typography variant='h6'>Vendas</Typography>
                    </Button>
                </Link>
                <Link to='/dashboard/documents'>
                    <Button
                        variant='text'
                        color='black'
                        className='rounded-0 text-capitalize px-4 w-100 justify-content-start'
                        startIcon={<AutoAwesomeRounded />}
                        size='large'
                    >
                        <Typography variant='h6'>Documentos</Typography>
                    </Button>
                </Link>
                <Link to='/dashboard/projects'>
                    <Button
                        variant='text'
                        color='black'
                        className='rounded-0 text-capitalize px-4 w-100 justify-content-start'
                        startIcon={<ConstructionRounded />}
                        size='large'
                    >
                        <Typography variant='h6'>Projetos</Typography>
                    </Button>
                </Link>
                <Link to='/dashboard/aftersales'>
                    <Button
                        variant='text'
                        color='black'
                        className='rounded-0 text-capitalize px-4 w-100 justify-content-start'
                        startIcon={<ManageHistoryRounded />}
                        size='large'
                    >
                        <Typography variant='h6'>Pós-venda</Typography>
                    </Button>
                </Link>
                <Link to='/dashboard/customers'>
                    <Button
                        variant='text'
                        color='black'
                        className='rounded-0 text-capitalize px-4 w-100 justify-content-start'
                        startIcon={<PeopleAltRounded />}
                        size='large'
                    >
                        <Typography variant='h6'>Clientes</Typography>
                    </Button>
                </Link>
                <Link to='/dashboard/kits'>
                    <Button
                        variant='text'
                        color='black'
                        className='rounded-0 text-capitalize px-4 w-100 justify-content-start'
                        startIcon={<SolarPowerRounded />}
                        size='large'
                    >
                        <Typography variant='h6'>Kits</Typography>
                    </Button>
                </Link>
                <Link to='/dashboard/agents'>
                    <Button
                        variant='text'
                        color='black'
                        className='rounded-0 text-capitalize px-4 w-100 justify-content-start'
                        startIcon={<BadgeRounded />}
                        size='large'
                    >
                        <Typography variant='h6'>Usuários</Typography>
                    </Button>
                </Link>
                <Link to='/dashboard/partners'>
                    <Button
                        variant='text'
                        color='black'
                        className='rounded-0 text-capitalize px-4 w-100 justify-content-start'
                        startIcon={<HandshakeRounded />}
                        size='large'
                    >
                        <Typography variant='h6'>Parceiros</Typography>
                    </Button>
                </Link>
            </Links>
            <div className='footer text-muted px-3'>
                <p>&copy;{new Date().getFullYear()} - Luz do Sol</p>
            </div>
        </SidebarContainer>
    )
}
export default Sidebar
