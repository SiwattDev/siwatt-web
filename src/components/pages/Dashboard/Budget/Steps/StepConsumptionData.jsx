import { AddRounded } from '@mui/icons-material'
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
} from '@mui/material'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { BudgetContext } from '../../../../../contexts/budgetContext'
import useUtilities from './../../../../../hooks/useUtilities'

function AddEnergyBill({ open, onClose }) {
    const [energyBill, setEnergyBill] = useState({
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

    const isFormComplete = () => {
        if (energyBill.name === '') return false
        for (let month in energyBill.months) {
            if (energyBill.months[month] === '') return false
        }
        return true
    }

    const handleAdd = () => {
        if (isFormComplete()) {
            onClose(energyBill)
        } else {
            alert('Por favor, preencha todos os campos.')
        }
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Adicionar uma conta de energia</DialogTitle>
            <DialogContent>
                <TextField
                    label='Nome: '
                    color='black'
                    size='small'
                    className='mb-3 w-100'
                    value={energyBill.name}
                    onChange={(e) => {
                        setEnergyBill({ ...energyBill, name: e.target.value })
                    }}
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
            </DialogContent>
            <DialogActions>
                <Button
                    color='black'
                    size='small'
                    variant='contained'
                    onClick={() => onClose(null)}
                >
                    Cancelar
                </Button>
                <Button
                    color='black'
                    size='small'
                    variant='contained'
                    autoFocus
                    onClick={handleAdd}
                >
                    Adicionar
                </Button>
            </DialogActions>
        </Dialog>
    )
}

function StepConsumptionData() {
    const [open, setOpen] = useState(false)
    const [energyBills, setEnergyBills] = useState([])
    const [accountForInstallation, setAccountForInstallation] = useState()
    const [typeCeiling, setTypeCeiling] = useState()
    const [typeNetwork, setTypeNetwork] = useState()
    const [state, setState] = useState()
    const [city, setCity] = useState()
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const { generateCode } = useUtilities()
    const { budget, setBudget } = useContext(BudgetContext)

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
                    <MenuItem value='fiber-cement'>Fibrocimento</MenuItem>
                    <MenuItem value='ceramics'>Cerâmica</MenuItem>
                    <MenuItem value='metallic'>Metálico</MenuItem>
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
                    <MenuItem value='biphasic'>Bifásica</MenuItem>
                    <MenuItem value='three-phase'>Trifásica</MenuItem>
                </Select>
            </FormControl>
            <AddEnergyBill
                open={open}
                onClose={(energyBill) => {
                    pushNewEnergyBill({ ...energyBill, id: generateCode() })
                    setOpen(false)
                }}
            />
        </Box>
    )
}

export default StepConsumptionData
