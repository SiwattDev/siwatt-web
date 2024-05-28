import { PersonAddRounded } from '@mui/icons-material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Button, Card, Paper, Tab, Typography } from '@mui/material'
import { validateBr } from 'js-brasil'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import useActivityLog from '../../../../hooks/useActivityLog'
import useAuth from '../../../../hooks/useAuth'
import useCompareEffect from '../../../../hooks/useCompareEffect'
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
        store_facade: null,
        docs: null,
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
    const [isDataLoaded, setIsDataLoaded] = useState(false)
    const { getDocumentById, createDocument, updateDocument } = useFirebase()
    const { generateCode, showToastMessage } = useUtilities()
    const { createUser } = useAuth()
    const { useDeepCompareEffect } = useCompareEffect()
    const { logAction } = useActivityLog()
    const { action, id, type } = useParams()

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

    const filterUserFields = (state) => {
        const fields = ['name', 'email', 'phone', 'address', 'user_type']
        return fields.reduce(
            (obj, field) => ({ ...obj, [field]: state[field] }),
            {}
        )
    }

    const filterPartnerFields = (state) => {
        const fields = ['name', 'email', 'phone', 'address']
        return fields.reduce(
            (obj, field) => ({ ...obj, [field]: state[field] }),
            {}
        )
    }

    const filterClientFields = (state) => {
        let fields = [
            'name',
            'email',
            'phone',
            'type_entity',
            'address',
            'store_facade',
            'docs',
        ]
        if (state.type_entity === 'individual') {
            fields.splice(1, 0, 'cpf')
        } else {
            fields.splice(
                1,
                0,
                'fantasy_name',
                'cnpj',
                'state_registration',
                'direct_contact'
            )
        }
        if (state.type === 'client') {
            fields.push('seller')
        }
        return fields.reduce(
            (obj, field) => ({ ...obj, [field]: state[field] }),
            {}
        )
    }

    const filterFields = (state, type) => {
        if (type === 'user') {
            return filterUserFields(state)
        } else if (type === 'partner') {
            return filterPartnerFields(state)
        } else if (type === 'client' || type === 'supplier') {
            return filterClientFields(state)
        }
    }

    useDeepCompareEffect(() => {
        if (type) updateState('type', type)
        if (action === 'edit' && id && !isDataLoaded) {
            getDocumentById(`${state.type}s`, id)
                .then((userData) => {
                    setState(userData)
                    setIsDataLoaded(true)
                })
                .catch((error) => {
                    console.error('Erro ao buscar usuário:', error)
                })
        }
    }, [action, getDocumentById, id, state.type, type, isDataLoaded])

    const showToast = (type, message) => {
        showToastMessage(type, message)
    }

    const registerEntity = async () => {
        const data = filterFields(state, state.type)
        const newId = generateCode()
        data.id = id || newId

        const handleSuccess = () => {
            showToast('success', 'Entidade atualizada com sucesso')
        }

        try {
            if (!validateBr.email(state.email))
                throw new Error('Email inválido')
            if (!validateBr.celular(state.phone))
                throw new Error('Telefone inválido')
            if (!validateBr.cep(state.address.cep))
                throw new Error('Cep inválido')
            if (
                (state.type === 'client' || state.type === 'supplier') &&
                state.type_entity === 'individual' &&
                !validateBr.cpf(state.cpf)
            )
                throw new Error('CPF inválido')

            if (
                (state.type === 'client' || state.type === 'supplier') &&
                state.type_entity === 'legal-entity' &&
                !validateBr.cnpj(state.cnpj)
            )
                throw new Error('CNPJ inválido')

            if (action === 'edit' && id) {
                const oldData = await getDocumentById(`${state.type}s`, id)
                await updateDocument(`${state.type}s`, id, data)
                logAction('edited entity', {
                    entity: id,
                    data,
                    oldData: oldData,
                })
                handleSuccess()
            } else {
                if (state.type === 'user') {
                    await createUser(
                        state.email,
                        state.password,
                        state.password,
                        data
                    )
                    handleSuccess()
                } else {
                    await createDocument(`${state.type}s`, newId, data)
                    logAction('created entity', { entity: newId })
                    handleSuccess()
                }
            }
        } catch (err) {
            showToast('error', err.toString().replace('Error: ', ''))
        }
    }

    return (
        <>
            <Paper className='d-flex gap-2 align-items-center px-3 py-2 mb-3'>
                <PersonAddRounded color='black' />
                <Typography variant='h6' sx={{ color: 'black' }}>
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
                                onChange={(e, value) =>
                                    updateState('type', value)
                                }
                                textColor='black'
                                indicatorColor='primary'
                                variant='scrollable'
                                scrollButtons
                                allowScrollButtonsMobile
                            >
                                <Tab label='Usuário' value='user' />
                                <Tab label='Cliente' value='client' />
                                <Tab label='Fornecedor' value='supplier' />
                                <Tab label='Parceiro' value='partner' />
                            </TabList>
                        </Box>
                        <TabPanel value='user' className='p-0 pt-3'>
                            <TypeOne
                                type='user'
                                state={state}
                                updateState={updateState}
                                updateStateSubObject={updateStateSubObject}
                            />
                        </TabPanel>
                        <TabPanel value='client' className='p-0 pt-3'>
                            <TypeTwo
                                type='client'
                                state={state}
                                updateState={updateState}
                                updateStateSubObject={updateStateSubObject}
                            />
                        </TabPanel>
                        <TabPanel value='supplier' className='p-0 pt-3'>
                            <TypeTwo
                                type='supplier'
                                state={state}
                                updateState={updateState}
                                updateStateSubObject={updateStateSubObject}
                            />
                        </TabPanel>
                        <TabPanel value='partner' className='p-0 pt-3'>
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
                        {id ? 'Editar' : 'Cadastrar'}
                    </Button>
                )}
                <ToastContainer autoClose={5000} />
            </Card>
        </>
    )
}

export default EntityRegistration
