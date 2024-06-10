import {
    AddAPhotoRounded,
    AddRounded,
    AddchartRounded,
    DeleteRounded,
    EditRounded,
    Save,
} from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { BudgetContext } from '../../../../../contexts/budgetContext'
import useStorage from '../../../../../hooks/useStorage'
import useUtilities from './../../../../../hooks/useUtilities'

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

function AddEnergyBill({
    open,
    onClose,
    existingIds,
    energyBills = [],
    editingBill,
}) {
    const [energyBill, setEnergyBill] = useState(
        editingBill || {
            name: generateEnergyBillId(existingIds),
            months: {
                jan: '',
                fev: '',
                mar: '',
                abr: '',
                mai: '',
                jun: '',
                jul: '',
                ago: '',
                set: '',
                out: '',
                nov: '',
                dez: '',
            },
            photoEnergyBill: null,
            photoConsumptionChart: null,
        }
    )
    const [energyBillsWithNew, setEnergyBillsWithNew] = useState(energyBills)
    const [uploading, setUploading] = useState(false)
    const { uploadFile } = useStorage()
    const { showToastMessage } = useUtilities()

    useEffect(() => {
        if (editingBill) {
            setEnergyBill(editingBill)
        }
    }, [editingBill])

    const isFormComplete = () => {
        if (energyBill.name === '') return false
        for (let month in energyBill.months)
            if (energyBill.months[month] === '') return false
        if (energyBill.photoEnergyBill === null) return false
        if (energyBill.photoConsumptionChart === null) return false
        return true
    }

    function generateEnergyBillId(existingIds) {
        let newId = ''
        const digits = '0123456789'
        const idLength = 5

        do {
            newId = ''
            for (let i = 0; i < idLength; i++) {
                newId += digits.charAt(
                    Math.floor(Math.random() * digits.length)
                )
            }
        } while (existingIds.includes(newId))

        return newId
    }

    const handleClose = () => {
        onClose(null)
        setEnergyBill({
            name: '',
            months: {
                jan: '',
                fev: '',
                mar: '',
                abr: '',
                mai: '',
                jun: '',
                jul: '',
                ago: '',
                set: '',
                out: '',
                nov: '',
                dez: '',
            },
            photoEnergyBill: null,
            photoConsumptionChart: null,
        })
    }

    const handleAdd = async () => {
        if (isFormComplete()) {
            try {
                setUploading(true)
                let photoEnergyBillUrl = energyBill.photoEnergyBill
                let photoConsumptionChartUrl = energyBill.photoConsumptionChart

                // Verificar se a imagem foi alterada (não é uma URL)
                if (!photoEnergyBillUrl.startsWith('http')) {
                    photoEnergyBillUrl = await uploadFile(
                        'energyBills',
                        photoEnergyBillUrl, // Deve ser uma URL da imagem, não a string de dados
                        `${energyBill.name}_energy_energy.jpg`
                    )
                }

                // Verificar se a imagem foi alterada (não é uma URL)
                if (!photoConsumptionChartUrl.startsWith('http')) {
                    photoConsumptionChartUrl = await uploadFile(
                        'energyBills',
                        photoConsumptionChartUrl, // Deve ser uma URL da imagem, não a string de dados
                        `${energyBill.name}_consumption_chart.jpg`
                    )
                }

                setUploading(false)

                const energyBillObj = {
                    ...energyBill,
                    id: energyBill.name,
                    photoEnergyBill: photoEnergyBillUrl, // Usando a URL da imagem
                    photoConsumptionChart: photoConsumptionChartUrl, // Usando a URL da imagem
                }

                setEnergyBill(energyBillObj)
                onClose(energyBillObj)

                setEnergyBill({
                    name: '',
                    months: {
                        jan: '',
                        fev: '',
                        mar: '',
                        abr: '',
                        mai: '',
                        jun: '',
                        jul: '',
                        ago: '',
                        set: '',
                        out: '',
                        nov: '',
                        dez: '',
                    },
                    photoEnergyBill: null,
                    photoConsumptionChart: null,
                })
            } catch (error) {
                console.error(
                    'Erro ao enviar imagens para o Firebase Storage:',
                    error
                )
                showToastMessage(
                    'error',
                    'Ocorreu um erro ao adicionar a conta de energia. Por favor, tente novamente.'
                )
            }
        } else {
            showToastMessage('error', 'Por favor, preencha todos os campos.')
        }
    }

    useEffect(() => {
        const newEnergyBill = {
            ...energyBill,
            months: Object.fromEntries(
                Object.entries(energyBill.months).map(([month, value]) => [
                    month,
                    value === '' ? 0 : value,
                ])
            ),
        }
        setEnergyBillsWithNew([...energyBills, newEnergyBill])
    }, [energyBill])

    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = function () {
                resolve(reader.result)
            }
            reader.onerror = function (error) {
                reject('Error: ' + error)
            }
        })
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                {editingBill ? 'Editar' : 'Adicionar'} uma conta de energia
            </DialogTitle>
            <DialogContent>
                <TextField
                    label='Nome: '
                    color='black'
                    size='small'
                    className='mb-3 w-100'
                    value={energyBill.name}
                    onChange={(e) =>
                        setEnergyBill({ ...energyBill, name: e.target.value })
                    }
                />
                <Grid container spacing={2}>
                    {Object.keys(energyBill.months).map((month) => (
                        <Grid item xs={4} key={month}>
                            <TextField
                                type='number'
                                label={
                                    month.charAt(0).toUpperCase() +
                                    month.slice(1)
                                }
                                color='black'
                                size='small'
                                value={energyBill.months[month]}
                                onChange={(e) =>
                                    setEnergyBill({
                                        ...energyBill,
                                        months: {
                                            ...energyBill.months,
                                            [month]: e.target.value,
                                        },
                                    })
                                }
                            />
                        </Grid>
                    ))}
                </Grid>
                <Box className='mt-3 w-100'>
                    <label htmlFor='photo-energy-bill' className='w-100'>
                        <Box
                            component='span'
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: energyBill.photoEnergyBill
                                    ? 'center'
                                    : 'flex-start',
                                p: 1,
                                m: 1,
                                bgcolor: 'background.paper',
                                border: 1,
                                borderRadius: 1,
                                cursor: 'pointer',
                            }}
                        >
                            {energyBill.photoEnergyBill ? (
                                <div>
                                    <Typography
                                        variant='body1'
                                        className='mb-2'
                                    >
                                        Foto da conta de energia:
                                    </Typography>
                                    <img
                                        src={energyBill.photoEnergyBill}
                                        alt=''
                                        width='100%'
                                    />
                                </div>
                            ) : (
                                <>
                                    <AddAPhotoRounded className='me-2' />
                                    Selecionar foto da conta
                                </>
                            )}
                        </Box>
                    </label>
                    <input
                        type='file'
                        id='photo-energy-bill'
                        style={{ display: 'none' }}
                        onChange={async (e) => {
                            const base64 = await getBase64(e.target.files[0])
                            setEnergyBill({
                                ...energyBill,
                                photoEnergyBill: base64,
                            })
                        }}
                    />
                </Box>
                <Box className='mt-1 w-100'>
                    <label htmlFor='photo-consumption-chart' className='w-100'>
                        <Box
                            component='span'
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: energyBill.photoConsumptionChart
                                    ? 'center'
                                    : 'flex-start',
                                p: 1,
                                m: 1,
                                bgcolor: 'background.paper',
                                border: 1,
                                borderRadius: 1,
                                cursor: 'pointer',
                            }}
                        >
                            {energyBill.photoConsumptionChart ? (
                                <div>
                                    <Typography
                                        variant='body1'
                                        className='mb-2'
                                    >
                                        Gráfico de consumo:
                                    </Typography>
                                    <img
                                        src={energyBill.photoConsumptionChart}
                                        alt=''
                                        width='100%'
                                    />
                                </div>
                            ) : (
                                <>
                                    <AddchartRounded className='me-2' />
                                    Selecionar foto do gráfico de consumo
                                </>
                            )}
                        </Box>
                    </label>
                    <input
                        type='file'
                        id='photo-consumption-chart'
                        style={{ display: 'none' }}
                        onChange={async (e) => {
                            const base64 = await getBase64(e.target.files[0])
                            setEnergyBill({
                                ...energyBill,
                                photoConsumptionChart: base64,
                            })
                        }}
                    />
                </Box>
                <Typography variant='body1'>
                    <strong>Consumo médio</strong>:{' '}
                    {(() => {
                        if (energyBillsWithNew.length === 0) return 0
                        const averageEnergyBill = calculateAverageEnergyBill({
                            consumption: { energyBills: energyBillsWithNew },
                        })
                        return averageEnergyBill.toFixed(2)
                    })()}{' '}
                    KW/mês
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <LoadingButton
                    onClick={handleAdd}
                    loading={uploading}
                    loadingPosition='start'
                    startIcon={<Save />}
                >
                    {editingBill ? 'Salvar' : 'Adicionar'}
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
}

function StepConsumptionData() {
    const { budget, setBudget } = useContext(BudgetContext)
    const [open, setOpen] = useState(false)
    const [energyBills, setEnergyBills] = useState(
        budget.consumption ? budget.consumption.energyBills : []
    )
    const [accountForInstallation, setAccountForInstallation] = useState(
        budget.consumption ? budget.consumption.accountForInstallation : null
    )
    const [typeCeiling, setTypeCeiling] = useState(
        budget.consumption ? budget.consumption.typeCeiling : null
    )
    const [typeNetwork, setTypeNetwork] = useState(
        budget.consumption ? budget.consumption.typeNetwork : null
    )
    const [state, setState] = useState(
        budget.solarPlantSite ? budget.solarPlantSite.state : null
    )
    const [city, setCity] = useState(
        budget.solarPlantSite ? budget.solarPlantSite.city : null
    )
    const [editingBill, setEditingBill] = useState(null)
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const { generateCode } = useUtilities()

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

    const pushNewEnergyBill = (energyBill) => {
        if (!energyBill) return false
        if (
            !Object.prototype.hasOwnProperty.call(energyBill, 'name') ||
            energyBill.name === ''
        )
            return false
        if (!Object.prototype.hasOwnProperty.call(energyBill, 'months'))
            return false
        for (let month in energyBill.months) {
            if (
                !Object.prototype.hasOwnProperty.call(
                    energyBill.months,
                    month
                ) ||
                energyBill.months[month] === ''
            )
                return false
        }
        setEnergyBills([...energyBills, energyBill])
        return true
    }

    const handleOpenEditDialog = (id) => {
        const billToEdit = energyBills.find((bill) => bill.id === id)
        setEditingBill(billToEdit)
        setOpen(true)
    }

    const handleEdit = (id, updatedEnergyBill) => {
        if (!updatedEnergyBill) return
        const updatedEnergyBills = energyBills.map((bill) =>
            bill.id === id ? updatedEnergyBill : bill
        )
        setEnergyBills(updatedEnergyBills)
    }

    const handleRemove = (id) => {
        const updatedEnergyBills = energyBills.filter((bill) => bill.id !== id)
        setEnergyBills(updatedEnergyBills)
    }

    useEffect(() => {
        axios
            .get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then((response) => {
                setStates(response.data)
            })
    }, [])

    useEffect(() => {
        if (state) {
            axios
                .get(
                    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/distritos`
                )
                .then((response) => {
                    setCities(response.data)
                })
        }
    }, [state])

    useEffect(() => {
        setBudget({
            ...budget,
            consumption: {
                accountForInstallation,
                typeCeiling,
                typeNetwork,
                energyBills,
            },
            solarPlantSite: {
                state,
                city,
            },
        })
    }, [
        energyBills,
        accountForInstallation,
        typeCeiling,
        typeNetwork,
        state,
        city,
    ])

    return (
        <Box>
            <Table
                sx={{ minWidth: 650 }}
                aria-label='simple table'
                className='table-sm'
            >
                <TableHead>
                    <TableRow>
                        <TableCell>Unidade</TableCell>
                        {energyBills.map((bill) => (
                            <>
                                <TableCell key={bill.name}>
                                    {bill.name}
                                    <Button
                                        color='black'
                                        variant='contained'
                                        size='small'
                                        onClick={() =>
                                            handleOpenEditDialog(bill.id)
                                        }
                                        sx={{
                                            minWidth: 0,
                                        }}
                                        className='ms-2'
                                    >
                                        <EditRounded fontSize='small' />
                                    </Button>
                                    <Button
                                        color='error'
                                        variant='contained'
                                        size='small'
                                        onClick={() => handleRemove(bill.id)}
                                        sx={{
                                            minWidth: 0,
                                        }}
                                        className='ms-2'
                                    >
                                        <DeleteRounded fontSize='small' />
                                    </Button>
                                </TableCell>
                            </>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {months.map((month) => (
                        <TableRow key={month}>
                            <TableCell>{month}</TableCell>
                            {energyBills.map((bill) => (
                                <>
                                    <TableCell key={bill.name}>
                                        {bill.months[month.toLowerCase()]}
                                    </TableCell>
                                </>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Typography variant='body1'>
                <strong>Consumo médio</strong>:{' '}
                {(() => {
                    console.log(energyBills.length)
                    if (energyBills.length === 0) return 0
                    const averageEnergyBill = calculateAverageEnergyBill({
                        consumption: { energyBills },
                    })
                    return averageEnergyBill.toFixed(2)
                })()}{' '}
                KW/mês
            </Typography>
            <Typography variant='body1'>
                <strong>Potência necessária</strong>:{' '}
                {(() => {
                    console.log(energyBills.length)
                    if (energyBills.length === 0) return 0
                    const averageEnergyBill = calculateAverageEnergyBill({
                        consumption: { energyBills },
                    })
                    console.log(averageEnergyBill)
                    const neededPower = getNeededPower(
                        averageEnergyBill,
                        typeNetwork || 'single-fase',
                        5.153
                    )
                    console.log(neededPower)
                    return neededPower.toFixed(2)
                })()}{' '}
                KWp
            </Typography>
            <Button
                color='black'
                size='small'
                variant='contained'
                onClick={() => setOpen(!open)}
                className='mt-3'
                startIcon={<AddRounded />}
            >
                Adicionar Conta
            </Button>
            <FormControl size='small' color='black' fullWidth className='mt-3'>
                <InputLabel>Conta para instalação: </InputLabel>
                <Select
                    label='Conta para instalação: '
                    value={accountForInstallation}
                    onChange={(e) => setAccountForInstallation(e.target.value)}
                >
                    {energyBills.map((energyBill) => (
                        <MenuItem key={energyBill.name} value={energyBill}>
                            {energyBill.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl size='small' color='black' fullWidth className='mt-3'>
                <InputLabel>Estado: </InputLabel>
                <Select
                    label='Estado: '
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                >
                    {states.map((state) => (
                        <MenuItem key={state.id} value={state.id}>
                            {state.nome}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl size='small' color='black' fullWidth className='mt-3'>
                <InputLabel>Cidade: </InputLabel>
                <Select
                    label='Cidade: '
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                >
                    {cities.map((city) => (
                        <MenuItem key={city.id} value={city.nome}>
                            {city.nome}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl size='small' color='black' fullWidth className='mt-3'>
                <InputLabel>Tipo de teto: </InputLabel>
                <Select
                    label='Tipo de teto: '
                    value={typeCeiling}
                    onChange={(e) => setTypeCeiling(e.target.value)}
                >
                    <MenuItem value='ground'>Solo</MenuItem>
                    <MenuItem value='metal'>Metal</MenuItem>
                    <MenuItem value='ceramic'>Cerâmico</MenuItem>
                    <MenuItem value='slab'>Laje</MenuItem>
                </Select>
            </FormControl>
            <FormControl size='small' color='black' fullWidth className='mt-3'>
                <InputLabel>Tipo de rede: </InputLabel>
                <Select
                    label='Tipo de rede: '
                    value={typeNetwork}
                    onChange={(e) => setTypeNetwork(e.target.value)}
                >
                    <MenuItem value='single-phase'>Monofásica</MenuItem>
                    <MenuItem value='two-phase'>Bifásica</MenuItem>
                    <MenuItem value='three-phase'>Trifásica</MenuItem>
                </Select>
            </FormControl>
            <AddEnergyBill
                open={open}
                onClose={(energyBill) => {
                    if (editingBill) {
                        handleEdit(editingBill.id, energyBill)
                    } else {
                        pushNewEnergyBill({ ...energyBill, id: generateCode() })
                    }
                    setOpen(false)
                    setEditingBill(null)
                }}
                existingIds={energyBills.map((bill) => bill.name)}
                energyBills={energyBills}
                editingBill={editingBill}
            />
        </Box>
    )
}

export default StepConsumptionData
