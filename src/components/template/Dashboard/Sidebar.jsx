import {
    AssessmentRounded,
    BadgeRounded,
    ConstructionRounded,
    HandshakeRounded,
    ManageHistoryRounded,
    MonetizationOnRounded,
    PeopleAltRounded,
    SolarPowerRounded,
} from '@mui/icons-material'
import { Button, Typography } from '@mui/material'
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
`

function Sidebar() {
    // const [value, setValue] = useState(0)

    return (
        <SidebarContainer>
            <Links>
                <Button
                    variant='text'
                    color='black'
                    className='rounded-0 text-capitalize px-4 w-100 justify-content-start'
                    startIcon={<AssessmentRounded />}
                    size='large'
                >
                    <Typography variant='h6'>Painel</Typography>
                </Button>
                <Button
                    variant='text'
                    color='black'
                    className='rounded-0 text-capitalize px-4 w-100 justify-content-start'
                    startIcon={<MonetizationOnRounded />}
                    size='large'
                >
                    <Typography variant='h6'>Vendas</Typography>
                </Button>
                <Button
                    variant='text'
                    color='black'
                    className='rounded-0 text-capitalize px-4 w-100 justify-content-start'
                    startIcon={<ConstructionRounded />}
                    size='large'
                >
                    <Typography variant='h6'>Projetos</Typography>
                </Button>
                <Button
                    variant='text'
                    color='black'
                    className='rounded-0 text-capitalize px-4 w-100 justify-content-start'
                    startIcon={<ManageHistoryRounded />}
                    size='large'
                >
                    <Typography variant='h6'>Pós-venda</Typography>
                </Button>
                <Button
                    variant='text'
                    color='black'
                    className='rounded-0 text-capitalize px-4 w-100 justify-content-start'
                    startIcon={<PeopleAltRounded />}
                    size='large'
                >
                    <Typography variant='h6'>Clientes</Typography>
                </Button>
                <Button
                    variant='text'
                    color='black'
                    className='rounded-0 text-capitalize px-4 w-100 justify-content-start'
                    startIcon={<SolarPowerRounded />}
                    size='large'
                >
                    <Typography variant='h6'>Kits</Typography>
                </Button>
                <Button
                    variant='text'
                    color='black'
                    className='rounded-0 text-capitalize px-4 w-100 justify-content-start'
                    startIcon={<BadgeRounded />}
                    size='large'
                >
                    <Typography variant='h6'>Agentes</Typography>
                </Button>
                <Button
                    variant='text'
                    color='black'
                    className='rounded-0 text-capitalize px-4 w-100 justify-content-start'
                    startIcon={<HandshakeRounded />}
                    size='large'
                >
                    <Typography variant='h6'>Parceiros</Typography>
                </Button>
            </Links>
            <div className='footer text-muted px-3'>
                <p>&copy;{new Date().getFullYear()} - Luz do Sol</p>
            </div>
        </SidebarContainer>
    )
}
export default Sidebar
