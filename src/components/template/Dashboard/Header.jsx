import { NotificationsRounded } from '@mui/icons-material'
import { Avatar, Button, IconButton, Tooltip } from '@mui/material'
import { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import IconLogo from '../../../assets/icon-logo.png'
import TextLogo from '../../../assets/logo.png'
import { UserContext } from '../../../contexts/userContext'
import Input from '../Global/Input'

const HeaderContainer = styled.div`
    padding: 0.5rem 1.5rem;
    display: flex;
    justify-content: space-between;
    grid-area: header;
`

function Header() {
    const { user } = useContext(UserContext)

    useEffect(() => console.log(user))

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
                />
            </div>
            <div>
                <Input
                    type='text'
                    placeholder='Pesquisar entidade'
                    style={{
                        minWidth: '500px',
                    }}
                />
            </div>
            <div className='actions d-flex align-items-center gap-3'>
                <Link to='/dashboard/entity-registration'>
                    <Button color='black'>Cadastrar Entidade</Button>
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
                    <IconButton>
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
                                V
                            </Avatar>
                        )}
                    </IconButton>
                </Tooltip>
            </div>
        </HeaderContainer>
    )
}

export default Header
