import {
    AddAPhotoRounded,
    AddRounded,
    AddchartRounded,
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

function AddEnergyBill({ open, onClose, existingIds }) {
    const [energyBill, setEnergyBill] = useState({
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
    })
    const [uploading, setUploading] = useState(false)
    const { uploadFile } = useStorage()
    const { showToastMessage } = useUtilities()

    const isFormComplete = () => {
        if (energyBill.name === '') return false
        for (let month in energyBill.months) {
            if (energyBill.months[month] === '') return false
        }
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
        })
    }

    const handleAdd = async () => {
        if (isFormComplete()) {
            try {
                console.log(
                    energyBill.photoEnergyBill,
                    energyBill.photoConsumptionChart
                )
                setUploading(true)
                const photoEnergyBill = await uploadFile(
                    'energyBills',
                    energyBill.photoEnergyBill,
                    `${energyBill.name}_energy_energy.jpg`
                )

                const photoConsumptionChart = await uploadFile(
                    'energyBills',
                    energyBill.photoConsumptionChart,
                    `${energyBill.name}_consumption_chart.jpg`
                )

                setUploading(false)

                const energyBillObj = {
                    ...energyBill,
                    id: energyBill.name,
                    photoEnergyBill,
                    photoConsumptionChart,
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
        console.log(energyBill)
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
            <DialogTitle>Adicionar uma conta de energia</DialogTitle>
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
                    <Grid item xs={4}>
                        <TextField
                            label='Jan'
                            color='black'
                            size='small'
                            value={energyBill.months.jan}
                            onChange={(e) =>
                                setEnergyBill({
                                    ...energyBill,
                                    months: {
                                        ...energyBill.months,
                                        jan: e.target.value,
                                    },
                                })
                            }
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label='Fev'
                            color='black'
                            size='small'
                            value={energyBill.months.fev}
                            onChange={(e) =>
                                setEnergyBill({
                                    ...energyBill,
                                    months: {
                                        ...energyBill.months,
                                        fev: e.target.value,
                                    },
                                })
                            }
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label='Mar'
                            color='black'
                            size='small'
                            value={energyBill.months.mar}
                            onChange={(e) =>
                                setEnergyBill({
                                    ...energyBill,
                                    months: {
                                        ...energyBill.months,
                                        mar: e.target.value,
                                    },
                                })
                            }
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label='Abr'
                            color='black'
                            size='small'
                            value={energyBill.months.abr}
                            onChange={(e) =>
                                setEnergyBill({
                                    ...energyBill,
                                    months: {
                                        ...energyBill.months,
                                        abr: e.target.value,
                                    },
                                })
                            }
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label='Mai'
                            color='black'
                            size='small'
                            value={energyBill.months.mai}
                            onChange={(e) =>
                                setEnergyBill({
                                    ...energyBill,
                                    months: {
                                        ...energyBill.months,
                                        mai: e.target.value,
                                    },
                                })
                            }
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label='Jun'
                            color='black'
                            size='small'
                            value={energyBill.months.jun}
                            onChange={(e) =>
                                setEnergyBill({
                                    ...energyBill,
                                    months: {
                                        ...energyBill.months,
                                        jun: e.target.value,
                                    },
                                })
                            }
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label='Jul'
                            color='black'
                            size='small'
                            value={energyBill.months.jul}
                            onChange={(e) =>
                                setEnergyBill({
                                    ...energyBill,
                                    months: {
                                        ...energyBill.months,
                                        jul: e.target.value,
                                    },
                                })
                            }
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label='Ago'
                            color='black'
                            size='small'
                            value={energyBill.months.ago}
                            onChange={(e) =>
                                setEnergyBill({
                                    ...energyBill,
                                    months: {
                                        ...energyBill.months,
                                        ago: e.target.value,
                                    },
                                })
                            }
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label='Set'
                            color='black'
                            size='small'
                            value={energyBill.months.set}
                            onChange={(e) =>
                                setEnergyBill({
                                    ...energyBill,
                                    months: {
                                        ...energyBill.months,
                                        set: e.target.value,
                                    },
                                })
                            }
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label='Out'
                            color='black'
                            size='small'
                            value={energyBill.months.out}
                            onChange={(e) =>
                                setEnergyBill({
                                    ...energyBill,
                                    months: {
                                        ...energyBill.months,
                                        out: e.target.value,
                                    },
                                })
                            }
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label='Nov'
                            color='black'
                            size='small'
                            value={energyBill.months.nov}
                            onChange={(e) =>
                                setEnergyBill({
                                    ...energyBill,
                                    months: {
                                        ...energyBill.months,
                                        nov: e.target.value,
                                    },
                                })
                            }
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label='Dez'
                            color='black'
                            size='small'
                            value={energyBill.months.dez}
                            onChange={(e) =>
                                setEnergyBill({
                                    ...energyBill,
                                    months: {
                                        ...energyBill.months,
                                        dez: e.target.value,
                                    },
                                })
                            }
                        />
                    </Grid>
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
                        value={null}
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
                                        Gráfico de consumo:
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
                                    Selecionar foto do gráfico de consumo
                                </>
                            )}
                        </Box>
                    </label>
                    <input
                        type='file'
                        id='photo-consumption-chart'
                        style={{ display: 'none' }}
                        value={null}
                        onChange={async (e) => {
                            const base64 = await getBase64(e.target.files[0])
                            setEnergyBill({
                                ...energyBill,
                                photoConsumptionChart: base64,
                            })
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    color='black'
                    size='small'
                    variant='contained'
                    onClick={handleClose}
                    disabled={uploading}
                >
                    Cancelar
                </Button>
                {uploading ? (
                    <LoadingButton
                        loading
                        loadingPosition='start'
                        startIcon={<Save />}
                        variant='contained'
                    >
                        Adicionando
                    </LoadingButton>
                ) : (
                    <Button
                        color='black'
                        size='small'
                        variant='contained'
                        autoFocus
                        onClick={handleAdd}
                    >
                        Adicionar
                    </Button>
                )}
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
                            <TableCell key={bill.name}>{bill.name}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {months.map((month) => (
                        <TableRow key={month}>
                            <TableCell>{month}</TableCell>
                            {energyBills.map((bill) => (
                                <TableCell key={bill.name}>
                                    {bill.months[month.toLowerCase()]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
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
                    pushNewEnergyBill({ ...energyBill, id: generateCode() })
                    setOpen(false)
                }}
                existingIds={energyBills.map((bill) => bill.name)}
            />
        </Box>
    )
}

export default StepConsumptionData
