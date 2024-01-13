import {
    Button,
    Card,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from '@mui/material'
import { useState } from 'react'
import TypeOne from './Types/TypeOne'
import TypeTwo from './Types/TypeTwo'

function EntityRegistration() {
    const [state, setState] = useState({
        type: null,
        name: null,
        fantasy_name: null,
        email: null,
        phone: null,
        type_entity: null,
        cpf: null,
        cnpj: null,
        state_registration: null,
        address: {
            number: null,
            road: null,
            neighborhood: null,
            city: null,
            reference: null,
            cep: null,
            uf: null,
        },
        direct_contact: {
            name: null,
            email: null,
            phone: null,
            cpf: null,
            birth_of_date: null,
        },
        seller: null,
    })

    const updateState = (key, value) => {
        setState((prevState) => ({
            ...prevState,
            [key]: value,
        }))
    }

    const updateStateSubObject = (object, key, value) => {
        setState((prevState) => ({
            ...prevState,
            [object]: {
                ...prevState[object],
                [key]: value,
            },
        }))
    }

    return (
        <Card className='py-4 px-5 rounded-4'>
            <h1 className='mb-4'>Cadastro de Entidade</h1>
            <div className='col-12 mb-3'>
                <FormControl fullWidth>
                    <InputLabel
                        id='type-registration'
                        color='black'
                    >
                        Tipo de cadastro:
                    </InputLabel>
                    <Select
                        labelId='type-registration'
                        label='Tipo de cadastro: '
                        size='small'
                        color='black'
                        value={state.type || ''}
                        onChange={(e) => updateState('type', e.target.value)}
                    >
                        <MenuItem value='user'>Usuário</MenuItem>
                        <MenuItem value='client'>Cliente</MenuItem>
                        <MenuItem value='supplier'>Fornecedor</MenuItem>
                        <MenuItem value='partner'>Parceiro</MenuItem>
                    </Select>
                </FormControl>
            </div>
            {state.type === 'user' && (
                <TypeOne
                    type='user'
                    state={state}
                    updateState={updateState}
                    updateStateSubObject={updateStateSubObject}
                />
            )}
            {(state.type === 'client' || state.type === 'supplier') && (
                <TypeTwo
                    state={state}
                    updateState={updateState}
                    updateStateSubObject={updateStateSubObject}
                />
            )}
            {state.type === 'partner' && (
                <TypeOne
                    type='partner'
                    state={state}
                    updateState={updateState}
                    updateStateSubObject={updateStateSubObject}
                />
            )}
            <Button
                variant='contained'
                color='black'
                className='mt-3'
                onClick={() => {
                    console.log(state)
                }}
            >
                Cadastrar
            </Button>
        </Card>
    )
}

export default EntityRegistration
