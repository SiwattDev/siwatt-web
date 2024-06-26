import {
    PersonRounded,
    PinDropRounded,
    ShareLocationRounded,
    VisibilityRounded,
} from '@mui/icons-material'
import {
    Box,
    Button,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Typography,
} from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import {
    eachDayOfInterval,
    endOfMonth,
    format,
    startOfMonth,
    subDays,
    subMonths,
} from 'date-fns'

import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { useNavigate, useParams } from 'react-router-dom'
import useFirebase from '../../../../hooks/useFirebase'

function SellerVisits() {
    const { id } = useParams()
    const [seller, setSeller] = useState(null)
    const [sellerVisits, setSellerVisits] = useState([])
    const [sortConfig, setSortConfig] = useState({
        key: 'date',
        direction: 'asc',
    })
    const [dateRange, setDateRange] = useState({
        startDate: dayjs(new Date()),
        endDate: dayjs(new Date()),
    })
    const [visitsByDate, setVisitsByDate] = useState({})
    const [daysWithoutVisits, setDaysWithoutVisits] = useState([])
    const { getDocumentsInCollection } = useFirebase()
    const navigate = useNavigate()

    const filterVisitsByDate = () => {
        let startDate = dateRange.startDate
            ? new Date(dateRange.startDate)
            : null
        let endDate = dateRange.endDate ? new Date(dateRange.endDate) : null

        if (endDate) endDate.setHours(23, 59, 59, 999)

        let visitsByDate = {}

        sellerVisits.forEach((visit) => {
            let visitDate = new Date(visit.date)
            let formattedVisitDate =
                visitDate.getDate().toString().padStart(2, '0') +
                '/' +
                (visitDate.getMonth() + 1).toString().padStart(2, '0') +
                '/' +
                visitDate.getFullYear()

            if (
                (!startDate || visitDate >= startDate) &&
                (!endDate || visitDate <= endDate)
            ) {
                if (
                    !Object.prototype.hasOwnProperty.call(
                        visitsByDate,
                        formattedVisitDate
                    )
                ) {
                    visitsByDate[formattedVisitDate] = []
                }
                visitsByDate[formattedVisitDate].push(visit)
            }
        })

        setDaysWithoutVisits(addDaysWithoutVisits(visitsByDate))

        return visitsByDate
    }

    function addDaysWithoutVisits(visitsByDate) {
        let startDate = dateRange.startDate
            ? new Date(dateRange.startDate)
            : null
        let endDate = dateRange.endDate ? new Date(dateRange.endDate) : null

        const allDates = eachDayOfInterval({ start: startDate, end: endDate })

        const formattedDates = allDates.map((date) =>
            format(date, 'dd/MM/yyyy')
        )

        const allVisitsByDate = formattedDates.reduce((obj, date) => {
            obj[date] = visitsByDate[date] || []
            return obj
        }, {})

        return allVisitsByDate
    }

    function setLast7Days() {
        setDateRange({
            startDate: dayjs(subDays(new Date(), 7)),
            endDate: dayjs(new Date()),
        })
    }

    function setLast30Days() {
        setDateRange({
            startDate: dayjs(subDays(new Date(), 30)),
            endDate: dayjs(new Date()),
        })
    }

    function setCurrentMonth() {
        setDateRange({
            startDate: dayjs(startOfMonth(new Date())),
            endDate: dayjs(new Date()),
        })
    }

    function setLastMonth() {
        setDateRange({
            startDate: dayjs(startOfMonth(subMonths(new Date(), 1))),
            endDate: dayjs(endOfMonth(subMonths(new Date(), 1))),
        })
    }

    const handleDateChange = (dateKey) => (date) => {
        setDateRange({
            ...dateRange,
            [dateKey]: date ? date.toDate() : null,
        })
    }

    useEffect(() => {
        Promise.all([
            getDocumentsInCollection('users'),
            getDocumentsInCollection('visits'),
        ])
            .then(([users, visits]) => {
                const sellerData = users.find(
                    (user) => user.id === id && user.user_type === 'seller'
                )
                if (sellerData) {
                    setSeller(sellerData)
                }

                const visitsBySeller = visits.filter(
                    (visit) => visit.user === id
                )
                setSellerVisits(visitsBySeller)
            })
            .catch((error) => console.error(error))
    }, [id])

    useEffect(() => {
        setVisitsByDate(filterVisitsByDate())
    }, [sellerVisits, dateRange])

    const sortData = (data, config) => {
        const sortedData = Object.keys(data).map((key) => data[key][0])

        sortedData.sort((a, b) => {
            if (config.key === 'date') {
                return new Date(a.date) - new Date(b.date)
            } else if (config.key === 'photos') {
                return a.visitImages.length - b.visitImages.length
            } else if (config.key === 'energyBills') {
                return (
                    (a.energyBills?.length || 0) - (b.energyBills?.length || 0)
                )
            } else if (config.key === 'client') {
                return a.clientData.name.localeCompare(b.clientData.name)
            }
            return 0
        })

        if (config.direction === 'desc') {
            sortedData.reverse()
        }

        return sortedData
    }

    const handleSort = (key) => {
        let direction = 'asc'
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
    }

    const sortedVisits = sortData(visitsByDate, sortConfig)

    return (
        <>
            <Paper className='d-flex gap-2 align-items-center px-3 py-2 mb-3'>
                <ShareLocationRounded color='black' />
                <Typography variant='h6' sx={{ color: 'black' }}>
                    CRM Visitas
                </Typography>
            </Paper>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Paper className='p-3'>
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
                </Grid>
                {seller && (
                    <>
                        <Grid item xs={6}>
                            <Paper className='p-3'>
                                <Typography variant='h6' className='fw-bold'>
                                    <PersonRounded /> Vendedor
                                </Typography>
                                <Typography variant='body1'>
                                    <strong>Nome</strong>: {seller.name}
                                </Typography>
                                <Typography variant='body1'>
                                    <strong>Email</strong>: {seller.email}
                                </Typography>
                                <Typography variant='body1'>
                                    <strong>Telefone</strong>: {seller.phone}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper className='p-3'>
                                <Typography variant='h6' className='fw-bold'>
                                    <PinDropRounded /> Local
                                </Typography>
                                <Typography variant='body1'>
                                    <strong>Cidade</strong>:{' '}
                                    {seller.address.city}
                                </Typography>
                                <Typography variant='body1'>
                                    <strong>Estado</strong>: {seller.address.uf}
                                </Typography>
                                <Typography variant='body1'>
                                    <strong>CEP</strong>: {seller.address.cep}
                                </Typography>
                            </Paper>
                        </Grid>
                    </>
                )}
                {Object.keys(daysWithoutVisits).some(
                    (date) => daysWithoutVisits[date].length > 0
                ) ? (
                    <>
                        <Grid item xs={6}>
                            <Paper className='p-3'>
                                <Bar
                                    className='mb-3'
                                    data={{
                                        labels: Object.keys(daysWithoutVisits),
                                        datasets: [
                                            {
                                                label: 'Quantidade de Visitas',
                                                data: Object.values(
                                                    daysWithoutVisits
                                                ).map(
                                                    (visits) => visits.length
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
                                                text: 'Quantidade de Visitas',
                                                color: 'rgb(0, 0, 0)',
                                                font: {
                                                    size: 20,
                                                    family: 'Aptos',
                                                },
                                            },
                                        },
                                    }}
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper className='p-3' sx={{ height: '100%' }}>
                                {Object.keys(visitsByDate).length > 0 && (
                                    <LoadScript googleMapsApiKey='AIzaSyAeOJrvDZOVM5_X-6uGan_Cu0ZiPH5HGVw'>
                                        <GoogleMap
                                            mapContainerStyle={{
                                                width: '100%',
                                                height: 'inherit',
                                            }}
                                            zoom={13}
                                            center={{
                                                lat: parseFloat(
                                                    visitsByDate[
                                                        Object.keys(
                                                            visitsByDate
                                                        )[0]
                                                    ][0].locationData.latitude
                                                ),
                                                lng: parseFloat(
                                                    visitsByDate[
                                                        Object.keys(
                                                            visitsByDate
                                                        )[0]
                                                    ][0].locationData.longitude
                                                ),
                                            }}
                                        >
                                            {Object.keys(visitsByDate).flatMap(
                                                (date) =>
                                                    visitsByDate[date].map(
                                                        (visit, i) => (
                                                            <Marker
                                                                key={i}
                                                                position={{
                                                                    lat: parseFloat(
                                                                        visit
                                                                            .locationData
                                                                            .latitude
                                                                    ),
                                                                    lng: parseFloat(
                                                                        visit
                                                                            .locationData
                                                                            .longitude
                                                                    ),
                                                                }}
                                                            />
                                                        )
                                                    )
                                            )}
                                        </GoogleMap>
                                    </LoadScript>
                                )}
                            </Paper>
                        </Grid>
                    </>
                ) : (
                    <Grid item xs={12}>
                        <Paper className='p-3'>
                            <Typography variant='body1'>
                                Não há visitas no intervalo de datas
                                selecionado. Por favor, tente selecionar outro
                                período ou pode ser que o vendedor não tenha
                                feito nenhuma visita.
                            </Typography>
                        </Paper>
                    </Grid>
                )}
                <Grid item xs={12}>
                    <Paper className='p-3'>
                        <Typography variant='h6'>
                            Visitas feitas pelo vendedor
                        </Typography>
                        {visitsByDate &&
                        Object.keys(visitsByDate).length > 0 ? (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={
                                                        sortConfig.key ===
                                                        'client'
                                                    }
                                                    direction={
                                                        sortConfig.direction
                                                    }
                                                    onClick={() =>
                                                        handleSort('client')
                                                    }
                                                >
                                                    <Typography
                                                        variant='body1'
                                                        className='fw-bold'
                                                    >
                                                        Cliente
                                                    </Typography>
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={
                                                        sortConfig.key ===
                                                        'photos'
                                                    }
                                                    direction={
                                                        sortConfig.direction
                                                    }
                                                    onClick={() =>
                                                        handleSort('photos')
                                                    }
                                                >
                                                    <Typography
                                                        variant='body1'
                                                        className='fw-bold'
                                                    >
                                                        Fotos da Visita
                                                    </Typography>
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={
                                                        sortConfig.key ===
                                                        'date'
                                                    }
                                                    direction={
                                                        sortConfig.direction
                                                    }
                                                    onClick={() =>
                                                        handleSort('date')
                                                    }
                                                >
                                                    <Typography
                                                        variant='body1'
                                                        className='fw-bold'
                                                    >
                                                        Data da Visita
                                                    </Typography>
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    variant='body1'
                                                    className='fw-bold'
                                                >
                                                    Local da Visita
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={
                                                        sortConfig.key ===
                                                        'energyBills'
                                                    }
                                                    direction={
                                                        sortConfig.direction
                                                    }
                                                    onClick={() =>
                                                        handleSort(
                                                            'energyBills'
                                                        )
                                                    }
                                                >
                                                    <Typography
                                                        variant='body1'
                                                        className='fw-bold'
                                                    >
                                                        Contas de Energia
                                                    </Typography>
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    variant='body1'
                                                    className='fw-bold'
                                                >
                                                    Ações
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {sortedVisits.map((visit, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{
                                                    '&:last-child td, &:last-child th':
                                                        { border: 0 },
                                                }}
                                            >
                                                <TableCell>
                                                    {visit.clientData.name}
                                                </TableCell>
                                                <TableCell>
                                                    {visit.visitImages.length}{' '}
                                                    fotos
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(
                                                        visit.date
                                                    ).toLocaleDateString(
                                                        'pt-BR'
                                                    )}
                                                </TableCell>
                                                <TableCell>{`${visit.locationData.latitude}, ${visit.locationData.longitude}`}</TableCell>
                                                <TableCell>
                                                    {visit.energyBills
                                                        ? `Sim, ${visit.energyBills.length} conta(s)`
                                                        : 'Não'}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant='contained'
                                                        color='black'
                                                        size='small'
                                                        onClick={() =>
                                                            navigate(
                                                                `visit/${visit.id}`
                                                            )
                                                        }
                                                    >
                                                        <VisibilityRounded fontSize='small' />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <>
                                <Typography
                                    variant='body1'
                                    className='text-center'
                                >
                                    Nenhuma visita encontrada
                                </Typography>
                            </>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </>
    )
}

export default SellerVisits
