import {
    Logout,
    NotificationsRounded,
    PersonAddRounded,
    Settings,
} from '@mui/icons-material'
import {
    Avatar,
    Button,
    Divider,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Tooltip,
} from '@mui/material'
import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import IconLogo from '../../../assets/icon-logo.png'
import TextLogo from '../../../assets/logo.png'
import { UserContext } from '../../../contexts/userContext'
import useAuth from '../../../hooks/useAuth'
import useUtilities from '../../../hooks/useUtilities'
import Input from '../Global/Input'

const HeaderContainer = styled.div`
    padding: 0.5rem 1.5rem;
    display: flex;
    justify-content: space-between;
    grid-area: header;
`

function Header() {
    const { user } = useContext(UserContext)
    const { getWindowSizes } = useUtilities()
    const { logout } = useAuth()
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <HeaderContainer>
            <div className='logo d-flex gap-2 align-items-center'>
                <img
                    src={IconLogo}
                    alt='Ícone da logo do Siwatt'
                    height={35}
                />
                <img
                    src={TextLogo}
                    alt='Logo do Siwatt'
                    height={25}
                    className='d-none d-md-block'
                />
            </div>
            <div className='d-flex w-100 mx-3'>
                <Input
                    type='text'
                    placeholder='Executar ação ou pesquisar entidades ou kit'
                    divStyle={{
                        width: '100%',
                        display: 'flex',
                        flex: 1,
                        justifyContent: 'center',
                    }}
                    style={{
                        width: '100%',
                        maxWidth: '500px',
                    }}
                />
            </div>
            <div className='actions d-flex align-items-center gap-3'>
                <Link to='/dashboard/entity-registration'>
                    {getWindowSizes() > 1045 ? (
                        <Button color='black'>Cadastrar Entidade</Button>
                    ) : (
                        <IconButton
                            aria-label='Notificações'
                            color='black'
                        >
                            <PersonAddRounded />
                        </IconButton>
                    )}
                </Link>
                <Tooltip title='Notificações'>
                    <IconButton
                        aria-label='Notificações'
                        color='black'
                    >
                        <NotificationsRounded />
                    </IconButton>
                </Tooltip>
                <Tooltip title='Minha conta'>
                    <IconButton
                        onClick={handleClick}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup='true'
                        aria-expanded={open ? 'true' : undefined}
                    >
                        {user && user.photo ? (
                            <Avatar
                                src={user.photo}
                                sx={{ width: 30, height: 30 }}
                            ></Avatar>
                        ) : (
                            <Avatar
                                sx={{
                                    bgcolor: '#000000',
                                    width: 30,
                                    height: 30,
                                }}
                            >
                                {user?.name ? user?.name[0] : 'V'}
                            </Avatar>
                        )}
                    </IconButton>
                </Tooltip>
            </div>
            <Menu
                anchorEl={anchorEl}
                id='account-menu'
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        width: 220,
                        maxWidth: '100%',
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.18))',
                        mt: 1,
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 18,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleClose}>
                    <Avatar
                        src={user?.photo || null}
                        sx={{
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        }}
                    />
                    {user?.name || 'Usuário'}
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <Settings fontSize='small' />
                    </ListItemIcon>
                    Configurações
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        logout()
                        handleClose()
                    }}
                >
                    <ListItemIcon>
                        <Logout fontSize='small' />
                    </ListItemIcon>
                    Sair dessa conta
                </MenuItem>
            </Menu>
        </HeaderContainer>
    )
}

export default Header
