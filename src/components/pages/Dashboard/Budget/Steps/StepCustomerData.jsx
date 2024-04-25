import {
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Tooltip,
} from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { BudgetContext } from '../../../../../contexts/budgetContext'
import useFirebase from './../../../../../hooks/useFirebase'

const StepCustomerData = () => {
    const [clients, setClients] = useState()
    const [activeClient, setActiveClient] = useState({
        name: '',
        phone: '',
        cnpj: '',
        email: '',
        seller: '',
        address: {
            cep: '',
            uf: '',
            city: '',
            number: '',
        },
    })
    const { budget, setBudget } = useContext(BudgetContext)
    const { getDocumentsInCollection } = useFirebase()

    const getClients = () => {
        getDocumentsInCollection('/clients').then((clients) => {
            console.log(clients)
            if (clients) {
                setClients(clients)
            }
        })
    }

    useEffect(() => {
        getClients()
    }, [])

    useEffect(() => {
        if (clients && budget && budget.client)
            setActiveClient(
                clients.filter(
                    (cliente) =>
                        cliente.id === budget.client.id || budget.client
                )[0]
            )
    }, [clients])

    useEffect(() => {
        console.log(budget)
    }, [budget])

    return (
        <Grid container spacing={2} className='mt-2'>
            <Grid item xs={6}>
                <FormControl color='black' size='small' fullWidth>
                    <InputLabel>Cliente: </InputLabel>
                    <Select
                        label='Cliente: '
                        value={activeClient}
                        onChange={(e) => {
                            setBudget({ ...budget, client: e.target.value })
                            setActiveClient(
                                clients.filter(
                                    (cliente) => cliente.id === e.target.value
                                )[0]
                            )
                        }}
                    >
                        {clients &&
                            clients.map((client) => (
                                <MenuItem key={client.id} value={client.id}>
                                    {client.name}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6}>
                <Tooltip title='Selecione o cliente pelo seletor "Cliente"'>
                    <TextField
                        label='Razão social'
                        color='black'
                        size='small'
                        variant='outlined'
                        className='w-100'
                        value={activeClient.name}
                        disabled={true}
                    />
                </Tooltip>
            </Grid>
            <Grid item xs={6}>
                <Tooltip title='Selecione o cliente pelo seletor "Cliente"'>
                    <TextField
                        label='Telefone'
                        color='black'
                        size='small'
                        variant='outlined'
                        className='w-100'
                        value={activeClient.phone}
                        disabled={true}
                    />
                </Tooltip>
            </Grid>
            <Grid item xs={6}>
                <Tooltip title='Selecione o cliente pelo seletor "Cliente"'>
                    <TextField
                        label='CNPJ'
                        color='black'
                        size='small'
                        variant='outlined'
                        className='w-100'
                        value={activeClient.cnpj}
                        disabled={true}
                    />
                </Tooltip>
            </Grid>
            <Grid item xs={6}>
                <Tooltip title='Selecione o cliente pelo seletor "Cliente"'>
                    <TextField
                        label='E-mail'
                        color='black'
                        size='small'
                        variant='outlined'
                        className='w-100'
                        value={activeClient.email}
                        disabled={true}
                    />
                </Tooltip>
            </Grid>
            <Grid item xs={6}>
                <Tooltip title='Selecione o cliente pelo seletor "Cliente"'>
                    <TextField
                        label='Vendedor'
                        color='black'
                        size='small'
                        variant='outlined'
                        className='w-100'
                        value={activeClient.seller}
                        disabled={true}
                    />
                </Tooltip>
            </Grid>
            <Grid item xs={6}>
                <Tooltip title='Selecione o cliente pelo seletor "Cliente"'>
                    <TextField
                        label='Cep'
                        color='black'
                        size='small'
                        variant='outlined'
                        className='w-100'
                        value={activeClient.address.cep}
                        disabled={true}
                    />
                </Tooltip>
            </Grid>
            <Grid item xs={6}>
                <Tooltip title='Selecione o cliente pelo seletor "Cliente"'>
                    <TextField
                        label='Estado'
                        color='black'
                        size='small'
                        variant='outlined'
                        className='w-100'
                        value={activeClient.address.uf}
                        disabled={true}
                    />
                </Tooltip>
            </Grid>
            <Grid item xs={6}>
                <Tooltip title='Selecione o cliente pelo seletor "Cliente"'>
                    <TextField
                        label='Cidade'
                        color='black'
                        size='small'
                        variant='outlined'
                        className='w-100'
                        value={activeClient.address.city}
                        disabled={true}
                    />
                </Tooltip>
            </Grid>
            <Grid item xs={6}>
                <Tooltip title='Selecione o cliente pelo seletor "Cliente"'>
                    <TextField
                        label='Número'
                        color='black'
                        size='small'
                        variant='outlined'
                        className='w-100'
                        value={activeClient.address.number}
                        disabled={true}
                    />
                </Tooltip>
            </Grid>
        </Grid>
    )
}

export default StepCustomerData
