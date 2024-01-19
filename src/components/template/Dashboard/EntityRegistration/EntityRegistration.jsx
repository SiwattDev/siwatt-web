import { PersonAddRounded } from '@mui/icons-material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Button, Card, Paper, Tab, Typography } from '@mui/material'
import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import useAuth from '../../../../hooks/useAuth'
import useFirebase from '../../../../hooks/useFirebase'
import useUtilities from '../../../../hooks/useUtilities'
import TypeOne from './Types/TypeOne'
import TypeTwo from './Types/TypeTwo'

function EntityRegistration() {
    const [state, setState] = useState({
        type: 'user',
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
        <>
            <Paper className='d-flex gap-2 align-items-center px-3 py-2 mb-3'>
                <PersonAddRounded color='black' />
                <Typography
                    variant='h6'
                    sx={{ color: 'black' }}
                >
                    Cadastrar Entidade
                </Typography>
            </Paper>
            <Card className='p-4 rounded-2'>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={state.type}>
                        <Box
                            sx={{
                                borderBottom: 1,
                                borderColor: 'divider',
                            }}
                        >
                            <TabList
                                centered
                                onChange={(e, value) =>
                                    updateState('type', value)
                                }
                                textColor='black'
                                indicatorColor='primary'
                                aria-label='lab API tabs example'
                            >
                                <Tab
                                    label='Usuário'
                                    value='user'
                                />
                                <Tab
                                    label='Cliente'
                                    value='client'
                                />
                                <Tab
                                    label='Fornecedor'
                                    value='supplier'
                                />
                                <Tab
                                    label='Parceiro'
                                    value='partner'
                                />
                            </TabList>
                        </Box>
                        <TabPanel
                            value='user'
                            className='px-0'
                        >
                            <TypeOne
                                type='user'
                                state={state}
                                updateState={updateState}
                                updateStateSubObject={updateStateSubObject}
                            />
                        </TabPanel>
                        <TabPanel
                            value='client'
                            className='px-0'
                        >
                            <TypeTwo
                                state={state}
                                updateState={updateState}
                                updateStateSubObject={updateStateSubObject}
                            />
                        </TabPanel>
                        <TabPanel
                            value='supplier'
                            className='px-0'
                        >
                            <TypeTwo
                                state={state}
                                updateState={updateState}
                                updateStateSubObject={updateStateSubObject}
                            />
                        </TabPanel>
                        <TabPanel
                            value='partner'
                            className='px-0'
                        >
                            <TypeOne
                                type='partner'
                                state={state}
                                updateState={updateState}
                                updateStateSubObject={updateStateSubObject}
                            />
                        </TabPanel>
                    </TabContext>
                </Box>
                {state.type && (
                    <Button
                        variant='contained'
                        color='black'
                        className='mt-3'
                        onClick={registerEntity}
                    >
                        Cadastrar
                    </Button>
                )}
                <ToastContainer autoClose={5000} />
            </Card>
        </>
    )
}

export default EntityRegistration
