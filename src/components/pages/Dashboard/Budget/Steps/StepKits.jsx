import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from '@mui/material'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BudgetContext } from '../../../../../contexts/budgetContext'
import useFirebase from './../../../../../hooks/useFirebase'
import useUtilities from './../../../../../hooks/useUtilities'

function StepKits() {
    const [products, setProducts] = useState()
    const [kits, setKits] = useState([])
    const [loading, setLoading] = useState(true)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [editedKit, setEditedKit] = useState(null)
    const { generateCode } = useUtilities()
    const { budget, setBudget } = useContext(BudgetContext)
    const firebase = useFirebase()
    const navigate = useNavigate()

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

        const supplyTypeValue = supplyTypeValues[supplyType] || 30
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
            console.log(compatibleInverters)
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
            if (identicalInverters.length > 0) {
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
            } else {
                bestInverter = null
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

    const generateRandomKit = () => {
        const moduleIndex = Math.floor(Math.random() * products.modules.length)
        const inverterIndex = Math.floor(
            Math.random() * products.inverters.length
        )
        const kit = {
            modules: {
                id: products.modules[moduleIndex].id,
                model: products.modules[moduleIndex].model,
                unitPrice: parseFloat(
                    products.modules[moduleIndex].price
                        .split(',')[0]
                        .replace('R$', '')
                        .replace(',', '')
                        .replace('.', '')
                ),
                totalPrice: parseFloat(
                    products.modules[moduleIndex].price
                        .split(',')[0]
                        .replace('R$', '')
                        .replace(',', '')
                        .replace('.', '')
                ),
                amount: 0,
                power: products.modules[moduleIndex].power,
            },
            inverter: {
                id: products.inverters[inverterIndex].id,
                model: products.inverters[inverterIndex].model,
                unitPrice: parseFloat(
                    products.inverters[inverterIndex].price
                        .split(',')[0]
                        .replace('R$', '')
                        .replace(',', '')
                        .replace('.', '')
                ),
                totalPrice: parseFloat(
                    products.inverters[inverterIndex].price
                        .split(',')[0]
                        .replace('R$', '')
                        .replace(',', '')
                        .replace('.', '')
                ),
                amount: 0,
                powerMax: products.inverters[inverterIndex].power,
            },
        }

        setKits([kit])
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
                budget.consumption.typeNetwork,
                solarIrradiation
            )

            setBudget({
                ...budget,
                neededPower,
            })

            const selections = chooseModulesAndInverters(products, neededPower)
            if (
                selections.topThreeModules.length === 0 ||
                selections.bestInverter === null
            ) {
                setLoading(false)
                return
            } else {
                const combinations = generateOptimalCombinations(
                    selections.topThreeModules,
                    [selections.bestInverter]
                )
                console.log(combinations)
                setKits(combinations)
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    return (
        <Box className='mt-4'>
            <Box className='d-flex gap-5 justify-content-center mb-3'>
                {budget.neededPower && (
                    <Paper className='p-3 py-1' elevation={3}>
                        <Typography className='text-center mb-0' variant='h6'>
                            Potência necessária:
                        </Typography>
                        <Typography className='text-center mb-3' variant='h4'>
                            {budget.neededPower.toFixed(2)} KWp
                        </Typography>
                    </Paper>
                )}
                {budget.kit && (
                    <Paper className='p-3 py-1' elevation={3}>
                        <Typography className='text-center mb-0' variant='h6'>
                            Tamanho da Usina:
                        </Typography>
                        <Typography className='text-center mb-3' variant='h4'>
                            {(
                                (budget.kit.modules.power *
                                    budget.kit.modules.amount) /
                                1000
                            ).toFixed(2)}{' '}
                            KWp
                        </Typography>
                    </Paper>
                )}
            </Box>
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
            {!loading && kits.length === 0 && (
                <>
                    <Typography className='text-center' variant='h5'>
                        Não conseguimos gerar um Kit neste momento :(
                    </Typography>
                    <Typography
                        className='text-center mx-auto'
                        variant='body1'
                        sx={{
                            maxWidth: '550px',
                        }}
                    >
                        Para resolver isso, você pode cadastrar mais produtos
                        ou, se preferir, montar o Kit manualmente, basta clicar
                        no botão <strong>GERAR KIT MANUALMENTE</strong>, um
                        modelo de kit será apresentado na tela e então você pode
                        editar ele, alterando o modelo e a quantidade dos
                        módulos e dos inversores.
                    </Typography>
                    <Box className='text-center mt-3'>
                        <Button
                            onClick={() => navigate('/dashboard/products')}
                            color='black'
                            variant='contained'
                            className='me-3'
                        >
                            Cadastrar mais produtos
                        </Button>
                        <Button
                            onClick={generateRandomKit}
                            color='black'
                            variant='contained'
                        >
                            Gerar kit manualmente
                        </Button>
                    </Box>
                </>
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
                <DialogTitle className='pb-0'>Editar Kit</DialogTitle>
                <DialogContent className='row container w-100 mx-0'>
                    {products && (
                        <>
                            <Box className='col-6 mt-2'>
                                <Typography variant='h6' className='mb-2'>
                                    Placas
                                </Typography>
                                <FormControl
                                    size='small'
                                    color='black'
                                    fullWidth
                                >
                                    <InputLabel>Modelo de Placa</InputLabel>
                                    <Select
                                        label='Modelo de Placa'
                                        value={
                                            editedKit
                                                ? editedKit.modules.id
                                                : ''
                                        }
                                        onChange={(e) =>
                                            setEditedKit({
                                                ...editedKit,
                                                modules: {
                                                    ...editedKit.modules,
                                                    id: e.target.value,
                                                    model: products.modules.filter(
                                                        (p) =>
                                                            p.id ===
                                                            e.target.value
                                                    )[0].model,
                                                },
                                            })
                                        }
                                        fullWidth
                                    >
                                        {products.modules.map((product) => (
                                            <MenuItem
                                                key={product.id}
                                                value={product.id}
                                            >
                                                {product.model}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    type='number'
                                    color='black'
                                    variant='outlined'
                                    size='small'
                                    label='Quantidade'
                                    fullWidth
                                    className='mt-3'
                                    value={
                                        editedKit ? editedKit.modules.amount : 0
                                    }
                                    onChange={(e) =>
                                        setEditedKit({
                                            ...editedKit,
                                            modules: {
                                                ...editedKit.modules,
                                                amount: e.target.value,
                                            },
                                        })
                                    }
                                ></TextField>
                                <TextField
                                    color='black'
                                    variant='outlined'
                                    size='small'
                                    label='Preço por Unidade'
                                    fullWidth
                                    className='mt-3'
                                    value={
                                        editedKit
                                            ? editedKit.modules.unitPrice.toLocaleString(
                                                  'pt-BR',
                                                  {
                                                      style: 'currency',
                                                      currency: 'BRL',
                                                  }
                                              )
                                            : 0
                                    }
                                    onChange={(e) =>
                                        setEditedKit({
                                            ...editedKit,
                                            modules: {
                                                ...editedKit.modules,
                                                unitPrice: e.target.value,
                                            },
                                        })
                                    }
                                ></TextField>
                                <TextField
                                    color='black'
                                    variant='outlined'
                                    size='small'
                                    label='Preço Total'
                                    fullWidth
                                    className='mt-3'
                                    value={
                                        editedKit
                                            ? editedKit.modules.totalPrice.toLocaleString(
                                                  'pt-BR',
                                                  {
                                                      style: 'currency',
                                                      currency: 'BRL',
                                                  }
                                              )
                                            : 0
                                    }
                                    onChange={(e) =>
                                        setEditedKit({
                                            ...editedKit,
                                            modules: {
                                                ...editedKit.modules,
                                                totalPrice: e.target.value,
                                            },
                                        })
                                    }
                                ></TextField>
                            </Box>
                            <Box className='col-6 mt-2'>
                                <Typography variant='h6' className='mb-2'>
                                    Inversores
                                </Typography>
                                <FormControl
                                    color='black'
                                    size='small'
                                    fullWidth
                                >
                                    <InputLabel>Modelo de Inversor</InputLabel>
                                    <Select
                                        label='Modelo do Inversor'
                                        value={
                                            editedKit
                                                ? editedKit.inverter.id
                                                : ''
                                        }
                                        onChange={(e) =>
                                            setEditedKit({
                                                ...editedKit,
                                                inverters: {
                                                    ...editedKit.inverters,
                                                    id: e.target.value,
                                                    model: products.inverters.filter(
                                                        (p) =>
                                                            p.id ===
                                                            e.target.value
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
                                    </Select>
                                </FormControl>
                                <TextField
                                    type='number'
                                    color='black'
                                    variant='outlined'
                                    size='small'
                                    label='Quantidade'
                                    fullWidth
                                    className='mt-3'
                                    value={
                                        editedKit
                                            ? editedKit.inverter.amount
                                            : 0
                                    }
                                    onChange={(e) =>
                                        setEditedKit({
                                            ...editedKit,
                                            inverter: {
                                                ...editedKit.inverter,
                                                amount: e.target.value,
                                            },
                                        })
                                    }
                                ></TextField>
                                <TextField
                                    color='black'
                                    variant='outlined'
                                    size='small'
                                    label='Preço por Unidade'
                                    fullWidth
                                    className='mt-3'
                                    value={
                                        editedKit
                                            ? editedKit.inverter.unitPrice.toLocaleString(
                                                  'pt-BR',
                                                  {
                                                      style: 'currency',
                                                      currency: 'BRL',
                                                  }
                                              )
                                            : 0
                                    }
                                    onChange={(e) =>
                                        setEditedKit({
                                            ...editedKit,
                                            inverter: {
                                                ...editedKit.inverter,
                                                unitPrice: e.target.value,
                                            },
                                        })
                                    }
                                ></TextField>
                                <TextField
                                    color='black'
                                    variant='outlined'
                                    size='small'
                                    label='Preço Total'
                                    fullWidth
                                    className='mt-3'
                                    value={
                                        editedKit
                                            ? editedKit.inverter.totalPrice.toLocaleString(
                                                  'pt-BR',
                                                  {
                                                      style: 'currency',
                                                      currency: 'BRL',
                                                  }
                                              )
                                            : 0
                                    }
                                    onChange={(e) =>
                                        setEditedKit({
                                            ...editedKit,
                                            inverter: {
                                                ...editedKit.inverter,
                                                totalPrice: e.target.value,
                                            },
                                        })
                                    }
                                ></TextField>
                            </Box>
                        </>
                    )}
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
