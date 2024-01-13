import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material'
import { maskBr, validateBr } from 'js-brasil'
import Address from './address/Address'

function TypeOne(props) {
    const { type, state, updateState, updateStateSubObject } = props
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
                            value={state.user_type || ''}
                            onChange={(e) =>
                                updateState('user_type', e.target.value)
                            }
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
