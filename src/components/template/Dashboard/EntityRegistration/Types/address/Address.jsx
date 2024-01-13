import { TextField, Typography } from '@mui/material'
import { maskBr, validateBr } from 'js-brasil'
import useAPI from '../../../../../../hooks/useAPI'

function Address(props) {
    const { state, updateStateSubObject } = props
    const { APICep } = useAPI()

    const handleCepChange = (e) => {
        let value = e.target.value
        if (validateBr.cep(value)) {
            value = maskBr.cep(value)
            APICep(e.target.value).then((result) => {
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
        <form className='row g-3'>
            <Typography
                className='col-12'
                variant='h6'
            >
                Endereço
            </Typography>
            <div className='col-6'>
                <TextField
                    className='w-100'
                    label='Cep: '
                    variant='outlined'
                    size='small'
                    color='black'
                    value={state.address.cep || ''}
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
                    value={state.address.number || ''}
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
                    value={state.address.road || ''}
                    onChange={(e) =>
                        updateStateSubObject('address', 'road', e.target.value)
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
                    value={state.address.neighborhood || ''}
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
                    value={state.address.city || ''}
                    onChange={(e) =>
                        updateStateSubObject('address', 'city', e.target.value)
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
                    value={state.address.reference || ''}
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
                    label='UF: '
                    variant='outlined'
                    size='small'
                    color='black'
                    value={state.address.uf || ''}
                    onChange={(e) =>
                        updateStateSubObject('address', 'uf', e.target.value)
                    }
                />
            </div>
        </form>
    )
}
export default Address
