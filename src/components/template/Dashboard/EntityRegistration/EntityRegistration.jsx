import {
    Card,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material'
import { useState } from 'react'

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
            neighborhood: null,
            city: null,
            reference: null,
            address: null,
            cep: null,
            uf: null,
        },
        seller: null,
        direct_contact: {
            name: null,
            email: null,
            phone: null,
            birth_date: null,
            direct_contact_cpf: null,
        },
    })

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
                                onChange={(e) =>
                                    updateState('phone', e.target.value)
                                }
                            />
                        </div>
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
                        {state.type_entity === 'individual' && (
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
                                    />
                                </div>
                                <div className='col-6'>
                                    <TextField
                                        className='w-100'
                                        label='Inscrição municipal: '
                                        variant='outlined'
                                        size='small'
                                        color='black'
                                        sx={{
                                            background: 'white',
                                            borderRadius: 2,
                                        }}
                                    />
                                </div>
                            </>
                        )}
                        <div className='col-6'>
                            <TextField
                                className='w-100'
                                label='Cep: '
                                variant='outlined'
                                size='small'
                                color='black'
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
                                    >
                                        <MenuItem value=''>Gilvan</MenuItem>
                                        <MenuItem value=''>Vanorton</MenuItem>
                                        <MenuItem value=''>Pessoa</MenuItem>
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
