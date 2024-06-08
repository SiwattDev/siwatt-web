import {
    DescriptionRounded,
    LocationOnRounded,
    LockClockRounded,
    LockOpenRounded,
    LockRounded,
    NoEncryptionRounded,
    SportsScoreRounded,
    VisibilityRounded,
} from '@mui/icons-material'
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
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
import { endOfMonth, startOfMonth, subDays, subMonths } from 'date-fns'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import useFirebase from '../../../../../hooks/useFirebase'

const GOOGLE_MAPS_API_KEY = 'AIzaSyAeOJrvDZOVM5_X-6uGan_Cu0ZiPH5HGVw'

function General() {
    const [sellers, setSellers] = useState([])
    const { getDocumentsInCollection } = useFirebase()
    const [sellerVisits, setSellerVisits] = useState([])
    const [sellerBudgets, setSellerBudgets] = useState([])
    const [dateRange, setDateRange] = useState({
        startDate: dayjs(new Date()),
        endDate: dayjs(new Date()),
    })

    useEffect(() => {
        getDocumentsInCollection('/users').then((data) => {
            setSellers(data.filter((user) => user.user_type === 'seller'))
        })
    }, [])

    function convertFirestoreTimestampToDate(timestamp) {
        return new Date(
            timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
        )
    }

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

        return visitsByDate
    }

    const filterBudgetsByDate = () => {
        let startDate = dateRange.startDate
            ? new Date(dateRange.startDate)
            : null
        let endDate = dateRange.endDate ? new Date(dateRange.endDate) : null

        if (endDate) endDate.setHours(23, 59, 59, 999)

        let budgetsByDate = {}

        sellerBudgets.forEach((budget) => {
            let budgetDate = convertFirestoreTimestampToDate(budget.createdAt)
            let formattedBudgetDate =
                budgetDate.getDate().toString().padStart(2, '0') +
                '/' +
                (budgetDate.getMonth() + 1).toString().padStart(2, '0') +
                '/' +
                budgetDate.getFullYear()

            if (
                (!startDate || budgetDate >= startDate) &&
                (!endDate || budgetDate <= endDate)
            ) {
                if (
                    !Object.prototype.hasOwnProperty.call(
                        budgetsByDate,
                        formattedBudgetDate
                    )
                ) {
                    budgetsByDate[formattedBudgetDate] = []
                }
                budgetsByDate[formattedBudgetDate].push(budget)
            }
        })

        return budgetsByDate
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
            getDocumentsInCollection('budgets'),
            getDocumentsInCollection('users'),
        ])
            .then(([visits, budgets, users]) => {
                const sellers = users.filter(
                    (user) => user.user_type === 'seller'
                )
                const visitsBySeller = visits.map((visit) => {
                    const seller = sellers.find(
                        (seller) => seller.id === visit.user
                    )
                    return { ...visit, seller }
                })
                const budgetsBySeller = budgets.map((budget) => {
                    const seller = sellers.find(
                        (seller) => seller.id === budget.client.seller.id
                    )
                    return {
                        ...budget,
                        seller,
                        date: convertFirestoreTimestampToDate(budget.createdAt),
                    }
                })
                setSellerVisits(visitsBySeller)
                setSellerBudgets(budgetsBySeller)
            })
            .catch((error) => console.error(error))
    }, [])

    useEffect(() => {
        filterVisitsByDate()
        filterBudgetsByDate()
    }, [sellerVisits, sellerBudgets, dateRange])

    const calculateTopSellers = () => {
        const sellerPerformances = sellers.map((seller) => {
            const sellerVisitsInDateRange = sellerVisits.filter(
                (visit) =>
                    visit.seller.id === seller.id &&
                    (!dateRange.startDate ||
                        new Date(visit.date) >=
                            new Date(dateRange.startDate)) &&
                    (!dateRange.endDate ||
                        new Date(visit.date) <= new Date(dateRange.endDate))
            )

            const sellerBudgetsInDateRange = sellerBudgets.filter(
                (budget) =>
                    budget.seller.id === seller.id &&
                    (!dateRange.startDate ||
                        new Date(budget.date) >=
                            new Date(dateRange.startDate)) &&
                    (!dateRange.endDate ||
                        new Date(budget.date) <= new Date(dateRange.endDate))
            )

            return {
                ...seller,
                visits: sellerVisitsInDateRange.length,
                budgets: sellerBudgetsInDateRange.length,
                performanceScore:
                    sellerVisitsInDateRange.length +
                    sellerBudgetsInDateRange.length,
            }
        })

        return sellerPerformances
            .sort((a, b) => b.performanceScore - a.performanceScore)
            .slice(0, 5)
    }

    const topSellers = calculateTopSellers()

    const countBudgetsByStatus = (budgets) => {
        const statusCount = {
            open: 0,
            inProgress: 0,
            closed: 0,
            cancelled: 0,
        }

        budgets.forEach((budget) => {
            const status = budget.status || 'open'
            statusCount[status] = (statusCount[status] || 0) + 1
        })

        return statusCount
    }

    return (
        <>
            <Card className='my-3'>
                <CardContent>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                    </LocalizationProvider>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    {sellers && sellers.length > 0 ? (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nome</TableCell>
                                        <TableCell>Telefone</TableCell>
                                        <TableCell>E-mail</TableCell>
                                        <TableCell>Cidade/UF</TableCell>
                                        <TableCell>Visitas</TableCell>
                                        <TableCell>Orçamentos</TableCell>
                                        <TableCell>Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sellers.map((seller) => {
                                        const sellerVisitsInDateRange =
                                            sellerVisits
                                                .filter(
                                                    (visit) =>
                                                        visit.seller.id ===
                                                        seller.id
                                                )
                                                .filter(
                                                    (visit) =>
                                                        (!dateRange.startDate ||
                                                            new Date(
                                                                visit.date
                                                            ) >=
                                                                new Date(
                                                                    dateRange.startDate
                                                                )) &&
                                                        (!dateRange.endDate ||
                                                            new Date(
                                                                visit.date
                                                            ) <=
                                                                new Date(
                                                                    dateRange.endDate
                                                                ))
                                                )

                                        const sellerBudgetsInDateRange =
                                            sellerBudgets
                                                .filter(
                                                    (budget) =>
                                                        budget.seller.id ===
                                                        seller.id
                                                )
                                                .filter(
                                                    (budget) =>
                                                        (!dateRange.startDate ||
                                                            new Date(
                                                                budget.date
                                                            ) >=
                                                                new Date(
                                                                    dateRange.startDate
                                                                )) &&
                                                        (!dateRange.endDate ||
                                                            new Date(
                                                                budget.date
                                                            ) <=
                                                                new Date(
                                                                    dateRange.endDate
                                                                ))
                                                )

                                        return (
                                            <TableRow key={seller.id}>
                                                <TableCell>
                                                    {seller.name}
                                                </TableCell>
                                                <TableCell>
                                                    {seller.phone}
                                                </TableCell>
                                                <TableCell>
                                                    {seller.email}
                                                </TableCell>
                                                <TableCell>
                                                    {seller.address.city},{' '}
                                                    {seller.address.uf}
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        sellerVisitsInDateRange.length
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        sellerBudgetsInDateRange.length
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        color='black'
                                                        variant='contained'
                                                        size='small'
                                                    >
                                                        <VisibilityRounded fontSize='small' />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography variant='h6'>
                            Nenhum vendedor encontrado
                        </Typography>
                    )}
                </CardContent>
            </Card>
            <Typography variant='h6' className='my-3'>
                Vendedores com maiores desempenhos
            </Typography>
            <Grid container spacing={3}>
                {topSellers.map((seller) => {
                    const sellerBudgetsInDateRange = sellerBudgets.filter(
                        (budget) =>
                            budget.seller.id === seller.id &&
                            (!dateRange.startDate ||
                                new Date(budget.date) >=
                                    new Date(dateRange.startDate)) &&
                            (!dateRange.endDate ||
                                new Date(budget.date) <=
                                    new Date(dateRange.endDate))
                    )

                    const budgetCounts = countBudgetsByStatus(
                        sellerBudgetsInDateRange
                    )

                    const sellerVisitsInDateRange = sellerVisits.filter(
                        (visit) =>
                            visit.seller.id === seller.id &&
                            (!dateRange.startDate ||
                                new Date(visit.date) >=
                                    new Date(dateRange.startDate)) &&
                            (!dateRange.endDate ||
                                new Date(visit.date) <=
                                    new Date(dateRange.endDate))
                    )

                    return (
                        <Grid item xs={12} key={seller.id}>
                            <Card>
                                <CardContent>
                                    <Box
                                        display='flex'
                                        flexDirection={{
                                            xs: 'column',
                                            md: 'row',
                                        }}
                                        justifyContent='space-between'
                                        mt={2}
                                        sx={{
                                            padding: '10px',
                                            maxWidth: '1200px',
                                            margin: '0 auto',
                                        }}
                                    >
                                        <Box
                                            display='flex'
                                            flexDirection='column'
                                        >
                                            <Typography variant='h5'>
                                                {seller.name}
                                            </Typography>
                                            <Typography
                                                variant='body2'
                                                color='textSecondary'
                                                className='mb-2'
                                            >
                                                {seller.address.city},{' '}
                                                {seller.address.uf}
                                            </Typography>
                                            <Card
                                                className='mb-3'
                                                elevation={3}
                                            >
                                                <CardContent className='p-1 px-3'>
                                                    <Typography variant='body1'>
                                                        <LocationOnRounded />{' '}
                                                        Visitas: {seller.visits}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                            <Card
                                                className='mb-3'
                                                elevation={3}
                                            >
                                                <CardContent className='p-1 px-3'>
                                                    <Typography variant='body1'>
                                                        <DescriptionRounded />{' '}
                                                        Orçamentos:{' '}
                                                        {seller.budgets}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                            <Card elevation={3}>
                                                <CardContent className='p-1 px-3'>
                                                    <Typography variant='body1'>
                                                        <SportsScoreRounded />{' '}
                                                        Pontuação:{' '}
                                                        {
                                                            seller.performanceScore
                                                        }
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Box>
                                        <Box
                                            sx={{
                                                width: '100%',
                                                maxWidth: '500px',
                                                height: '200px',
                                            }}
                                            className='my-4'
                                        >
                                            <LoadScript
                                                googleMapsApiKey={
                                                    GOOGLE_MAPS_API_KEY
                                                }
                                            >
                                                <GoogleMap
                                                    mapContainerStyle={{
                                                        width: '100%',
                                                        height: '100%',
                                                        borderRadius: '10px',
                                                        boxShadow:
                                                            '0px 0px 5px #1d202630',
                                                    }}
                                                    zoom={13}
                                                    center={{
                                                        lat:
                                                            sellerVisitsInDateRange.length >
                                                            0
                                                                ? parseFloat(
                                                                      sellerVisitsInDateRange[0]
                                                                          .locationData
                                                                          .latitude
                                                                  )
                                                                : 0,
                                                        lng:
                                                            sellerVisitsInDateRange.length >
                                                            0
                                                                ? parseFloat(
                                                                      sellerVisitsInDateRange[0]
                                                                          .locationData
                                                                          .longitude
                                                                  )
                                                                : 0,
                                                    }}
                                                >
                                                    {sellerVisitsInDateRange.map(
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
                                                    )}
                                                </GoogleMap>
                                            </LoadScript>
                                        </Box>
                                        <Box>
                                            <Typography variant='h5'>
                                                Orçamentos
                                            </Typography>
                                            <Alert
                                                sx={{
                                                    minWidth: 250,
                                                    '& .MuiAlert-icon': {
                                                        marginRight: 0,
                                                        padding: 0,
                                                    },
                                                    '& .MuiAlert-message': {
                                                        padding: '5px 0',
                                                    },
                                                }}
                                                icon={
                                                    <LockOpenRounded fontSize='small' />
                                                }
                                                severity='warning'
                                                className='py-0 px-2 d-flex align-items-center mt-2'
                                            >
                                                <Typography variant='body1'>{`Abertos: ${budgetCounts.open}`}</Typography>
                                            </Alert>
                                            <Alert
                                                sx={{
                                                    minWidth: 250,
                                                    '& .MuiAlert-icon': {
                                                        marginRight: 0,
                                                        padding: 0,
                                                    },
                                                    '& .MuiAlert-message': {
                                                        padding: '5px 0',
                                                    },
                                                }}
                                                icon={
                                                    <LockClockRounded fontSize='small' />
                                                }
                                                severity='success'
                                                className='py-0 px-2 d-flex align-items-center mt-2'
                                            >
                                                <Typography variant='body1'>{`Em andamento: ${budgetCounts.inProgress}`}</Typography>
                                            </Alert>
                                            <Alert
                                                sx={{
                                                    minWidth: 250,
                                                    '& .MuiAlert-icon': {
                                                        marginRight: 0,
                                                        padding: 0,
                                                    },
                                                    '& .MuiAlert-message': {
                                                        padding: '5px 0',
                                                    },
                                                }}
                                                icon={
                                                    <LockRounded fontSize='small' />
                                                }
                                                severity='primary'
                                                className='py-0 px-2 d-flex align-items-center mt-2'
                                            >
                                                <Typography variant='body1'>{`Fechados: ${budgetCounts.closed}`}</Typography>
                                            </Alert>
                                            <Alert
                                                sx={{
                                                    '& .MuiAlert-icon': {
                                                        marginRight: 0,
                                                        padding: 0,
                                                    },
                                                    '& .MuiAlert-message': {
                                                        padding: '5px 0',
                                                    },
                                                }}
                                                icon={
                                                    <NoEncryptionRounded fontSize='small' />
                                                }
                                                severity='error'
                                                className='py-0 px-2 d-flex align-items-center mt-2'
                                            >
                                                <Typography variant='body1'>{`Cancelados: ${budgetCounts.cancelled}`}</Typography>
                                            </Alert>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>
        </>
    )
}

export default General
