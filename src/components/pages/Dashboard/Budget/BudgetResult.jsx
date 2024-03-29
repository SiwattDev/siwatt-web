import {
    MapRounded,
    MonetizationOnRounded,
    SolarPowerRounded,
} from '@mui/icons-material'
import { Box, Paper, Typography } from '@mui/material'
import axios from 'axios'
import 'chart.js/auto'
import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import useFirebase from '../../../../hooks/useFirebase'

function BudgetResult() {
    const [result, setResult] = useState()
    const { getDocumentById } = useFirebase()
    const budget = {
        client: 'EhNg5OfiouDAqGT',
        consumption: {
            accountForInstallation: {
                name: 'Empresa',
                months: {
                    jan: 3000,
                    fev: 3000,
                    mar: 3000,
                    abr: 3000,
                    mai: 3000,
                    jun: 3000,
                    jul: 3000,
                    ago: 3000,
                    set: 3000,
                    out: 3000,
                    nov: 3000,
                    dez: 3000,
                },
                id: 'Gv9q4ToVateAlQI',
            },
            typeCeiling: 'ceramics',
            typeNetwork: 'three-phase',
            energyBills: [
                {
                    name: 'Empresa',
                    months: {
                        jan: 3000,
                        fev: 3000,
                        mar: 3000,
                        abr: 3000,
                        mai: 3000,
                        jun: 3000,
                        jul: 3000,
                        ago: 3000,
                        set: 3000,
                        out: 3000,
                        nov: 3000,
                        dez: 3000,
                    },
                    id: 'Gv9q4ToVateAlQI',
                },
            ],
        },
        solarPlantSite: {
            state: 29,
            city: 'Feira de Santana',
        },
        kit: {
            id: 'bAA6UyLrGxckyL5',
            modules: {
                id: 'BUjwXyVWPn3GGRV',
                model: 'SolarMax X545',
                unitPrice: 2200,
                totalPrice: 103008.12,
                amount: 47,
                power: '545',
            },
            inverter: {
                id: '2pnqfwtyWaaBdN8',
                model: 'InversorMax Y30000',
                unitPrice: 45000,
                totalPrice: 45000,
                amount: 1,
                powerMax: '30',
            },
        },
        validity: '2024-03-31',
    }

    function calculateAverageEnergyBill(budgetData) {
        let totalMonths = budgetData.consumption.energyBills.reduce(
            (total, bill) => {
                let monthlyTotal = Object.values(bill.months).reduce(
                    (sum, value) => sum + Number(value),
                    0
                )
                return total + monthlyTotal
            },
            0
        )
        let totalBills = budgetData.consumption.energyBills.length * 12
        return totalMonths / totalBills
    }

    const colors = [
        'rgb(255, 99, 132)', // Vermelho
        'rgb(75, 192, 192)', // Verde-água
        'rgb(255, 205, 86)', // Amarelo
        'rgb(201, 203, 207)', // Cinza
        'rgb(54, 162, 235)', // Azul
        // Adicione mais cores conforme necessário
    ]

    // Função para embaralhar um array
    function shuffle(array) {
        let currentIndex = array.length,
            temporaryValue,
            randomIndex

        // Enquanto ainda houver elementos para embaralhar...
        while (0 !== currentIndex) {
            // Escolhe um elemento restante...
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex -= 1

            // E troca com o elemento atual.
            temporaryValue = array[currentIndex]
            array[currentIndex] = array[randomIndex]
            array[randomIndex] = temporaryValue
        }

        return array
    }

    // Embaralha a lista de cores
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const clientData = await getDocumentById(
                    'clients',
                    budget.client
                )
                console.log('Dados do cliente:', clientData)
                const sellerData = await getDocumentById(
                    'users',
                    clientData.seller
                )
                console.log('Dados do vendedor:', sellerData)

                const clientObj = { ...clientData, seller: { ...sellerData } }

                const body = {
                    cityName: budget.solarPlantSite.city,
                    averageConsumption: calculateAverageEnergyBill(budget),
                    powerSupplyType: budget.consumption.typeNetwork,
                    panelPower: budget.kit.modules.power,
                }
                console.log(body)

                const apiResponse = await axios.post(
                    'https://backend.siwatt.com.br/api/calculate-solar-energy',
                    body
                )
                console.log(apiResponse.data)
                const result = {
                    ...budget,
                    client: clientObj,
                    ...apiResponse.data,
                }
                setResult(result)
            } catch (error) {
                console.error(error)
            }
        }

        fetchData()
    }, [])

    useEffect(() => {
        console.log('Result changed', result)
    }, [result])

    return (
        <Box>
            <Paper className='p-4 position-relative'>
                {result && (
                    <>
                        <Typography className='fw-bold' variant='h6'>
                            Dados do cliente
                        </Typography>
                        <Paper className='p-3 mb-3' elevation={2}>
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
                        <Paper elevation={2} className='p-3 mb-3'>
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
                            <Paper className='p-3 w-100' elevation={2}>
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
                            <Paper className='p-3 w-100' elevation={2}>
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
                                gridGap: '10px',
                            }}
                        >
                            <Paper
                                className='p-3 w-100 text-center'
                                elevation={2}
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
                                elevation={2}
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
                                elevation={2}
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
                                elevation={2}
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
                    </>
                )}
            </Paper>
        </Box>
    )
}
export default BudgetResult
