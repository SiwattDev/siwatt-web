import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material'
import { maskBr, validateBr } from 'js-brasil'
import useAPI from '../../../../../hooks/useAPI'
import Address from './address/Address'
import DirectContact from './direct-contact/DirectContact'

function Client(props) {
    const { state, updateState, updateStateSubObject } = props
    const { APICNPJ } = useAPI()

    const cnpjAutoComplete = (e) => {
        let value = e.target.value
        if (validateBr.cnpj(value)) {
            value = maskBr.cnpj(value)
            APICNPJ(e.target.value)
                .then((result) => {
                    updateState('name', result.data.razao_social)
                    updateState(
                        'fantasy_name',
                        result.data.estabelecimento.nome_fantasia
                    )
                    updateState(
                        'state_registration',
                        result.data.estabelecimento.inscricoes_estaduais.filter(
                            (i) => i.ativo === true
                        )[0].inscricao_estadual
                    )
                    updateStateSubObject(
                        'address',
                        'cep',
                        result.data.estabelecimento.cep
                    )
                })
                .catch((err) => console.log(err))
        }
        updateState('cnpj', value)
    }

    return (
        <form className='row g-3'>
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
                        value={state.type_entity || ''}
                        onChange={(e) =>
                            updateState('type_entity', e.target.value)
                        }
                    >
                        <MenuItem value='individual'>Física</MenuItem>
                        <MenuItem value='legal-entity'>Jurídica</MenuItem>
                    </Select>
                </FormControl>
            </div>
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
                            value={state.cpf || ''}
                            onChange={(e) => {
                                let value = e.target.value
                                if (validateBr.cpf(value))
                                    value = maskBr.cpf(value)
                                else value = value.replace(/\D/g, '')
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
                            value={state.cnpj || ''}
                            onChange={(e) => cnpjAutoComplete(e)}
                        />
                    </div>
                    <div className='col-6'>
                        <TextField
                            className='w-100'
                            label='Inscrição estadual: '
                            variant='outlined'
                            size='small'
                            color='black'
                            value={state.state_registration || ''}
                            onChange={(e) => {
                                let value = e.target.value
                                updateState('state_registration', value)
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
                    value={state.name || ''}
                    onChange={(e) => updateState('name', e.target.value)}
                />
            </div>
            <div className='col-6'>
                <TextField
                    className='w-100'
                    label='Nome fantasia: '
                    variant='outlined'
                    size='small'
                    color='black'
                    value={state.fantasy_name || ''}
                    onChange={(e) =>
                        updateState('fantasy_name', e.target.value)
                    }
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
            {state.type_entity === 'legal-entity' && (
                <DirectContact
                    state={state}
                    updateStateSubObject={updateStateSubObject}
                />
            )}
        </form>
    )
}
export default Client
