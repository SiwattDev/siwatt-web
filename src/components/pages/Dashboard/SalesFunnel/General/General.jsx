import { FilterListRounded } from '@mui/icons-material'
import {
    Alert,
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
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import axios from 'axios'
import { endOfMonth, startOfMonth, subDays, subMonths } from 'date-fns'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useFirebase from '../../../../../hooks/useFirebase'
import useUtilities from '../../../../../hooks/useUtilities'

const normalizeString = (str) => {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
}

function General() {
    const [visits, setVisits] = useState([])
    const [budgets, setBudgets] = useState([])
    const [cityFilter, setCityFilter] = useState('')
    const [budgetStatusFilter, setBudgetStatusFilter] = useState('')
    const [visitStatusFilter, setVisitStatusFilter] = useState('')
    const [showFilters, setShowFilters] = useState(false)
    const { getDocumentsInCollection, getDocumentById } = useFirebase()
    const { replaceBudgetStatus, replaceVisitProgress } = useUtilities()

    const [dateRange, setDateRange] = useState({
        startDate: dayjs(startOfMonth(new Date())),
        endDate: dayjs(endOfMonth(new Date())),
    })

    const getLocalData = async (lat, lng) => {
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        )

        let { road, city } = response.data.address

        let formatted_address = `${
            response.data.address[response.data.class]
                ? response.data.address[response.data.class] + ', '
                : ''
        }${road ? road + ', ' : ''}${city ? city : ''}`

        return formatted_address
    }

    useEffect(() => {
        Promise.all([
            getDocumentsInCollection('visits'),
            getDocumentsInCollection('budgets'),
        ])
            .then(async ([visits, budgets]) => {
                budgets = budgets.filter((budget) => !budget.deleted)
                setBudgets(budgets)
                visits = await Promise.all(
                    visits.map(async (visit) => {
                        visit.sellerData = await getDocumentById(
                            'users',
                            visit.user
                        )
                        visit.local = await getLocalData(
                            visit.locationData.latitude,
                            visit.locationData.longitude
                        )
                        return visit
                    })
                )
                setVisits(visits)
            })
            .catch((error) => console.error(error))
    }, [])

    const handleCityFilterChange = (e) => {
        setCityFilter(e.target.value)
    }

    const handleBudgetStatusFilterChange = (e) => {
        setBudgetStatusFilter(e.target.value)
    }

    const handleVisitStatusFilterChange = (e) => {
        setVisitStatusFilter(e.target.value)
    }

    const handleDateChange = (dateKey) => (date) => {
        setDateRange({
            ...dateRange,
            [dateKey]: date ? date.toDate() : null,
        })
    }

    const setLast7Days = () => {
        setDateRange({
            startDate: dayjs(subDays(new Date(), 7)),
            endDate: dayjs(new Date()),
        })
    }

    const setLast30Days = () => {
        setDateRange({
            startDate: dayjs(subDays(new Date(), 30)),
            endDate: dayjs(new Date()),
        })
    }

    const setCurrentMonth = () => {
        setDateRange({
            startDate: dayjs(startOfMonth(new Date())),
            endDate: dayjs(new Date()),
        })
    }

    const setLastMonth = () => {
        setDateRange({
            startDate: dayjs(startOfMonth(subMonths(new Date(), 1))),
            endDate: dayjs(endOfMonth(subMonths(new Date(), 1))),
        })
    }

    const filteredBudgets = budgets.filter((budget) => {
        const cityMatch = cityFilter
            ? normalizeString(budget.client.address.city).includes(
                  normalizeString(cityFilter)
              )
            : true
        const dateMatch =
            dateRange.startDate && dateRange.endDate
                ? new Date(budget.createdAt.seconds * 1000) >=
                      new Date(dateRange.startDate) &&
                  new Date(budget.createdAt.seconds * 1000) <=
                      new Date(dateRange.endDate)
                : true
        const statusMatch = budgetStatusFilter
            ? (budget.status || 'opened') === budgetStatusFilter
            : true

        return cityMatch && dateMatch && statusMatch
    })

    const filteredVisits = visits.filter((visit) => {
        const cityMatch = cityFilter
            ? normalizeString(visit.local).includes(normalizeString(cityFilter))
            : true
        const dateMatch =
            dateRange.startDate && dateRange.endDate
                ? new Date(visit.date) >= new Date(dateRange.startDate) &&
                  new Date(visit.date) <= new Date(dateRange.endDate)
                : true
        const statusMatch = visitStatusFilter
            ? (visit.progress || 'pending') === visitStatusFilter
            : true

        return cityMatch && dateMatch && statusMatch
    })

    const getAlertSeverity = (status, type) => {
        const statusMap = {
            budget: {
                opened: 'warning',
                'in-progress': 'success',
                closed: 'primary',
                canceled: 'error',
            },
            visit: {
                pending: 'warning',
                'budget-generated': 'success',
                achieved: 'primary',
                'no-requirement': 'error',
            },
        }
        return statusMap[type][status] || 'info'
    }

    return (
        <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
                <Button
                    onClick={() => setShowFilters(!showFilters)}
                    variant='contained'
                    color='black'
                >
                    <FilterListRounded sx={{ mr: 1 }} />
                    Filtros
                </Button>
            </Grid>
            <Dialog open={showFilters} onClose={() => setShowFilters(false)}>
                <DialogTitle>Filtros</DialogTitle>
                <DialogContent>
                    <Grid item xs={12}>
                        <FormControl
                            fullWidth
                            variant='outlined'
                            className='mb-3'
                        >
                            <TextField
                                color='black'
                                size='small'
                                label='Filtrar por Cidade'
                                value={cityFilter}
                                onChange={handleCityFilterChange}
                                variant='outlined'
                            />
                        </FormControl>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Paper className='p-3 border' elevation={2}>
                                <Box className='d-flex gap-3 mb-3'>
                                    <DatePicker
                                        label='Data de início'
                                        value={dateRange.startDate}
                                        onChange={handleDateChange('startDate')}
                                        format='DD/MM/YYYY'
                                        className='w-100'
                                    />
                                    <DatePicker
                                        label='Data de fim'
                                        value={dateRange.endDate}
                                        onChange={handleDateChange('endDate')}
                                        format='DD/MM/YYYY'
                                        className='w-100'
                                    />
                                </Box>
                                <Box className='d-flex gap-2'>
                                    <Button
                                        variant='contained'
                                        color='black'
                                        onClick={setLast7Days}
                                    >
                                        Últimos 7 dias
                                    </Button>
                                    <Button
                                        variant='contained'
                                        color='black'
                                        onClick={setLast30Days}
                                    >
                                        Últimos 30 dias
                                    </Button>
                                    <Button
                                        variant='contained'
                                        color='black'
                                        onClick={setCurrentMonth}
                                    >
                                        Mês atual
                                    </Button>
                                    <Button
                                        variant='contained'
                                        color='black'
                                        onClick={setLastMonth}
                                    >
                                        Mês anterior
                                    </Button>
                                </Box>
                            </Paper>
                        </LocalizationProvider>
                        <Grid container spacing={2} mt={0}>
                            <Grid item xs={12} sm={6}>
                                <FormControl
                                    fullWidth
                                    size='small'
                                    color='black'
                                >
                                    <InputLabel>Status do Orçamento</InputLabel>
                                    <Select
                                        label='Status do Orçamento'
                                        value={budgetStatusFilter}
                                        onChange={
                                            handleBudgetStatusFilterChange
                                        }
                                        variant='outlined'
                                    >
                                        <MenuItem value=''>Todos</MenuItem>
                                        <MenuItem value='opened'>
                                            Aberto
                                        </MenuItem>
                                        <MenuItem value='in-progress'>
                                            Em Progresso
                                        </MenuItem>
                                        <MenuItem value='closed'>
                                            Fechado
                                        </MenuItem>
                                        <MenuItem value='canceled'>
                                            Cancelado
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl
                                    fullWidth
                                    size='small'
                                    color='black'
                                >
                                    <InputLabel>
                                        Status de Progresso da Visita
                                    </InputLabel>
                                    <Select
                                        label='Status de Progresso da Visita'
                                        value={visitStatusFilter}
                                        onChange={handleVisitStatusFilterChange}
                                        variant='outlined'
                                    >
                                        <MenuItem value=''>Todos</MenuItem>
                                        <MenuItem value='pending'>
                                            Pendente
                                        </MenuItem>
                                        <MenuItem value='budget-generated'>
                                            Orçamento Gerado
                                        </MenuItem>
                                        <MenuItem value='achieved'>
                                            Concluído
                                        </MenuItem>
                                        <MenuItem value='no-requirement'>
                                            Sem Necessidade
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        color='black'
                        variant='contained'
                        onClick={() => setShowFilters(false)}
                    >
                        Aplicar
                    </Button>
                </DialogActions>
            </Dialog>

            {budgets.length > 0 && (
                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <Table size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nº</TableCell>
                                    <TableCell>Cliente</TableCell>
                                    <TableCell>Tam. Usina</TableCell>
                                    <TableCell>Data</TableCell>
                                    <TableCell>Vendedor</TableCell>
                                    <TableCell>Cidade</TableCell>
                                    <TableCell>Valor Investimento</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredBudgets.length > 0 ? (
                                    filteredBudgets.map((budget) => (
                                        <TableRow key={budget.id}>
                                            <TableCell>
                                                <Link
                                                    to={`/dashboard/budget/result/${budget.id}`}
                                                >
                                                    {budget.id}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                {budget.client.fantasyName ||
                                                    budget.client.name}
                                            </TableCell>
                                            <TableCell>
                                                {budget.peakGeneration} KWp
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    budget.createdAt.seconds *
                                                        1000
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                {budget.client.seller.name}
                                            </TableCell>
                                            <TableCell>
                                                {budget.client.address.city}
                                            </TableCell>
                                            <TableCell>
                                                {budget.plantValue.toLocaleString(
                                                    'pt-BR',
                                                    {
                                                        style: 'currency',
                                                        currency: 'BRL',
                                                    }
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Alert
                                                    severity={getAlertSeverity(
                                                        budget.status ||
                                                            'opened',
                                                        'budget'
                                                    )}
                                                    icon={false}
                                                    className='py-0'
                                                >
                                                    {budget.status
                                                        ? replaceBudgetStatus(
                                                              budget.status
                                                          )
                                                        : 'Em aberto'}
                                                </Alert>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8}>
                                            Nenhum orçamento encontrado
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    {(() => {
                                        const totalKWp = filteredBudgets
                                            .reduce(
                                                (sum, budget) =>
                                                    sum + budget.peakGeneration,
                                                0
                                            )
                                            .toFixed(2)
                                        const totalInvestment = filteredBudgets
                                            .reduce(
                                                (sum, budget) =>
                                                    sum + budget.plantValue,
                                                0
                                            )
                                            .toLocaleString('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL',
                                            })

                                        return (
                                            <>
                                                <TableCell colSpan={2}>
                                                    Totais
                                                </TableCell>
                                                <TableCell>
                                                    {totalKWp} KWp
                                                </TableCell>
                                                <TableCell
                                                    colSpan={3}
                                                ></TableCell>
                                                <TableCell>
                                                    {totalInvestment}
                                                </TableCell>
                                                <TableCell></TableCell>
                                            </>
                                        )
                                    })()}
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </Grid>
            )}

            {visits.length > 0 && (
                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <Table size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Cliente</TableCell>
                                    <TableCell>Vendedor</TableCell>
                                    <TableCell>Fotos</TableCell>
                                    <TableCell>Data</TableCell>
                                    <TableCell>Local</TableCell>
                                    <TableCell>Contas de Energia</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredVisits.map((visit) => (
                                    <TableRow key={visit.id}>
                                        <TableCell>
                                            <Link
                                                to={`/dashboard/visits/seller/${visit.sellerData.id}/visit/${visit.id}/`}
                                            >
                                                {visit.id}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            {visit.clientData.fantasyName ||
                                                visit.clientData.name}
                                        </TableCell>
                                        <TableCell>
                                            {visit.sellerData.name}
                                        </TableCell>
                                        <TableCell>
                                            {visit.visitImages.length}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                visit.date
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>{visit.local}</TableCell>
                                        <TableCell>
                                            {visit.energyBills
                                                ? visit.energyBills.length
                                                : 0}
                                        </TableCell>
                                        <TableCell>
                                            <Alert
                                                severity={getAlertSeverity(
                                                    visit.progress || 'pending',
                                                    'visit'
                                                )}
                                                icon={false}
                                                className='py-0'
                                            >
                                                {visit.progress
                                                    ? replaceVisitProgress(
                                                          visit.progress
                                                      )
                                                    : 'Pendente'}
                                            </Alert>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            )}
        </Grid>
    )
}

export default General
