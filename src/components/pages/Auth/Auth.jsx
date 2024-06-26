import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { css, styled } from 'styled-components'
import IconLogo from '../../../assets/icon-logo.png'
import Illustration from '../../../assets/login.png'
import TextLogo from '../../../assets/logo.png'
import { UserContext } from '../../../contexts/userContext'
import useAuth from '../../../hooks/useAuth'
import useUtilities from '../../../hooks/useUtilities'
import Input from '../../template/Global/Input'
import Loading from '../../template/Global/Loading'

const AuthContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    padding: 40px;
`

const Card = styled.div`
    background: #f0f1f4;
    padding: 40px;
    border-radius: 0px 20px 20px 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 500px;
    width: 500px;
    @media (max-width: 767px) {
        border-radius: 20px;
    }

    ${(props) =>
        props.left &&
        css`
            border-radius: 20px 0px 0px 20px;
            background: #fdc611;
            padding: 20px;
            display: none;
            @media (min-width: 768px) {
                display: block;
            }
        `};
`

const Logo = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`

const Button = styled.button`
    border: none;
    background: #0656b4;
    color: white;
    padding: 8px;
    border-radius: 20px;
    width: 100%;
    letter-spacing: 10px;
    transition: background 0.2s linear;
    &:hover {
        background: #014089;
    }
`

const LinkButton = styled.button`
    border: none;
    background: none;
    color: #0656b4;
    text-decoration: underline;
    cursor: pointer;
    margin: 15px 0px;
`

function Auth() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [forgotPassword, setForgotPassword] = useState(false)
    const { user, setUser } = useContext(UserContext)
    const navigate = useNavigate()
    const params = useParams()
    const { loginInUser, resetPassword } = useAuth()
    const { showToastMessage } = useUtilities()

    useEffect(() => {
        if (user && user !== 'loading') {
            params.redirect_url
                ? navigate(params.redirect_url)
                : navigate('/dashboard')
        }
    }, [user, navigate, params])

    const login = () => {
        setIsLoading(true)
        loginInUser(email, password)
            .then((user) => {
                showToastMessage('success', 'Usuário logado com sucesso')
                setUser(user)
                if (params.redirect_url) navigate(params.redirect_url)
                else navigate('/dashboard')
            })
            .catch((e) => {
                setIsLoading(false)
                showToastMessage('error', e)
            })
    }

    const handleForgotPassword = () => {
        setIsLoading(true)
        resetPassword(email)
            .then(() => {
                setIsLoading(false)
                showToastMessage(
                    'success',
                    'Email para redefinição de senha enviado com sucesso'
                )
                setForgotPassword(false)
            })
            .catch((e) => {
                setIsLoading(false)
                showToastMessage('error', e)
            })
    }

    return (
        <AuthContainer>
            <Card left='true'>
                <Logo className='justify-content-center'>
                    <img
                        src={IconLogo}
                        alt='Ícone da logo do Siwatt'
                        height={50}
                    />
                    <img
                        src={TextLogo}
                        alt='Texto da logo com o nome Siwatt'
                        height={35}
                    />
                </Logo>
                <div className='illustration h-100 d-flex align-items-center justify-content-center'>
                    <img
                        src={Illustration}
                        alt='Ilustração para a tela de login'
                        className='my-3'
                        width={360}
                        style={{ maxWidth: '100%' }}
                    />
                </div>
            </Card>
            <Card>
                <Logo className='d-md-none'>
                    <img
                        src={IconLogo}
                        alt='Ícone da logo do Siwatt'
                        height={50}
                    />
                    <img
                        src={TextLogo}
                        alt='Texto da logo com o nome Siwatt'
                        height={35}
                    />
                </Logo>
                <div className='title'>
                    <h1>
                        {forgotPassword
                            ? 'Redefinir senha'
                            : 'Entre na sua conta'}
                    </h1>
                </div>
                <div className='w-100 mt-3 mt-md-5'>
                    <Input
                        type='email'
                        placeholder='Digite seu e-mail'
                        label='E-mail:'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {!forgotPassword && (
                        <>
                            <div className='m-4'></div>
                            <Input
                                type='password'
                                placeholder='Informe sua senha'
                                label='Senha:'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <LinkButton onClick={() => setForgotPassword(true)}>
                                Esqueci minha senha
                            </LinkButton>
                        </>
                    )}
                    <Button
                        className='mt-5'
                        onClick={forgotPassword ? handleForgotPassword : login}
                    >
                        {forgotPassword ? 'ENVIAR EMAIL' : 'LOGIN'}
                    </Button>
                </div>
            </Card>
            <ToastContainer autoClose={5000} />
            {isLoading && (
                <Loading
                    action={
                        forgotPassword
                            ? 'Enviando email...'
                            : 'Tentando fazer login...'
                    }
                />
            )}
        </AuthContainer>
    )
}

export default Auth
