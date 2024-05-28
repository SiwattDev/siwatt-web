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
import { useNavigate } from 'react-router-dom'
import useFirebase from '../../../../hooks/useFirebase'

function SellerVisits() {
    const [sellerVisits, setSellerVisits] = useState([])
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
            getDocumentsInCollection('visits'),
            getDocumentsInCollection('users'),
        ])
            .then(([visits, users]) => {
                const sellers = users.filter(
                    (user) => user.user_type === 'seller'
                )
                const visitsBySeller = visits.map((visit) => {
                    const seller = sellers.find(
                        (seller) => seller.id === visit.user
                    )
                    return { ...visit, seller }
                })
                setSellerVisits(visitsBySeller)
            })
            .catch((error) => console.error(error))
    }, [])

    useEffect(() => {
        setVisitsByDate(filterVisitsByDate())
    }, [sellerVisits, dateRange])

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
                <Grid item xs={6}>
                    <Paper className='p-3'>
                        <Typography variant='h6' className='fw-bold'>
                            <PersonRounded /> Vendedor
                        </Typography>
                        <Typography variant='body1'>
                            <strong>Nome</strong>:{' '}
                            {sellerVisits[0]?.seller?.name}
                        </Typography>
                        <Typography variant='body1'>
                            <strong>Email</strong>:{' '}
                            {sellerVisits[0]?.seller?.email}
                        </Typography>
                        <Typography variant='body1'>
                            <strong>Telefone</strong>:{' '}
                            {sellerVisits[0]?.seller?.phone}
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
                            {sellerVisits[0]?.seller?.address.city}
                        </Typography>
                        <Typography variant='body1'>
                            <strong>Estado</strong>:{' '}
                            {sellerVisits[0]?.seller?.address.uf}
                        </Typography>
                        <Typography variant='body1'>
                            <strong>CEP</strong>:{' '}
                            {sellerVisits[0]?.seller?.address.cep}
                        </Typography>
                    </Paper>
                </Grid>
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
                                                <Typography
                                                    variant='body1'
                                                    className='fw-bold'
                                                >
                                                    Cliente
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    variant='body1'
                                                    className='fw-bold'
                                                >
                                                    Fotos da Visita
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    variant='body1'
                                                    className='fw-bold'
                                                >
                                                    Data da Visita
                                                </Typography>
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
                                                <Typography
                                                    variant='body1'
                                                    className='fw-bold'
                                                >
                                                    Contas de Energia
                                                </Typography>
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
                                        {Object.keys(visitsByDate).map(
                                            (date) => (
                                                <TableRow
                                                    key={date}
                                                    sx={{
                                                        '&:last-child td, &:last-child th':
                                                            {
                                                                border: 0,
                                                            },
                                                    }}
                                                >
                                                    <TableCell>
                                                        {
                                                            visitsByDate[
                                                                date
                                                            ][0].clientData.name
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            visitsByDate[
                                                                date
                                                            ][0].visitImages
                                                                .length
                                                        }{' '}
                                                        fotos
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(
                                                            visitsByDate[
                                                                date
                                                            ][0].date
                                                        ).toLocaleDateString(
                                                            'pt-BR'
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {`${visitsByDate[date][0].locationData.latitude}, ${visitsByDate[date][0].locationData.longitude}`}
                                                    </TableCell>
                                                    <TableCell>
                                                        {visitsByDate[date][0]
                                                            .energyBills
                                                            ? 'Sim, ' +
                                                              visitsByDate[
                                                                  date
                                                              ][0].energyBills
                                                                  .length +
                                                              ' conta(s)'
                                                            : 'Não'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant='contained'
                                                            color='black'
                                                            size='small'
                                                            onClick={() =>
                                                                navigate(
                                                                    `${visitsByDate[date][0].id}`
                                                                )
                                                            }
                                                        >
                                                            <VisibilityRounded fontSize='small' />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
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
