import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useFirebase from './../../../../../hooks/useFirebase'
import { TextField, Typography } from '@mui/material'

function StepOne({ budgetData, setBudgetData }) {
    const { clientId } = useParams()
    const { getDocumentById } = useFirebase()

    useEffect(() => {
        getDocumentById('clients', clientId).then((client) => {
            setBudgetData('client', client)
        })
    })

    return (
        <form className='row g-3'>
            <Typography variant='h5'>Dados do Cliente</Typography>
            <div className='col-6'>
                <TextField
                    size='small'
                    color='black'
                    label='Razão Social: '
                    className='w-100'
                ></TextField>
            </div>
            <div className='col-6'>
                <TextField
                    size='small'
                    color='black'
                    label='Telefone: '
                    className='w-100'
                ></TextField>
            </div>
            <div className='col-6'>
                <TextField
                    size='small'
                    color='black'
                    label='CNPJ: '
                    className='w-100'
                ></TextField>
            </div>
            <div className='col-6'>
                <TextField
                    size='small'
                    color='black'
                    label='E-mail: '
                    className='w-100'
                ></TextField>
            </div>
            <div className='col-6'>
                <TextField
                    size='small'
                    color='black'
                    label='Vendedor: '
                    className='w-100'
                ></TextField>
            </div>
            <Typography
                variant='h5'
                className='mt-3'
            >
                Endereço de instalação
            </Typography>
            <div className='col-6'>
                <TextField
                    size='small'
                    color='black'
                    label='Endereço: '
                    className='w-100'
                ></TextField>
            </div>
            <div className='col-6'>
                <TextField
                    size='small'
                    color='black'
                    label='Número: '
                    className='w-100'
                ></TextField>
            </div>
            <div className='col-6'>
                <TextField
                    size='small'
                    color='black'
                    label='Bairro: '
                    className='w-100'
                ></TextField>
            </div>
            <div className='col-6'>
                <TextField
                    size='small'
                    color='black'
                    label='Cidade: '
                    className='w-100'
                ></TextField>
            </div>
            <div className='col-6'>
                <TextField
                    size='small'
                    color='black'
                    label='Estado: '
                    className='w-100'
                ></TextField>
            </div>
            <div className='col-6'>
                <TextField
                    size='small'
                    color='black'
                    label='Cep: '
                    className='w-100'
                ></TextField>
            </div>
        </form>
    )
}

export default StepOne
