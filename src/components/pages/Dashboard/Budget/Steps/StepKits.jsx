import {
    Box,
    Button,
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
        const compatibleInverters = inverters.filter(
            (inverter) => inverter.power >= neededPower
        )

        let bestInverter = null
        if (compatibleInverters.length > 0) {
            compatibleInverters.sort((a, b) => a.price - b.price)
            bestInverter = compatibleInverters[0]
        } else {
            const identicalInverters = inverters.filter(
                (inverter) =>
                    inverter.power * 2 >= neededPower &&
                    inverter.power * 2 <= neededPower * 1.2
            )
            bestInverter = {
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
                        model: module.model,
                        unitPrice: module.pricePerUnit,
                        totalPrice: module.totalPrice,
                        amount: Math.round(module.quantityNeeded),
                        power: module.power,
                    },
                    inverter: {
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

    useEffect(() => {
        async function fetchData() {
            const averageConsumption = calculateAverageEnergyBill(budget)
            const solarIrradiationResponse = await axios.post(
                'https://backend.siwatt.com.br/api/solar-irradiation',
                {
                    cityName: budget.solarPlantSite.city,
                }
            )
            const solarIrradiation = solarIrradiationResponse.data

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
        }

        fetchData()
    }, [])

    return (
        <Box className='mt-4'>
            {kits &&
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
                                value={editedKit ? editedKit.modules.model : ''}
                                onChange={(e) =>
                                    setEditedKit({
                                        ...editedKit,
                                        modules: {
                                            ...editedKit.modules,
                                            model: e.target.value,
                                        },
                                    })
                                }
                                fullWidth
                                margin='normal'
                            >
                                {products.modules.map((product) => (
                                    <MenuItem
                                        key={product.id}
                                        value={product.model}
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
                                value={
                                    editedKit ? editedKit.inverter.model : ''
                                }
                                onChange={(e) =>
                                    setEditedKit({
                                        ...editedKit,
                                        inverter: {
                                            ...editedKit.inverter,
                                            model: e.target.value,
                                        },
                                    })
                                }
                                fullWidth
                                margin='normal'
                            >
                                {products.inverters.map((product) => (
                                    <MenuItem
                                        key={product.id}
                                        value={product.model}
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
