import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material'
import { maskBr, validateBr } from 'js-brasil'
import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import useUtilities from '../../../../../hooks/useUtilities'
import useFirebase from './../../../../../hooks/useFirebase'
import Address from './address/Address'

function TypeOne(props) {
    const { type, state, updateState, updateStateSubObject } = props
    const [showPassword, setShowPassword] = useState(false)
    const { getDocumentsInCollectionWithQuery } = useFirebase()
    const { showToastMessage } = useUtilities()

    const handleClickShowPassword = () => setShowPassword((show) => !show)

    const handleMouseDownPassword = (event) => {
        event.preventDefault()
    }

    const checkIfEntityExists = (value) => {
        getDocumentsInCollectionWithQuery(`${type}s`, 'email', value)
            .then((docs) => {
                if (docs.length > 0) {
                    showToastMessage('error', 'O e-mail já está em uso.')
                    updateState('email', '')
                }
            })
            .catch((err) => {
                console.error(err)
            })
    }

    return (
        <form className='row g-3'>
            <div className='col-12 col-md-6'>
                <TextField
                    className='w-100'
                    label='Nome: '
                    variant='outlined'
                    size='small'
                    color='black'
                    value={state.name || ''}
                    onChange={(e) => updateState('name', e.target.value)}
                />
            </div>
            <div className='col-12 col-md-6'>
                <TextField
                    className='w-100'
                    label='E-mail: '
                    variant='outlined'
                    size='small'
                    color='black'
                    value={state.email || ''}
                    onChange={(e) => {
                        updateState('email', e.target.value)
                        if (validateBr.email(e.target.value))
                            checkIfEntityExists(e.target.value)
                    }}
                />
            </div>
            <div className='col-12 col-md-6'>
                <TextField
                    className='w-100'
                    label='Telefone: '
                    variant='outlined'
                    size='small'
                    color='black'
                    value={state.phone || ''}
                    onChange={(e) => {
                        let value = e.target.value
                        if (validateBr.telefone(value))
                            value = maskBr.telefone(value)
                        else value = value.replace(/\D/g, '')
                        updateState('phone', value)
                    }}
                />
            </div>
            {type === 'user' && (
                <div className='col-12 col-md-6'>
                    <TextField
                        label='Password'
                        variant='outlined'
                        fullWidth
                        size='small'
                        color='black'
                        type={showPassword ? 'text' : 'password'}
                        value={state.password}
                        onChange={(e) =>
                            updateState('password', e.target.value)
                        }
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <IconButton
                                        aria-label='toggle password visibility'
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge='end'
                                    >
                                        {showPassword ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
            )}
            <Address
                state={state}
                updateStateSubObject={updateStateSubObject}
            />
            {type === 'user' && (
                <div className='col-12 col-md-6'>
                    <Typography className='col-12' variant='h6'>
                        Tipo de usuário
                    </Typography>
                    <FormControl fullWidth size='small'>
                        <InputLabel id='user-type' color='black'>
                            Tipo de usuário:
                        </InputLabel>
                        <Select
                            labelId='user-type'
                            label='Tipo de usuário: '
                            size='small'
                            color='black'
                            value={state.user_type || ''}
                            onChange={(e) => {
                                let value = e.target.value
                                updateState('user_type', value)
                            }}
                        >
                            <MenuItem value='administrative'>
                                Administrativo
                            </MenuItem>
                            <MenuItem value='financial'>Financeiro</MenuItem>
                            <MenuItem value='manager'>Gerente</MenuItem>
                            <MenuItem value='support'>Suporte</MenuItem>
                            <MenuItem value='seller'>Vendedor</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            )}
            <ToastContainer autoClose={5000} />
        </form>
    )
}

export default TypeOne
