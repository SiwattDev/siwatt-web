import {
    BadgeRounded,
    BentoRounded,
    ConstructionRounded,
    DescriptionRounded,
    Diversity3Rounded,
    HandshakeRounded,
    ManageHistoryRounded,
    MonetizationOnRounded,
    PeopleAltRounded,
} from '@mui/icons-material'
import { Button, Typography, css } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import useUtilities from '../../../hooks/useUtilities'

const SidebarContainer = styled.div`
    ${(props) => css`
        grid-area: sidebar;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        transition: max-width 0.3s;
        position: relative;
        width: 200px;
        max-width: ${props.show ? '0px' : '200px'};
        margin-right: ${props.show ? '10px' : '0px'};
        z-index: 999;
        & * {
            transform: ${props.show ? 'scaleX(0)' : 'scaleX(1)'};
        }
        @media (max-width: 768px) {
            position: fixed;
            left: 0;
            bottom: 0;
            height: calc(100% - 62px);
            background-color: white;
            box-shadow: 2px 5px 5px #0000002e;
        }
    `}
`
const ToggleAside = styled.button`
    position: absolute;
    top: 50%;
    right: -16px;
    height: 76px;
    width: 16px;
    padding: 0px;
    border: none;
    background-color: transparent;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: scale(1) translateY(-50%) !important;
    z-index: 1;
    & * {
        transform: scale(1) !important;
    }
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
    const { getWindowSizes } = useUtilities()
    const [show, setShow] = useState(
        getWindowSizes().width > 768 ? false : true
    )
    const location = useLocation()

    useEffect(() => {
        if (getWindowSizes().width < 768) setShow(true)
    }, [location])

    return (
        <SidebarContainer show={show}>
            <ToggleAside onClick={() => setShow(!show)}>
                <svg
                    viewBox='0 0 14 60'
                    style={{
                        filter: 'drop-shadow(4px 0px 2px #0000002e)',
                    }}
                >
                    <path
                        d='M 0 0 A 7 7 0 0 0 7 7 A 7 7 0 0 1 14 14 V 46 A 7 7 0 0 1 7 53 A 7 7 0 0 0 0 60 Z'
                        style={{
                            transform: 'none',
                            transformOrigin: 'center center',
                        }}
                        fill='#fff'
                    ></path>
                </svg>
                <svg
                    id='svg2'
                    fill='currentColor'
                    aria-hidden='true'
                    width='12'
                    height='12'
                    viewBox='0 0 12 12'
                    xmlns='http://www.w3.org/2000/svg'
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginLeft: '-6px',
                        marginTop: '-6px',
                        color: 'rgb(110,110,134)',
                        rotate: show ? '-90deg' : '90deg',
                    }}
                >
                    <path
                        d='M2.22 4.47c.3-.3.77-.3 1.06 0L6 7.19l2.72-2.72a.75.75 0 0 1 1.06 1.06L6.53 8.78c-.3.3-.77.3-1.06 0L2.22 5.53a.75.75 0 0 1 0-1.06Z'
                        fill='#000'
                    ></path>
                </svg>
            </ToggleAside>
            <Links>
                <Link to='/dashboard/funnel'>
                    <Button
                        variant='text'
                        color='black'
                        className='rounded-0 text-capitalize px-4 w-100 justify-content-start'
                        startIcon={<MonetizationOnRounded />}
                        size='large'
                    >
                        <Typography variant='h6'>Funil</Typography>
                    </Button>
                </Link>
                <Link to='/dashboard/budget'>
                    <Button
                        variant='text'
                        color='black'
                        className='rounded-0 text-capitalize px-4 w-100 justify-content-start'
                        startIcon={<DescriptionRounded />}
                        size='large'
                    >
                        <Typography variant='h6'>Orçamentos</Typography>
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
                <Link to='/dashboard/clients'>
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
                <Link to='/dashboard/products'>
                    <Button
                        variant='text'
                        color='black'
                        className='rounded-0 text-capitalize px-4 w-100 justify-content-start'
                        startIcon={<BentoRounded />}
                        size='large'
                    >
                        <Typography variant='h6'>Produtos</Typography>
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
                <Link to='/dashboard/teams'>
                    <Button
                        variant='text'
                        color='black'
                        className='rounded-0 text-capitalize px-4 w-100 justify-content-start'
                        startIcon={<Diversity3Rounded />}
                        size='large'
                    >
                        <Typography variant='h6'>Equipes</Typography>
                    </Button>
                </Link>
            </Links>
            <div className='footer text-muted px-3'>
                <p>&copy;{new Date().getFullYear()}- Luz do Sol</p>
            </div>
        </SidebarContainer>
    )
}
export default Sidebar
