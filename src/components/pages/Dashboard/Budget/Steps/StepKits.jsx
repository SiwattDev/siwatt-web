import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Paper,
    TextField,
    Typography,
} from '@mui/material'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { BudgetContext } from '../../../../../contexts/budgetContext'
import useFirebase from './../../../../../hooks/useFirebase'
import useUtilities from './../../../../../hooks/useUtilities'

function StepKits({ supplyType = 'Three-phase' }) {
    const [products, setProducts] = useState()
    const [kits, setKits] = useState([])
    const [loading, setLoading] = useState(true)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [editedKit, setEditedKit] = useState(null)
    const { generateCode } = useUtilities()
    const { budget, setBudget } = useContext(BudgetContext)
    const firebase = useFirebase()

    const openEditDialog = (kit) => {
        setEditedKit(kit)
        setEditDialogOpen(true)
    }

    const closeEditDialog = () => {
        setEditedKit(null)
        setEditDialogOpen(false)
    }

    const saveEditedKit = () => {
        console.log('Edited Kit Before Update:', editedKit)
        const updatedKits = kits.map((kitItem) => {
            if (kitItem.id === editedKit.id) {
                return editedKit
            }
            return kitItem
        })
        console.log('Updated Kits:', updatedKits)

        setKits(updatedKits)

        closeEditDialog()
    }

    function getProducts() {
        return new Promise((resolve, reject) => {
            firebase
                .getDocumentsInCollection('kits/itens/itens')
                .then((data) => {
                    const result = data.filter((prod) => prod.delete !== true)
                    resolve(result)
                })
                .catch((error) => {
                    console.error(error)
                    reject(error)
                })
        })
    }

    function getNeededPower(averageConsumption, supplyType, solarIrradiation) {
        const supplyTypeValues = {
            'Single-phase': 30,
            'Two-phase': 50,
            'Three-phase': 100,
        }

        const supplyTypeValue = supplyTypeValues[supplyType] || 0
        const average = solarIrradiation
        const result =
            (averageConsumption - supplyTypeValue) / 30 / (average * 0.75)

        return result
    }

    function chooseModulesAndInverters(products, neededPower) {
        console.log(neededPower)
        const modules = products.filter((prod) => prod.type === 'module')

        const modulesWithPrice = modules.map((mod) => {
            const modPower = mod.power / 1000
            const modPrice = parseFloat(
                mod.price
                    .split(',')[0]
                    .replace('R$ ', '')
                    .replace(',', '')
                    .replace('.', '')
            )
            const quantityNeeded = neededPower / modPower
            const totalPrice = modPrice * quantityNeeded
            return {
                id: mod.id,
                model: mod.model,
                quantityNeeded,
                totalPrice,
                pricePerUnit: modPrice,
                power: mod.power,
            }
        })

        modulesWithPrice.sort((a, b) => {
            if (a.quantityNeeded !== b.quantityNeeded)
                return a.quantityNeeded - b.quantityNeeded
            else return a.totalPrice - b.totalPrice
        })

        const topThreeOptions = modulesWithPrice.slice(0, 3)
        const inverters = products.filter((prod) => prod.type === 'inverter')
        console.log(inverters)
        const compatibleInverters = inverters.filter(
            (inverter) =>
                inverter.power >= neededPower &&
                inverter.power <= neededPower * 2
        )

        let bestInverter = null
        if (compatibleInverters.length > 0) {
            compatibleInverters.sort((a, b) => a.price - b.price)
            bestInverter = {
                id: compatibleInverters[0].id,
                model: compatibleInverters[0].model,
                amount: 1,
                power: compatibleInverters[0].power,
                pricePerUnit: parseFloat(
                    compatibleInverters[0].price
                        .split(',')[0]
                        .replace('R$', '')
                        .replace(',', '')
                        .replace('.', '')
                ),
                totalPrice: parseFloat(
                    compatibleInverters[0].price
                        .split(',')[0]
                        .replace('R$', '')
                        .replace(',', '')
                        .replace('.', '')
                ),
            }
        } else {
            const identicalInverters = inverters.filter(
                (inverter) =>
                    inverter.power * 2 >= neededPower &&
                    inverter.power * 2 <= neededPower * 1.2
            )
            bestInverter = {
                id: identicalInverters[0].id,
                model: identicalInverters[0].model,
                amount: 2,
                power: identicalInverters[0].power * 2,
                pricePerUnit: parseFloat(
                    identicalInverters[0].price
                        .split(',')[0]
                        .replace('R$', '')
                        .replace(',', '')
                        .replace('.', '')
                ),
                totalPrice:
                    parseFloat(
                        identicalInverters[0].price
                            .split(',')[0]
                            .replace('R$', '')
                            .replace(',', '')
                            .replace('.', '')
                    ) * 2,
            }
        }

        return {
            topThreeModules: topThreeOptions,
            bestInverter: bestInverter,
        }
    }

    function generateOptimalCombinations(modules, inverters) {
        let combinations = []

        modules.sort((a, b) => a.pricePerUnit - b.pricePerUnit)
        inverters.sort((a, b) => a.price - b.price)

        for (let module of modules) {
            for (let inverter of inverters) {
                combinations.push({
                    id: generateCode(),
                    modules: {
                        id: module.id,
                        model: module.model,
                        unitPrice: module.pricePerUnit,
                        totalPrice: module.totalPrice,
                        amount: Math.round(module.quantityNeeded),
                        power: module.power,
                    },
                    inverter: {
                        id: inverter.id,
                        model: inverter.model,
                        unitPrice: inverter.pricePerUnit,
                        totalPrice: inverter.totalPrice,
                        amount: Math.round(inverter.amount),
                        powerMax: inverter.power,
                    },
                })
            }
        }

        combinations.sort(
            (a, b) =>
                a.modules.totalPrice +
                a.inverter.totalPrice -
                (b.modules.totalPrice + b.inverter.totalPrice)
        )

        return combinations
    }

    function calculateAverageEnergyBill(budgetData) {
        // Primeiro, vamos criar um objeto para armazenar a soma dos consumos de cada mês
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

        // Iteramos sobre cada conta de energia
        budgetData.consumption.energyBills.forEach((bill) => {
            // Iteramos sobre cada mês na conta de energia e somamos ao total correspondente
            Object.entries(bill.months).forEach(([month, value]) => {
                monthlyTotal[month.toLowerCase()] += Number(value)
            })
        })

        // Agora que temos a soma dos consumos de todos os meses, podemos calcular a média
        let totalConsumption = Object.values(monthlyTotal).reduce(
            (total, value) => total + value,
            0
        )
        let totalMonths = Object.keys(monthlyTotal).length
        return totalConsumption / totalMonths
    }

    useEffect(() => {
        async function fetchData() {
            const averageConsumption = calculateAverageEnergyBill(budget)
            const solarIrradiationResponse = await axios.post(
                'https://backend.siwatt.com.br/api/solar-irradiation',
                {
                    cityName: budget.solarPlantSite.city,
                }
            )
            const solarIrradiation =
                solarIrradiationResponse.data.reduce((a, b) => a + b, 0) /
                solarIrradiationResponse.data.length

            const products = await getProducts()
            const modules = products.filter((prod) => prod.type === 'module')
            const inverters = products.filter(
                (prod) => prod.type === 'inverter'
            )
            setProducts({
                modules,
                inverters,
            })
            const neededPower = getNeededPower(
                averageConsumption,
                supplyType,
                solarIrradiation
            )
            const selections = chooseModulesAndInverters(products, neededPower)
            const combinations = generateOptimalCombinations(
                selections.topThreeModules,
                [selections.bestInverter]
            )
            console.log(combinations)
            setKits(combinations)
            setLoading(false)
        }

        fetchData()
    }, [])

    return (
        <Box className='mt-4'>
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
            {kits &&
                !loading &&
                kits.map((kit, index) => (
                    <Paper
                        key={index}
                        className={`mb-3 p-3 d-flex border ${
                            budget.kit === kit
                                ? 'border-2 border-dark shadow'
                                : 'shadow-sm'
                        }`}
                        elevation={0}
                    >
                        <Box className='flex-fill me-3'>
                            <Paper
                                className='mb-2 p-3 border shadow-sm'
                                elevation={0}
                            >
                                <Typography variant='h6'>
                                    Modelo: {kit.modules.model}
                                </Typography>
                                <Box className='d-flex gap-4'>
                                    <Box>
                                        <Typography>
                                            Quantidade:{' '}
                                            {Math.round(kit.modules.amount)}{' '}
                                            placas
                                        </Typography>
                                        <Typography>
                                            Preço unitário:{' '}
                                            {kit.modules.unitPrice.toLocaleString(
                                                'pt-BR',
                                                {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                }
                                            )}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography>
                                            Preço total:{' '}
                                            {kit.modules.totalPrice.toLocaleString(
                                                'pt-BR',
                                                {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                }
                                            )}
                                        </Typography>
                                        <Typography>
                                            Potência: {kit.modules.power}W
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                            <Paper
                                className='p-3 border shadow-sm'
                                elevation={0}
                            >
                                <Typography variant='h6'>
                                    Modelo: {kit.inverter.model}
                                </Typography>
                                <Box className='d-flex gap-4'>
                                    <Box>
                                        <Typography>
                                            Quantidade: {kit.inverter.amount}{' '}
                                            inversores
                                        </Typography>
                                        <Typography>
                                            Preço unitário:{' '}
                                            {kit.inverter.unitPrice.toLocaleString(
                                                'pt-BR',
                                                {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                }
                                            )}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography>
                                            Preço total:{' '}
                                            {kit.inverter.totalPrice.toLocaleString(
                                                'pt-BR',
                                                {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                }
                                            )}
                                        </Typography>
                                        <Typography>
                                            Potência: {kit.inverter.powerMax}KW
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                            <Box className='mt-2'>
                                <Typography variant='h6'>
                                    Preço total:{' '}
                                    {(
                                        kit.modules.totalPrice +
                                        kit.inverter.totalPrice
                                    ).toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    })}
                                </Typography>
                            </Box>
                        </Box>
                        <Box className='d-flex flex-column align-items-center'>
                            <Button
                                variant='contained'
                                color='black'
                                className='mb-2 w-100'
                                onClick={() => openEditDialog(kit)}
                            >
                                Editar
                            </Button>
                            <Button
                                variant='contained'
                                color='black'
                                className='w-100'
                                onClick={() => setBudget({ ...budget, kit })}
                            >
                                Selecionar
                            </Button>
                        </Box>
                    </Paper>
                ))}
            <Dialog open={editDialogOpen} onClose={closeEditDialog}>
                <DialogTitle>Editar Kit</DialogTitle>
                <DialogContent>
                    {products && (
                        <>
                            <TextField
                                color='black'
                                size='small'
                                select
                                label='Modelo de Placa'
                                value={editedKit ? editedKit.modules.id : ''}
                                onChange={(e) =>
                                    setEditedKit({
                                        ...editedKit,
                                        modules: {
                                            ...editedKit.modules,
                                            id: e.target.value,
                                            model: products.modules.filter(
                                                (p) => p.id === e.target.value
                                            )[0].model,
                                        },
                                    })
                                }
                                fullWidth
                                margin='normal'
                            >
                                {products.modules.map((product) => (
                                    <MenuItem
                                        key={product.id}
                                        value={product.id}
                                    >
                                        {product.model}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                color='black'
                                size='small'
                                select
                                label='Modelo de Inversor'
                                value={editedKit ? editedKit.inverter.id : ''}
                                onChange={(e) =>
                                    setEditedKit({
                                        ...editedKit,
                                        inverter: {
                                            ...editedKit.inverter,
                                            id: e.target.value,
                                            model: products.inverters.filter(
                                                (p) => p.id === e.target.value
                                            )[0].model,
                                        },
                                    })
                                }
                                fullWidth
                                margin='normal'
                            >
                                {products.inverters.map((product) => (
                                    <MenuItem
                                        key={product.id}
                                        value={product.id}
                                    >
                                        {product.model}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </>
                    )}

                    <TextField
                        color='black'
                        size='small'
                        label='Quantidade de Placas'
                        type='number'
                        value={editedKit ? editedKit.modules.amount : ''}
                        onChange={(e) =>
                            setEditedKit({
                                ...editedKit,
                                modules: {
                                    ...editedKit.modules,
                                    amount: e.target.value,
                                },
                            })
                        }
                        fullWidth
                        margin='normal'
                    />
                    <TextField
                        color='black'
                        size='small'
                        label='Quantidade de Inversores'
                        type='number'
                        value={editedKit ? editedKit.inverter.amount : ''}
                        onChange={(e) =>
                            setEditedKit({
                                ...editedKit,
                                inverter: {
                                    ...editedKit.inverter,
                                    amount: e.target.value,
                                },
                            })
                        }
                        fullWidth
                        margin='normal'
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={closeEditDialog}
                        color='black'
                        variant='contained'
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={saveEditedKit}
                        color='black'
                        variant='contained'
                    >
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default StepKits
