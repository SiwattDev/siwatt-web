import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { BudgetContext } from '../../../../../contexts/budgetContext'
import useFirebase from '../../../../../hooks/useFirebase'

function StepReview() {
    const { budget } = useContext(BudgetContext)
    const { getDocumentById } = useFirebase()
    const [clientData, setClientData] = useState()
    const months = [
        'JAN',
        'FEV',
        'MAR',
        'ABR',
        'MAI',
        'JUN',
        'JUL',
        'AGO',
        'SET',
        'OUT',
        'NOV',
        'DEZ',
    ]

    useEffect(() => {
        getDocumentById('clients', budget.client).then(setClientData)
        console.log(budget.validity)
        const budgetString = JSON.stringify(budget)
        navigator.clipboard
            .writeText(budgetString)
            .then(() => {
                console.log('String JSON copiada com sucesso!')
            })
            .catch((err) => {
                console.error('Erro ao copiar a string JSON:', err)
            })
    }, [budget.client])

    return (
        <Box className='mt-4'>
            <Typography variant='h4' className='mb-3'>
                Revisão
            </Typography>

            <Paper className='p-3 mb-3 border shadow-sm'>
                <Typography variant='h5'>Cliente</Typography>
                {clientData && (
                    <>
                        <Typography>Nome: {clientData.name}</Typography>
                        <Typography>Telefone: {clientData.phone}</Typography>
                        <Typography>
                            {clientData.cnpj ? 'CNPJ: ' : 'CPF: '}
                            {clientData.cnpj || clientData.cpf}
                        </Typography>
                        <Typography>Email: {clientData.email}</Typography>
                        <Typography>Vendedor: {clientData.seller}</Typography>
                        <Typography>
                            Endereço: {clientData.address.cep},{' '}
                            {clientData.address.number},{' '}
                            {clientData.address.city}, {clientData.address.uf}
                        </Typography>
                    </>
                )}
            </Paper>

            <Paper className='p-3 mb-3 border shadow-sm'>
                <Typography variant='h5'>Conta para Instalação</Typography>
                <Typography>
                    {budget.consumption.accountForInstallation.name}
                </Typography>
            </Paper>

            <Paper className='p-3 mb-3 border shadow-sm'>
                <Typography variant='h5'>Tipo de Teto</Typography>
                <Typography>{budget.consumption.typeCeiling}</Typography>
            </Paper>

            <Paper className='p-3 mb-3 border shadow-sm'>
                <Typography variant='h5'>Tipo de Rede</Typography>
                <Typography>{budget.consumption.typeNetwork}</Typography>
            </Paper>

            <Paper className='p-3 mb-3 border shadow-sm'>
                <Typography variant='h5'>Contas de Energia</Typography>
                <Table className='table-sm'>
                    <TableHead>
                        <TableRow>
                            <TableCell>Unidade</TableCell>
                            {budget.consumption.energyBills.map((bill) => (
                                <TableCell key={bill.name}>
                                    {bill.name}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {months.map((month) => (
                            <TableRow key={month}>
                                <TableCell>{month}</TableCell>
                                {budget.consumption.energyBills.map((bill) => (
                                    <TableCell key={bill.name}>
                                        {bill.months[month.toLowerCase()]} KWp
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Paper className='p-3 mb-3 border shadow-sm'>
                <Typography variant='h5'>Kit Escolhido</Typography>
                <Paper className='p-3 mb-2 border shadow-sm'>
                    <Typography>Módulo: {budget.kit.modules.model}</Typography>
                    <Typography>
                        Quantidade de Módulos: {budget.kit.modules.amount}
                    </Typography>
                </Paper>
                <Paper className='p-3 border shadow-sm'>
                    <Typography>
                        Inversor: {budget.kit.inverter.model}
                    </Typography>
                    <Typography>
                        Quantidade de Inversores: {budget.kit.inverter.amount}
                    </Typography>
                </Paper>
            </Paper>

            <Paper className='p-3 mb-3 border shadow-sm'>
                <Typography variant='h5'>Validade</Typography>
                <Typography>{budget.validity}</Typography>
            </Paper>
        </Box>
    )
}

export default StepReview
