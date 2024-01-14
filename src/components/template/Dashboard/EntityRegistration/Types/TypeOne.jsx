import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material'
import { maskBr, validateBr } from 'js-brasil'
import { useState } from 'react'
import Address from './address/Address'

function TypeOne(props) {
    const { type, state, updateState, updateStateSubObject } = props
    const [showPassword, setShowPassword] = useState(false)

    const handleClickShowPassword = () => setShowPassword((show) => !show)

    const handleMouseDownPassword = (event) => {
        event.preventDefault()
    }

    return (
        <form className='row g-3'>
            <div className='col-6'>
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
            <div className='col-6'>
                <TextField
                    className='w-100'
                    label='E-mail: '
                    variant='outlined'
                    size='small'
                    color='black'
                    value={state.email || ''}
                    onChange={(e) => updateState('email', e.target.value)}
                />
            </div>
            <div className='col-6'>
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
                <div className='col-6'>
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
                <div className='col-6'>
                    <FormControl fullWidth>
                        <InputLabel
                            id='user-type'
                            color='black'
                        >
                            Tipo de usuário:
                        </InputLabel>
                        <Select
                            labelId='user-type'
                            label='Tipo de usuário: '
                            size='small'
                            color='black'
                            value={state.user_type.type || ''}
                            onChange={(e) => {
                                let value = e.target.value
                                if (
                                    value === 'administrative' ||
                                    value === 'support'
                                ) {
                                    value = {
                                        type: value,
                                        permissions: [
                                            'users',
                                            'sales',
                                            'projects',
                                            'after-sales',
                                            'clients',
                                            'kits',
                                            'agents',
                                            'partners',
                                        ],
                                    }
                                } else if (value === 'financial') {
                                    value = {
                                        type: value,
                                        permissions: [
                                            'sales',
                                            'projects',
                                            'after-sales',
                                            'kits',
                                        ],
                                    }
                                } else if (value === 'manager') {
                                    value = {
                                        type: value,
                                        permissions: [
                                            'sales',
                                            'projects',
                                            'after-sales',
                                        ],
                                    }
                                }
                                updateState('user_type', value)
                            }}
                        >
                            <MenuItem value='administrative'>
                                Administrativo
                            </MenuItem>
                            <MenuItem value='financial'>Financeiro</MenuItem>
                            <MenuItem value='manager'>Gerente</MenuItem>
                            <MenuItem value='support'>Suporte</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            )}
        </form>
    )
}
export default TypeOne
