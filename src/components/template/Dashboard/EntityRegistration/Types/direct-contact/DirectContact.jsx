import { TextField, Typography } from '@mui/material'
import { maskBr, validateBr } from 'js-brasil'

function DirectContact(props) {
    const { state, updateStateSubObject } = props

    return (
        <form className='row g-3'>
            <div className='col-12 row g-3'>
                <Typography
                    className='col-12'
                    variant='h6'
                >
                    Contato direto:
                </Typography>
                <div className='col-12 col-md-6'>
                    <TextField
                        className='w-100'
                        label='Nome: '
                        variant='outlined'
                        size='small'
                        color='black'
                        value={state.direct_contact.name || ''}
                        onChange={(e) =>
                            updateStateSubObject(
                                'direct_contact',
                                'name',
                                e.target.value
                            )
                        }
                    />
                </div>
                <div className='col-12 col-md-6'>
                    <TextField
                        className='w-100'
                        label='Email: '
                        variant='outlined'
                        size='small'
                        color='black'
                        value={state.direct_contact.email || ''}
                        onChange={(e) =>
                            updateStateSubObject(
                                'direct_contact',
                                'email',
                                e.target.value
                            )
                        }
                    />
                </div>
                <div className='col-12 col-md-6'>
                    <TextField
                        className='w-100'
                        label='Telefone: '
                        variant='outlined'
                        size='small'
                        color='black'
                        value={state.direct_contact.phone || ''}
                        onChange={(e) => {
                            let value = e.target.value
                            if (validateBr.telefone(value))
                                value = maskBr.telefone(value)
                            else value = value.replace(/\D/g, '')
                            updateStateSubObject(
                                'direct_contact',
                                'phone',
                                value
                            )
                        }}
                    />
                </div>
                <div className='col-12 col-md-6'>
                    <TextField
                        className='w-100'
                        label='Data de nascimento: '
                        variant='outlined'
                        size='small'
                        color='black'
                        value={state.direct_contact.birth_of_date}
                        onChange={(e) => {
                            let value = e.target.value
                            if (
                                value.length === 8 &&
                                !isNaN(parseFloat(value)) &&
                                isFinite(value)
                            )
                                value = value.replace(
                                    /(\d{2})(\d{2})(\d{4})/,
                                    '$1/$2/$3'
                                )
                            else value = value.replace(/\D/g, '')
                            updateStateSubObject(
                                'direct_contact',
                                'birth_of_date',
                                value
                            )
                        }}
                    />
                </div>
                <div className='col-12 col-md-6'>
                    <TextField
                        className='w-100'
                        label='CPF: '
                        variant='outlined'
                        size='small'
                        color='black'
                        value={state.direct_contact.cpf || ''}
                        onChange={(e) => {
                            let value = e.target.value
                            if (validateBr.cpf(value)) value = maskBr.cpf(value)
                            else value = value.replace(/\D/g, '')
                            updateStateSubObject('direct_contact', 'cpf', value)
                        }}
                    />
                </div>
            </div>
        </form>
    )
}
export default DirectContact
