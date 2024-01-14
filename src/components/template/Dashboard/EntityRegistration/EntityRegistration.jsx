import {
    Button,
    Card,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from '@mui/material'
import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import useAuth from '../../../../hooks/useAuth'
import useFirebase from '../../../../hooks/useFirebase'
import useUtilities from '../../../../hooks/useUtilities'
import TypeOne from './Types/TypeOne'
import TypeTwo from './Types/TypeTwo'

function EntityRegistration() {
    const [state, setState] = useState({
        type: null,
        name: null,
        fantasy_name: null,
        email: null,
        phone: null,
        password: null,
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
        user_type: {
            type: null,
            permissions: [],
        },
        seller: null,
    })
    const { createDocument } = useFirebase()
    const { generateCode, showToastMessage } = useUtilities()
    const { createUser } = useAuth()

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

    const filterFields = (state, type) => {
        const userFields = ['name', 'email', 'phone', 'address', 'user_type']
        const partnerFields = ['name', 'email', 'phone', 'address']
        const clientFields = [
            'name',
            'email',
            'phone',
            'type_entity',
            'address',
        ]

        if (state.type_entity === 'individual') clientFields.splice(1, 0, 'cpf')
        else {
            clientFields.splice(1, 0, 'fantasy_name')
            clientFields.splice(2, 0, 'cnpj')
            clientFields.splice(5, 0, 'state_registration')
            clientFields.push('direct_contact')
        }

        if (state.type === 'client') clientFields.push('seller')

        let fields
        if (type === 'user') fields = userFields
        else if (type === 'partner') fields = partnerFields
        else if (type === 'client' || type === 'supplier') fields = clientFields

        const filteredState = {}
        fields.forEach((field) => (filteredState[field] = state[field]))

        return filteredState
    }

    const registerEntity = () => {
        const data = filterFields(state, state.type)
        const id = generateCode()
        data.id = id
        if (state.type === 'user')
            createUser(state.email, state.password, state.password, data)
        else createDocument(`${state.type}s`, id, data)
        showToastMessage('success', 'Entidade cadastrada com sucesso')
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
                onClick={registerEntity}
            >
                Cadastrar
            </Button>
            <ToastContainer autoClose={5000} />
        </Card>
    )
}

export default EntityRegistration
