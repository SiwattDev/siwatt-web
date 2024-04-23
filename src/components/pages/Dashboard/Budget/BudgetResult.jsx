import {
    DownloadRounded,
    EnergySavingsLeafRounded,
    MapRounded,
    MonetizationOnRounded,
    SavingsRounded,
    SolarPowerRounded,
} from '@mui/icons-material'
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    Paper,
    Typography,
} from '@mui/material'
import axios from 'axios'
import 'chart.js/auto'
import { useContext, useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { useParams } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { BudgetContext } from '../../../../contexts/budgetContext'
import useFirebase from '../../../../hooks/useFirebase'
import useUtilities from '../../../../hooks/useUtilities'

function BudgetResult() {
    const { id: budgetID } = useParams()
    const { budget, setBudget } = useContext(BudgetContext)
    const [result, setResult] = useState()
    const [loading, setLoading] = useState(true)
    const { getDocumentById, createDocument } = useFirebase()
    const { showToastMessage } = useUtilities()

    function calculateAverageEnergyBill(budgetData) {
        let monthlyTotal = {
            jan: 0,
            fev: 0,
            mar: 0,
            abr: 0,
            mai: 0,
            jun: 0,
            jul: 0,
            ago: 0,
            set: 0,
            out: 0,
            nov: 0,
            dez: 0,
        }
        budgetData.consumption.energyBills.forEach((bill) => {
            Object.entries(bill.months).forEach(([month, value]) => {
                monthlyTotal[month.toLowerCase()] += Number(value)
            })
        })
        let totalConsumption = Object.values(monthlyTotal).reduce(
            (total, value) => total + value,
            0
        )
        let totalMonths = Object.keys(monthlyTotal).length
        return totalConsumption / totalMonths
    }

    const colors = [
        'rgb(75, 192, 192)',
        'rgb(255, 205, 86)',
        'rgb(201, 203, 207)',
        'rgb(54, 162, 235)',
        'rgb(255, 159, 64)',
        'rgb(255, 99, 71)',
    ]

    function shuffle(array) {
        let currentIndex = array.length,
            temporaryValue,
            randomIndex

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex -= 1
            temporaryValue = array[currentIndex]
            array[currentIndex] = array[randomIndex]
            array[randomIndex] = temporaryValue
        }

        return array
    }

    const shuffledColors = shuffle(colors)

    function translateCeilingType(typeCeiling) {
        switch (typeCeiling) {
            case 'fiber-cement':
                return 'Fibrocimento'
            case 'ceramics':
                return 'Cerâmica'
            case 'metallic':
                return 'Metálico'
            case 'slab':
                return 'Laje'
            default:
                return 'Desconhecido'
        }
    }

    function generateUniqueNumber() {
        const date = new Date()
        const dateString =
            ('0' + date.getDate()).slice(-2) +
            ('0' + (date.getMonth() + 1)).slice(-2) +
            String(date.getFullYear()).slice(-2)
        const randomString = Math.floor(Math.random() * 100)
            .toString()
            .padStart(2, '0')
        const uniqueNumber = dateString + randomString
        return uniqueNumber
    }

    async function downloadPDF() {
        try {
            const response = await axios({
                url: 'https://backend.siwatt.com.br/api/generate-pdf',
                method: 'POST',
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(result),
            })

            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `Orç. ${result.client.name}.pdf`)
            document.body.appendChild(link)
            link.click()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Erro:', error)
        }
    }

    useEffect(() => {
        const fetchData = async (budgetData = budget) => {
            console.log(budgetData)
            try {
                const clientData = await getDocumentById(
                    'clients',
                    budgetData.client.id || budgetData.client
                )
                console.log('Dados do cliente:', clientData)
                const sellerData = await getDocumentById(
                    'users',
                    clientData.seller
                )
                console.log('Dados do vendedor:', sellerData)

                const clientObj = {
                    ...clientData,
                    seller: { ...sellerData },
                }

                const body = {
                    cityName: budgetData.solarPlantSite.city,
                    averageConsumption: calculateAverageEnergyBill(budgetData),
                    powerSupplyType: budgetData.consumption.typeNetwork,
                    panelPower: budgetData.kit.modules.power,
                    kitPrice:
                        budgetData.kit.modules.totalPrice +
                        budgetData.kit.inverter.totalPrice,
                }
                console.log(body)

                const apiResponse = await axios.post(
                    'https://backend.siwatt.com.br/api/calculate-solar-energy',
                    body
                )

                console.log(apiResponse.data)
                const result = {
                    id: generateUniqueNumber(),
                    ...budgetData,
                    client: clientObj,
                    ...apiResponse.data,
                    createdAt: new Date(),
                }

                setResult(result)
                setLoading(false)
                setBudget(null)

                if (!budgetID) {
                    createDocument('budgets', result.id, result)
                        .then(() => {
                            showToastMessage(
                                'success',
                                'Orçamento gerado com sucesso'
                            )
                        })
                        .catch((error) => {
                            console.error(error)
                            showToastMessage(
                                'error',
                                'Error inesperado ao tentar gerar orçamento'
                            )
                        })
                }
            } catch (error) {
                console.error(error)
            }
        }

        if (budgetID) {
            getDocumentById('budgets', budgetID).then((data) => {
                setBudget(data)
                fetchData(data)
            })
        } else fetchData()
    }, [])

    useEffect(() => {
        console.log('Result changed', result)
    }, [result])

    return (
        <Box>
            <Paper className='p-4 position-relative'>
                {loading && (
                    <Box
                        sx={{
                            display: 'flex',
                            width: '100%',
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <CircularProgress color='black' />
                    </Box>
                )}
                {result && !loading && (
                    <>
                        <Typography className='fw-bold' variant='h6'>
                            Dados do cliente
                        </Typography>
                        <Paper className='p-3 mb-3' elevation={3}>
                            <Typography>
                                <strong>Razão social:</strong>{' '}
                                {result.client.name}
                            </Typography>
                            <Typography>
                                <strong>E-mail:</strong> {result.client.email}
                            </Typography>
                            <Typography>
                                <strong>Telefone:</strong> {result.client.phone}
                            </Typography>
                            <Typography>
                                <strong>Endereço:</strong>{' '}
                                {result.client.address.city},{' '}
                                {result.client.address.uf},{' '}
                                {result.client.address.cep}
                            </Typography>
                        </Paper>
                        <Typography className='fw-bold' variant='h6'>
                            Dados do vendedor
                        </Typography>
                        <Paper elevation={3} className='p-3 mb-3'>
                            <Typography>
                                <strong>Nome fantasia:</strong>{' '}
                                {result.client.seller.name}
                            </Typography>
                            <Typography>
                                <strong>E-mail:</strong>{' '}
                                {result.client.seller.email}
                            </Typography>
                            <Typography>
                                <strong>Telefone:</strong>{' '}
                                {result.client.seller.phone}
                            </Typography>
                            <Typography>
                                <strong>Endereço:</strong>{' '}
                                {result.client.seller.address.city},{' '}
                                {result.client.seller.address.uf},{' '}
                                {result.client.seller.address.cep}
                            </Typography>
                        </Paper>
                        <Box
                            sx={{
                                width: '100%',
                                maxWidth: '800px',
                            }}
                            className='m-auto'
                        >
                            <Bar
                                className='mb-3'
                                data={{
                                    labels: [
                                        'Jan',
                                        'Fev',
                                        'Mar',
                                        'Abr',
                                        'Mai',
                                        'Jun',
                                        'Jul',
                                        'Ago',
                                        'Set',
                                        'Out',
                                        'Nov',
                                        'Dez',
                                    ],
                                    datasets: [
                                        {
                                            label: 'Geração Estimada',
                                            data: result.energyGeneration,
                                            backgroundColor: ['rgb(0, 0, 0)'],
                                            borderWidth: 0,
                                        },
                                        ...result.consumption.energyBills.map(
                                            (energyBill, index) => {
                                                return {
                                                    label: energyBill.name,
                                                    data: Object.values(
                                                        energyBill.months
                                                    ),
                                                    backgroundColor: [
                                                        shuffledColors[
                                                            index %
                                                                shuffledColors.length
                                                        ],
                                                    ],
                                                    borderWidth: 0,
                                                }
                                            }
                                        ),
                                    ],
                                }}
                                options={{
                                    plugins: {
                                        title: {
                                            display: true,
                                            text: 'Geração Mensal (KWh)',
                                            color: 'rgb(0, 0, 0)',
                                            font: {
                                                size: 20,
                                                family: 'Aptos',
                                            },
                                        },
                                    },
                                }}
                            />
                        </Box>
                        <Typography className='fw-bold' variant='h6'>
                            Kit Fotovoltaico
                        </Typography>
                        <Box className='d-flex gap-3 mb-3'>
                            <Paper className='p-3 w-100' elevation={3}>
                                <Typography className='fw-bold' variant='h6'>
                                    <strong>Placas:</strong>{' '}
                                    {result.kit.modules.model}
                                </Typography>
                                <Typography>
                                    <strong>Quantidade:</strong>{' '}
                                    {result.kit.modules.amount} placas
                                </Typography>
                                <Typography>
                                    <strong>Potência:</strong>{' '}
                                    {result.kit.modules.power} KWp
                                </Typography>
                                <Typography>
                                    <strong>Preço total:</strong>{' '}
                                    {result.kit.modules.totalPrice.toLocaleString(
                                        'pt-BR',
                                        { style: 'currency', currency: 'BRL' }
                                    )}
                                </Typography>
                                <Typography>
                                    <strong>Preço por unidade:</strong>{' '}
                                    {result.kit.modules.unitPrice.toLocaleString(
                                        'pt-BR',
                                        { style: 'currency', currency: 'BRL' }
                                    )}
                                </Typography>
                            </Paper>
                            <Paper className='p-3 w-100' elevation={3}>
                                <Typography className='fw-bold' variant='h6'>
                                    <strong>Inversor:</strong>{' '}
                                    {result.kit.inverter.model}
                                </Typography>
                                <Typography>
                                    <strong>Quantidade:</strong>{' '}
                                    {result.kit.inverter.amount} inversor(es)
                                </Typography>
                                <Typography>
                                    <strong>Potência máxima:</strong>{' '}
                                    {result.kit.inverter.powerMax} KWp
                                </Typography>
                                <Typography>
                                    <strong>Preço total:</strong>{' '}
                                    {result.kit.inverter.totalPrice.toLocaleString(
                                        'pt-BR',
                                        { style: 'currency', currency: 'BRL' }
                                    )}
                                </Typography>
                                <Typography>
                                    <strong>Preço por unidade:</strong>{' '}
                                    {result.kit.inverter.unitPrice.toLocaleString(
                                        'pt-BR',
                                        { style: 'currency', currency: 'BRL' }
                                    )}
                                </Typography>
                            </Paper>
                        </Box>
                        <Typography variant='h6'>
                            <strong>Tipo de telhado:</strong>{' '}
                            {translateCeilingType(
                                result.consumption.typeCeiling
                            )}
                        </Typography>
                        <Typography variant='h6' className='fw-bold'>
                            Investimento
                        </Typography>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gridGap: '1rem',
                                marginBottom: '10px',
                            }}
                        >
                            <Paper
                                className='p-3 w-100 text-center'
                                elevation={3}
                            >
                                <Typography className='fw-bold'>
                                    <MonetizationOnRounded />
                                    {'  '}
                                    Valor do Investimento
                                </Typography>
                                <Typography>
                                    {result.plantValue.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    })}
                                </Typography>
                            </Paper>
                            <Paper
                                className='p-3 w-100 text-center'
                                elevation={3}
                            >
                                <Typography className='fw-bold'>
                                    <SolarPowerRounded />
                                    {'  '}
                                    Quantidade de Placas
                                </Typography>
                                <Typography>
                                    {result.kit.modules.amount} unidades
                                </Typography>
                            </Paper>
                            <Paper
                                className='p-3 w-100 text-center'
                                elevation={3}
                            >
                                <Typography className='fw-bold'>
                                    <MapRounded />
                                    {'  '}
                                    Tamanho da Usina (m²)
                                </Typography>
                                <Typography>{result.areaNeeded} m²</Typography>
                            </Paper>
                            <Paper
                                className='p-3 w-100 text-center'
                                elevation={3}
                            >
                                <Typography className='fw-bold'>
                                    <MonetizationOnRounded />
                                    {'  '}
                                    Tamanho da Usina (KWp)
                                </Typography>
                                <Typography>
                                    {result.peakGeneration.toFixed(2)} KWp
                                </Typography>
                            </Paper>
                        </Box>
                        <Box className='d-flex gap-3 mb-3'>
                            <Box className='w-100 text-center'>
                                <Typography variant='h6' className='fw-bold'>
                                    Geração em KW
                                </Typography>
                                <Paper
                                    className='p-3 w-100 text-center d-flex align-items-center justify-content-center gap-3'
                                    elevation={3}
                                >
                                    <EnergySavingsLeafRounded />
                                    <Box>
                                        <Typography>
                                            <strong>Geração de KWh/mês:</strong>{' '}
                                            {result.averageEnergyGeneration.toFixed(
                                                0
                                            )}
                                        </Typography>
                                        <Typography>
                                            <strong>Geração de KWh/ano:</strong>{' '}
                                            {result.averageEnergyGeneration.toFixed(
                                                0
                                            ) * 12}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Box>
                            <Box className='w-100 text-center'>
                                <Typography variant='h6' className='fw-bold'>
                                    Economia em R$
                                </Typography>
                                <Paper
                                    className='p-3 w-100 text-center d-flex align-items-center justify-content-center gap-3'
                                    elevation={3}
                                >
                                    <SavingsRounded />
                                    <Box>
                                        <Typography>
                                            <strong>Economia mensal:</strong>{' '}
                                            {result.investmentReturnPayback.monthlySavings.toLocaleString(
                                                'pt-BR',
                                                {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                }
                                            )}
                                        </Typography>
                                        <Typography>
                                            <strong>Economia anual:</strong>{' '}
                                            {(
                                                result.investmentReturnPayback
                                                    .monthlySavings * 12
                                            ).toLocaleString('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL',
                                            })}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Box>
                        </Box>
                        <Typography variant='h6' className='fw-bold'>
                            Validade da Proposta
                        </Typography>
                        <Paper className='p-3 w-100 mb-3' elevation={3}>
                            <Typography>
                                <strong>Proposta emitida em:</strong>{' '}
                                {new Date().toLocaleDateString('pt-BR')}
                            </Typography>
                            <Typography>
                                <strong>Proposta valida até:</strong>{' '}
                                {result.validity.split('-').reverse().join('/')}
                            </Typography>
                        </Paper>
                        <Typography variant='h6' className='fw-bold'>
                            Formas e Condições de Pagamento
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={2}>
                                <Paper
                                    className='p-3 text-center d-flex flex-column justify-content-center'
                                    elevation={3}
                                    sx={{ height: '100%' }}
                                >
                                    <Typography
                                        variant='h5'
                                        className='fw-bold mb-3'
                                    >
                                        A vista
                                    </Typography>
                                    <Typography variant='h6'>
                                        {result.plantValue.toLocaleString(
                                            'pt-BR',
                                            {
                                                style: 'currency',
                                                currency: 'BRL',
                                            }
                                        )}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={10}>
                                <Paper className='p-3' elevation={3}>
                                    <Typography
                                        variant='h6'
                                        className='fw-bold'
                                    >
                                        Financiamento bancário
                                    </Typography>
                                    <Typography>
                                        <strong>Com entrada de 10%:</strong>{' '}
                                        {(
                                            result.plantValue * 0.1
                                        ).toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL',
                                        })}
                                    </Typography>
                                    <Typography>
                                        <strong>Financiamento de:</strong>{' '}
                                        {(
                                            result.plantValue -
                                            result.plantValue * 0.1
                                        ).toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL',
                                        })}
                                    </Typography>
                                    <Box className='d-flex'>
                                        <Box className='w-100'>
                                            {[24, 36, 48].map(
                                                (amount, index) => (
                                                    <Typography key={index}>
                                                        <strong>
                                                            {amount}x:
                                                        </strong>{' '}
                                                        {result.bankFinancingInstallments[
                                                            index
                                                        ].toLocaleString(
                                                            'pt-BR',
                                                            {
                                                                style: 'currency',
                                                                currency: 'BRL',
                                                            }
                                                        )}
                                                    </Typography>
                                                )
                                            )}
                                        </Box>
                                        <Box className='w-100'>
                                            {[60, 90, 120].map(
                                                (amount, index) => (
                                                    <Typography key={index}>
                                                        <strong>
                                                            {amount}x:
                                                        </strong>{' '}
                                                        {result.bankFinancingInstallments[
                                                            index + 3
                                                        ].toLocaleString(
                                                            'pt-BR',
                                                            {
                                                                style: 'currency',
                                                                currency: 'BRL',
                                                            }
                                                        )}
                                                    </Typography>
                                                )
                                            )}
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                        <Paper elevation={3} className='p-3 my-3'>
                            <Typography variant='h6' className='fw-bold'>
                                Cartão de crédito
                            </Typography>
                            <Box className='d-flex gap-3'>
                                {[2, 4, 8, 10, 12].map((amount, index) => (
                                    <Paper
                                        key={index}
                                        elevation={3}
                                        className='p-3 w-100'
                                    >
                                        <Typography>
                                            <strong>{amount}x:</strong>
                                        </Typography>
                                        <Typography>
                                            {result.creditCardInstallments[
                                                index
                                            ].toLocaleString('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL',
                                            })}
                                        </Typography>
                                    </Paper>
                                ))}
                            </Box>
                        </Paper>
                        <Paper className='p-3' elevation={3}>
                            <Paper className='p-3 text-center' elevation={3}>
                                <Typography variant='h4' className='fw-bold'>
                                    Payback
                                </Typography>
                                <Typography variant='h6' className='fw-bold'>
                                    {
                                        result.investmentReturnPayback
                                            .paybackInYears
                                    }{' '}
                                    anos e{' '}
                                    {
                                        result.investmentReturnPayback
                                            .remainingMonths
                                    }{' '}
                                    meses
                                </Typography>
                            </Paper>
                            <Box
                                sx={{
                                    width: '100%',
                                    maxWidth: '800px',
                                }}
                                className='m-auto'
                            >
                                <Bar
                                    className='mb-3'
                                    data={{
                                        labels: [
                                            '1 ano',
                                            '2 anos',
                                            '3 anos',
                                            '4 anos',
                                            '5 anos',
                                            '6 anos',
                                            '7 anos',
                                            '8 anos',
                                            '9 anos',
                                            '10 anos',
                                            '11 anos',
                                            '12 anos',
                                            '13 anos',
                                            '14 anos',
                                            '15 anos',
                                            '16 anos',
                                            '17 anos',
                                            '18 anos',
                                            '19 anos',
                                            '20 anos',
                                            '21 anos',
                                            '22 anos',
                                            '23 anos',
                                            '24 anos',
                                            '25 anos',
                                        ],
                                        datasets: [
                                            {
                                                label: 'Retorno Financeiro',
                                                data: result.investmentReturnPayback.returnIn25Years.map(
                                                    (value) => value.toFixed(2)
                                                ),
                                                backgroundColor: 'rgb(0, 0, 0)',
                                                borderWidth: 0,
                                            },
                                        ],
                                    }}
                                    options={{
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: 'Payback em 25 anos',
                                                color: 'rgb(0, 0, 0)',
                                                font: {
                                                    size: 20,
                                                    family: 'Aptos',
                                                },
                                            },
                                        },
                                    }}
                                />
                            </Box>
                        </Paper>
                        <Paper className='p-3 my-3' elevation={3}>
                            <Box
                                sx={{
                                    width: '100%',
                                    maxWidth: '800px',
                                }}
                                className='m-auto'
                            >
                                <Bar
                                    className='mb-3'
                                    data={{
                                        labels: [
                                            '2 anos',
                                            '3 anos',
                                            '4 anos',
                                            '5 anos',
                                            '6 anos',
                                            '7 anos',
                                            '8 anos',
                                            '9 anos',
                                            '10 anos',
                                            '11 anos',
                                            '12 anos',
                                            '13 anos',
                                            '14 anos',
                                            '15 anos',
                                            '16 anos',
                                            '17 anos',
                                            '18 anos',
                                            '19 anos',
                                            '20 anos',
                                            '21 anos',
                                            '22 anos',
                                            '23 anos',
                                            '24 anos',
                                            '25 anos',
                                        ],
                                        datasets: [
                                            {
                                                label: 'Reajuste tarifário',
                                                data: result.tariffReadjustment
                                                    .slice(1)
                                                    .map((value) =>
                                                        value.toFixed(2)
                                                    ),
                                                backgroundColor: 'rgb(0, 0, 0)',
                                                borderWidth: 0,
                                            },
                                        ],
                                    }}
                                    options={{
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: 'Reajuste tarifário',
                                                color: 'rgb(0, 0, 0)',
                                                font: {
                                                    size: 20,
                                                    family: 'Aptos',
                                                },
                                            },
                                        },
                                    }}
                                />
                            </Box>
                        </Paper>
                        <Paper className='p-3' elevation={3}>
                            <Box
                                sx={{
                                    width: '100%',
                                    maxWidth: '800px',
                                }}
                                className='m-auto'
                            >
                                <Bar
                                    className='mb-3'
                                    data={{
                                        labels: [
                                            '2 anos',
                                            '3 anos',
                                            '4 anos',
                                            '5 anos',
                                            '6 anos',
                                            '7 anos',
                                            '8 anos',
                                            '9 anos',
                                            '10 anos',
                                            '11 anos',
                                            '12 anos',
                                            '13 anos',
                                            '14 anos',
                                            '15 anos',
                                            '16 anos',
                                            '17 anos',
                                            '18 anos',
                                            '19 anos',
                                            '20 anos',
                                            '21 anos',
                                            '22 anos',
                                            '23 anos',
                                            '24 anos',
                                            '25 anos',
                                        ],
                                        datasets: [
                                            {
                                                label: 'Rentabilidade total do investimento',
                                                data: result.investmentReturn
                                                    .slice(1)
                                                    .map((value) =>
                                                        value.toFixed(2)
                                                    ),
                                                backgroundColor: 'rgb(0, 0, 0)',
                                                borderWidth: 0,
                                            },
                                        ],
                                    }}
                                    options={{
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: 'Rentabilidade total do investimento',
                                                color: 'rgb(0, 0, 0)',
                                                font: {
                                                    size: 20,
                                                    family: 'Aptos',
                                                },
                                            },
                                        },
                                    }}
                                />
                            </Box>
                        </Paper>
                        <Button
                            variant='contained'
                            onClick={downloadPDF}
                            color='black'
                            className='mt-3'
                            startIcon={<DownloadRounded />}
                        >
                            Baixar PDF
                        </Button>
                    </>
                )}
            </Paper>
            <ToastContainer />
        </Box>
    )
}

export default BudgetResult
