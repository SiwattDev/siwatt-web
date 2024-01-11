import {
    Card,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material'
import { maskBr, validateBr } from 'js-brasil'
import { useState } from 'react'
import useAPI from '../../../../hooks/useAPI'
import useCompareEffect from './../../../../hooks/useCompareEffect'

function EntityRegistration() {
    const { useDeepCompareEffect } = useCompareEffect()
    const { APICNPJ, APICep } = useAPI()
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
            address: null,
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

    useDeepCompareEffect(() => {
        if (state.type === 'user' || state.type === 'partner') {
            updateState('direct_contact', null)
            updateState('seller', null)
            updateState('state_registration', null)
            updateState('cpf', null)
            updateState('cnpj', null)
            updateState('type_entity', null)
            updateState('fantasy_name', null)
        } else if (state.type === 'client' || state.type === 'supplier') {
            updateState('direct_contact', {
                name: state.direct_contact?.name || null,
                email: state.direct_contact?.email || null,
                phone: state.direct_contact?.phone || null,
                cpf: state.direct_contact?.cpf || null,
                birth_of_date: state.direct_contact?.birth_of_date || null,
            })
        }
        console.log(state)
    }, [state])

    // Função para atualizar o state
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

    const handleCepChange = (e) => {
        let value = e.target.value
        if (validateBr.cep(value)) {
            value = maskBr.cep(value)
            APICep(e.target.value).then((result) => {
                console.log(result.data)
                updateStateSubObject('address', 'road', result.data.logradouro)
                updateStateSubObject(
                    'address',
                    'neighborhood',
                    result.data.bairro
                )
                updateStateSubObject('address', 'city', result.data.localidade)
                updateStateSubObject('address', 'uf', result.data.uf)
            })
        }
        updateStateSubObject('address', 'cep', value)
    }

    return (
        <Card className='py-4 px-5 rounded-4'>
            <h1 className='mb-4'>Cadastro de Entidade</h1>
            <form className='row g-3'>
                <div className='col-12'>
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
                            value={state.type}
                            onChange={(e) =>
                                updateState('type', e.target.value)
                            }
                        >
                            <MenuItem value='user'>Usuário</MenuItem>
                            <MenuItem value='client'>Cliente</MenuItem>
                            <MenuItem value='supplier'>Fornecedor</MenuItem>
                            <MenuItem value='partner'>Parceiro</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                {state.type && (
                    <>
                        {(state.type === 'client' ||
                            state.type === 'supplier') && (
                            <div className='col-6'>
                                <FormControl fullWidth>
                                    <InputLabel
                                        id='type-entity'
                                        color='black'
                                    >
                                        Tipo de pessoa:
                                    </InputLabel>
                                    <Select
                                        labelId='type-entity'
                                        label='Tipo de pessoa: '
                                        size='small'
                                        color='black'
                                        sx={{
                                            background: 'white',
                                            borderRadius: 2,
                                        }}
                                        value={state.type_entity}
                                        onChange={(e) =>
                                            updateState(
                                                'type_entity',
                                                e.target.value
                                            )
                                        }
                                    >
                                        <MenuItem value='individual'>
                                            Física
                                        </MenuItem>
                                        <MenuItem value='legal-entity'>
                                            Jurídica
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        )}
                        {state.type_entity === 'individual' &&
                            state.type !== 'user' &&
                            state.type !== 'partner' && (
                                <div className='col-6'>
                                    <TextField
                                        className='w-100'
                                        label='CPF: '
                                        variant='outlined'
                                        size='small'
                                        color='black'
                                        sx={{
                                            background: 'white',
                                            borderRadius: 2,
                                        }}
                                        value={state.cpf}
                                        onChange={(e) => {
                                            let value = e.target.value
                                            if (validateBr.cpf(value))
                                                value = maskBr.cpf(value)
                                            updateState('cpf', value)
                                        }}
                                    />
                                </div>
                            )}
                        {state.type_entity === 'legal-entity' && (
                            <>
                                <div className='col-6'>
                                    <TextField
                                        className='w-100'
                                        label='CNPJ: '
                                        variant='outlined'
                                        size='small'
                                        color='black'
                                        sx={{
                                            background: 'white',
                                            borderRadius: 2,
                                        }}
                                        value={state.cnpj}
                                        onChange={(e) => {
                                            let value = e.target.value
                                            if (validateBr.cnpj(value)) {
                                                value = maskBr.cnpj(value)
                                                APICNPJ(e.target.value)
                                                    .then((result) => {
                                                        updateState(
                                                            'name',
                                                            result.data
                                                                .razao_social
                                                        )
                                                        updateState(
                                                            'fantasy_name',
                                                            result.data
                                                                .estabelecimento
                                                                .nome_fantasia
                                                        )
                                                        updateState(
                                                            'state_registration',
                                                            result.data.estabelecimento.inscricoes_estaduais.filter(
                                                                (i) =>
                                                                    i.ativo ===
                                                                    true
                                                            )[0]
                                                                .inscricao_estadual
                                                        )
                                                        updateStateSubObject(
                                                            'address',
                                                            'cep',
                                                            result.data
                                                                .estabelecimento
                                                                .cep
                                                        )
                                                        handleCepChange({
                                                            target: {
                                                                value: result
                                                                    .data
                                                                    .estabelecimento
                                                                    .cep,
                                                            },
                                                        })
                                                    })
                                                    .catch((err) =>
                                                        console.log(err)
                                                    )
                                            }
                                            updateState('cnpj', value)
                                        }}
                                    />
                                </div>
                                <div className='col-6'>
                                    <TextField
                                        className='w-100'
                                        label='Inscrição estadual: '
                                        variant='outlined'
                                        size='small'
                                        color='black'
                                        sx={{
                                            background: 'white',
                                            borderRadius: 2,
                                        }}
                                        value={state.state_registration}
                                        onChange={(e) => {
                                            let value = e.target.value
                                            updateState(
                                                'state_registration',
                                                value
                                            )
                                        }}
                                    />
                                </div>
                            </>
                        )}
                        <div className='col-6'>
                            <TextField
                                className='w-100'
                                label='Razão social: '
                                variant='outlined'
                                size='small'
                                color='black'
                                value={state.name}
                                onChange={(e) =>
                                    updateState('name', e.target.value)
                                }
                            />
                        </div>
                        {(state.type === 'client' ||
                            state.type === 'supplier') && (
                            <div className='col-6'>
                                <TextField
                                    className='w-100'
                                    label='Nome fantasia: '
                                    variant='outlined'
                                    size='small'
                                    color='black'
                                    sx={{
                                        background: 'white',
                                        borderRadius: 2,
                                    }}
                                    value={state.fantasy_name}
                                    onChange={(e) =>
                                        updateState(
                                            'fantasy_name',
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        )}
                        <div className='col-6'>
                            <TextField
                                className='w-100'
                                label='E-mail: '
                                variant='outlined'
                                size='small'
                                color='black'
                                value={state.email}
                                onChange={(e) =>
                                    updateState('email', e.target.value)
                                }
                            />
                        </div>
                        <div className='col-6'>
                            <TextField
                                className='w-100'
                                label='Telefone: '
                                variant='outlined'
                                size='small'
                                color='black'
                                value={state.phone}
                                onChange={(e) => {
                                    let value = e.target.value
                                    if (validateBr.telefone(value))
                                        value = maskBr.telefone(value)
                                    updateState('phone', value)
                                }}
                            />
                        </div>
                        <div className='col-6'>
                            <TextField
                                className='w-100'
                                label='Cep: '
                                variant='outlined'
                                size='small'
                                color='black'
                                value={state.address.cep}
                                onChange={handleCepChange}
                            />
                        </div>
                        <div className='col-6'>
                            <TextField
                                className='w-100'
                                label='Número: '
                                variant='outlined'
                                size='small'
                                color='black'
                                value={state.address.number}
                                onChange={(e) =>
                                    updateStateSubObject(
                                        'address',
                                        'number',
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                        <div className='col-6'>
                            <TextField
                                className='w-100'
                                label='Rua: '
                                variant='outlined'
                                size='small'
                                color='black'
                                value={state.address.road}
                                onChange={(e) =>
                                    updateStateSubObject(
                                        'address',
                                        'road',
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                        <div className='col-6'>
                            <TextField
                                className='w-100'
                                label='Bairro: '
                                variant='outlined'
                                size='small'
                                color='black'
                                value={state.address.neighborhood}
                                onChange={(e) =>
                                    updateStateSubObject(
                                        'address',
                                        'neighborhood',
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                        <div className='col-6'>
                            <TextField
                                className='w-100'
                                label='Cidade: '
                                variant='outlined'
                                size='small'
                                color='black'
                                value={state.address.city}
                                onChange={(e) =>
                                    updateStateSubObject(
                                        'address',
                                        'city',
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                        <div className='col-6'>
                            <TextField
                                className='w-100'
                                label='Referência: '
                                variant='outlined'
                                size='small'
                                color='black'
                                value={state.address.reference}
                                onChange={(e) =>
                                    updateStateSubObject(
                                        'address',
                                        'reference',
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                        <div className='col-6'>
                            <TextField
                                className='w-100'
                                label='Endereço: '
                                variant='outlined'
                                size='small'
                                color='black'
                                value={state.address.address}
                                onChange={(e) =>
                                    updateStateSubObject(
                                        'address',
                                        'address',
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                        <div className='col-6'>
                            <TextField
                                className='w-100'
                                label='UF: '
                                variant='outlined'
                                size='small'
                                color='black'
                                value={state.address.uf}
                                onChange={(e) =>
                                    updateStateSubObject(
                                        'address',
                                        'uf',
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                        {state.type_entity === 'legal-entity' && (
                            <div className='col-12 row g-3'>
                                <Typography
                                    className='col-12'
                                    variant='h6'
                                >
                                    Contato direto:
                                </Typography>
                                <div className='col-6'>
                                    <TextField
                                        className='w-100'
                                        label='Nome: '
                                        variant='outlined'
                                        size='small'
                                        color='black'
                                        sx={{
                                            background: 'white',
                                            borderRadius: 2,
                                        }}
                                        value={state.direct_contact.name}
                                        onChange={(e) =>
                                            updateStateSubObject(
                                                'direct_contact',
                                                'name',
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div className='col-6'>
                                    <TextField
                                        className='w-100'
                                        label='Email: '
                                        variant='outlined'
                                        size='small'
                                        color='black'
                                        sx={{
                                            background: 'white',
                                            borderRadius: 2,
                                        }}
                                        value={state.direct_contact.email}
                                        onChange={(e) =>
                                            updateStateSubObject(
                                                'direct_contact',
                                                'email',
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div className='col-6'>
                                    <TextField
                                        className='w-100'
                                        label='Telefone: '
                                        variant='outlined'
                                        size='small'
                                        color='black'
                                        sx={{
                                            background: 'white',
                                            borderRadius: 2,
                                        }}
                                        value={state.direct_contact.phone}
                                        onChange={(e) => {
                                            let value = e.target.value
                                            if (validateBr.telefone(value))
                                                value = maskBr.telefone(value)
                                            updateStateSubObject(
                                                'direct_contact',
                                                'phone',
                                                value
                                            )
                                        }}
                                    />
                                </div>
                                <div className='col-6'>
                                    <TextField
                                        className='w-100'
                                        label='Data de nascimento: '
                                        variant='outlined'
                                        size='small'
                                        color='black'
                                        sx={{
                                            background: 'white',
                                            borderRadius: 2,
                                        }}
                                        value={
                                            state.direct_contact.date_of_birth
                                        }
                                        onChange={(e) => {
                                            let value = e.target.value
                                            if (validateBr.data(value))
                                                value = maskBr.data(value)
                                            updateStateSubObject(
                                                'direct_contact',
                                                'date_of_birth',
                                                value
                                            )
                                        }}
                                    />
                                </div>
                                <div className='col-6'>
                                    <TextField
                                        className='w-100'
                                        label='CPF: '
                                        variant='outlined'
                                        size='small'
                                        color='black'
                                        sx={{
                                            background: 'white',
                                            borderRadius: 2,
                                        }}
                                        value={state.direct_contact.cpf}
                                        onChange={(e) => {
                                            let value = e.target.value
                                            if (validateBr.cpf(value))
                                                value = maskBr.cpf(value)
                                            updateStateSubObject(
                                                'direct_contact',
                                                'cpf',
                                                value
                                            )
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                        {(state.type === 'client' ||
                            state.type === 'supplier') && (
                            <div className='col-12'>
                                <FormControl fullWidth>
                                    <InputLabel
                                        id='seller'
                                        color='black'
                                    >
                                        Vendedor:
                                    </InputLabel>
                                    <Select
                                        labelId='seller'
                                        label='Vendedor: '
                                        size='small'
                                        color='black'
                                        sx={{
                                            background: 'white',
                                            borderRadius: 2,
                                        }}
                                        value={state.seller}
                                        onChange={(e) =>
                                            updateState(
                                                'seller',
                                                e.target.value
                                            )
                                        }
                                    >
                                        <MenuItem value='gilvan'>
                                            Gilvan
                                        </MenuItem>
                                        <MenuItem value='vanortton'>
                                            Vanorton
                                        </MenuItem>
                                        <MenuItem value='people'>
                                            Pessoa
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        )}
                    </>
                )}
            </form>
        </Card>
    )
}

export default EntityRegistration
