import {
    AddRounded,
    DeleteRounded,
    EditRounded,
    FilterListOffRounded,
    FilterListRounded,
    LockClockRounded,
    LockOpenRounded,
    LockRounded,
    LoopRounded,
    NoEncryptionRounded,
    VisibilityRounded,
} from '@mui/icons-material'
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    FormControl,
    InputLabel,
    Menu,
    MenuItem,
    Paper,
    Select,
    Tooltip,
    Typography,
} from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { BudgetContext } from '../../../../contexts/budgetContext'
import useFirebase from '../../../../hooks/useFirebase'
import useUtilities from '../../../../hooks/useUtilities'

function Budget() {
    const navigate = useNavigate()
    const [budgets, setBudgets] = useState([])
    const [users, setUsers] = useState([])
    const [filtersOpen, setFiltersOpen] = useState(false)
    const [originalBudgets, setOriginalBudgets] = useState([])
    const [filters, setFilters] = useState({
        status: 'all',
        seller: 'all',
    })
    const { getDocumentsInCollection, updateDocument } = useFirebase()
    const { showToastMessage } = useUtilities()
    const { setBudget } = useContext(BudgetContext)
    const [anchorEl, setAnchorEl] = useState(null)
    const [currentBudgetId, setCurrentBudgetId] = useState(null)
    const status = [
        {
            status: 'opened',
            text: 'Em aberto',
            color: 'warning',
            icon: <LockOpenRounded className='me-1' fontSize='small' />,
        },
        {
            status: 'in-progress',
            text: 'Em andamento',
            color: 'success',
            icon: <LockClockRounded className='me-1' fontSize='small' />,
        },
        {
            status: 'closed',
            text: 'Fechado',
            color: 'info',
            icon: <LockRounded className='me-1' fontSize='small' />,
        },
        {
            status: 'cancelled',
            text: 'Cancelado',
            color: 'error',
            icon: <NoEncryptionRounded className='me-1' fontSize='small' />,
        },
    ]
    const fetchData = () => {
        Promise.all([
            getDocumentsInCollection('/budgets'),
            getDocumentsInCollection('/users'),
        ]).then(([budgets, users]) => {
            budgets = budgets.map((budget) => {
                if (budget.deleted) return false
                budget.status = budget.status ? budget.status : 'opened'
                return budget
            })
            setBudgets(budgets)
            setOriginalBudgets(budgets)
            setUsers(users.filter((user) => user.id !== 'user_types'))
        })
    }

    const handleClick = (event, id) => {
        setAnchorEl(event.currentTarget)
        setCurrentBudgetId(id)
    }

    const handleClose = (status) => {
        if (currentBudgetId && status) {
            updateDocument('/budgets', currentBudgetId, { status }).then(() => {
                console.log('updated')
                fetchData()
            })
        }
        setAnchorEl(null)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const applyFilters = (newFilters = filters) => {
        if (newFilters.status === 'all' && newFilters.seller === 'all') {
            setBudgets(originalBudgets)
        } else {
            setBudgets(
                originalBudgets.filter(
                    (budget) =>
                        (newFilters.status === 'all' ||
                            budget.status === newFilters.status) &&
                        (newFilters.seller === 'all' ||
                            budget.client.seller.id === newFilters.seller)
                )
            )
        }
    }

    const updateBudget = (id) => {
        let budget = budgets.find((budget) => budget.id === id)
        budget = {
            ...budget,
            action: 'edit',
        }
        setBudget(budget)
        navigate(`edit/${id}`)
    }

    const deleteBudget = (id) => {
        updateDocument('budgets', id, { deleted: true })
            .then(() => {
                showToastMessage('success', 'O orçamento foi excluído')
                setBudgets(budgets.filter((budget) => budget.id !== id))
                setOriginalBudgets(
                    originalBudgets.filter((budget) => budget.id !== id)
                )
            })
            .catch((error) => {
                showToastMessage(
                    'error',
                    'Erro inesperado ao tentar excluir o orçamento'
                )
                console.log(error)
            })
    }

    return (
        <>
            <Button
                variant='contained'
                onClick={() => setFiltersOpen(true)}
                size='small'
                color='black'
                className='ms-3'
            >
                <FilterListRounded /> Filtrar
            </Button>
            {budgets.length > 0 ? (
                <Box className='d-flex flex-wrap justify-content-center'>
                    {budgets.map((budget) => {
                        console.log(budget)
                        return budget ? (
                            <Paper
                                elevation={3}
                                sx={{ m: 2, p: 2, maxWidth: '400px' }}
                                key={budget.id}
                            >
                                <Box className='d-flex'>
                                    <Box className='w-100'>
                                        <Typography variant='h6'>
                                            <strong>Nº da proposta</strong>:{' '}
                                            {budget.id}
                                        </Typography>
                                        <Typography variant='body1'>
                                            <strong>Tamanho da Usina</strong>:{' '}
                                            {budget.peakGeneration} kW
                                        </Typography>
                                        <Typography variant='body1'>
                                            <strong>Client</strong>:{' '}
                                            {budget.client.name}
                                        </Typography>
                                        <Typography variant='body1'>
                                            <strong>
                                                {budget.client.cnpj
                                                    ? 'CNPJ'
                                                    : 'CPF'}
                                            </strong>
                                            :{' '}
                                            {budget.client.cnpj ||
                                                budget.client.cpf}
                                        </Typography>
                                        <Typography variant='body1'>
                                            <strong>Telefone</strong>:{' '}
                                            {budget.client.phone}
                                        </Typography>
                                    </Box>
                                    <Box className='ms-3 d-flex flex-column gap-2'>
                                        <Button
                                            variant='contained'
                                            size='small'
                                            color='black'
                                            onClick={() =>
                                                navigate(`result/${budget.id}`)
                                            }
                                            startIcon={<VisibilityRounded />}
                                            sx={{
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            Ver mais
                                        </Button>
                                        <Button
                                            variant='contained'
                                            size='small'
                                            color='black'
                                            startIcon={<DeleteRounded />}
                                            sx={{
                                                whiteSpace: 'nowrap',
                                            }}
                                            onClick={() =>
                                                deleteBudget(budget.id)
                                            }
                                        >
                                            Excluir
                                        </Button>
                                        <Button
                                            variant='contained'
                                            size='small'
                                            color='black'
                                            startIcon={<EditRounded />}
                                            disabled={
                                                budget.status === 'closed' ||
                                                budget.status === 'cancelled'
                                            }
                                            sx={{
                                                whiteSpace: 'nowrap',
                                            }}
                                            onClick={() =>
                                                updateBudget(budget.id)
                                            }
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant='contained'
                                            size='small'
                                            color='black'
                                            className='mb-1'
                                            startIcon={<LoopRounded />}
                                            disabled={
                                                budget.status === 'closed' ||
                                                budget.status === 'cancelled'
                                            }
                                            sx={{
                                                whiteSpace: 'nowrap',
                                            }}
                                            onClick={(event) =>
                                                handleClick(event, budget.id)
                                            }
                                        >
                                            Status
                                        </Button>
                                        <Menu
                                            id='simple-menu'
                                            anchorEl={anchorEl}
                                            keepMounted
                                            open={Boolean(anchorEl)}
                                            onClose={() =>
                                                handleClose(null, null)
                                            }
                                            elevation={2}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'center',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'center',
                                            }}
                                        >
                                            <MenuItem
                                                onClick={() =>
                                                    handleClose('opened')
                                                }
                                            >
                                                Em aberto
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() =>
                                                    handleClose('in-progress')
                                                }
                                            >
                                                Em andamento
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() =>
                                                    handleClose('closed')
                                                }
                                            >
                                                Fechado
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() =>
                                                    handleClose('cancelled')
                                                }
                                            >
                                                Cancelado
                                            </MenuItem>
                                        </Menu>
                                    </Box>
                                </Box>
                                <Alert
                                    sx={{
                                        '& .MuiAlert-icon': {
                                            marginRight: 0,
                                        },
                                    }}
                                    icon={
                                        status.filter(({ status }) => {
                                            return status === budget.status
                                        })[0].icon
                                    }
                                    severity={
                                        status.filter(
                                            ({ status }) =>
                                                status === budget.status
                                        )[0].color
                                    }
                                    className='py-0 px-2 d-flex align-items-center mt-2'
                                >
                                    Status:{' '}
                                    {
                                        status.filter(
                                            ({ status }) =>
                                                status === budget.status
                                        )[0].text
                                    }
                                </Alert>
                            </Paper>
                        ) : (
                            false
                        )
                    })}
                </Box>
            ) : (
                <Typography variant='h4' className='text-center mt-3'>
                    Nenhum orçamento encontrado
                </Typography>
            )}
            <Dialog
                open={filtersOpen}
                onClose={() => setFiltersOpen(false)}
                fullWidth
                maxWidth='xs'
            >
                <DialogTitle>Filtrar Orçamentos</DialogTitle>
                <DialogContent>
                    <FormControl
                        size='small'
                        color='black'
                        fullWidth
                        className='mb-3 mt-2'
                    >
                        <InputLabel>Status</InputLabel>
                        <Select
                            label='Status'
                            value={filters.status}
                            onChange={(e) => {
                                setFilters((prevFilters) => ({
                                    ...prevFilters,
                                    status: e.target.value,
                                }))
                            }}
                        >
                            <MenuItem value='all'>Todos</MenuItem>
                            <MenuItem value='opened'>Em aberto</MenuItem>
                            <MenuItem value='in-progress'>
                                Em andamento
                            </MenuItem>
                            <MenuItem value='cancelled'>Cancelado</MenuItem>
                            <MenuItem value='closed'>Concluído</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size='small' color='black' fullWidth>
                        <InputLabel>Vendedor</InputLabel>
                        <Select
                            label='Vendedor'
                            value={filters.seller}
                            onChange={(e) => {
                                setFilters((prevFilters) => ({
                                    ...prevFilters,
                                    seller: e.target.value,
                                }))
                            }}
                        >
                            <MenuItem value='all'>Todos</MenuItem>
                            {users.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant='contained'
                        color='black'
                        onClick={() => setFiltersOpen(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant='contained'
                        color='black'
                        onClick={() => {
                            applyFilters()
                            setFiltersOpen(false)
                        }}
                    >
                        Aplicar
                    </Button>
                    <Button
                        variant='contained'
                        color='black'
                        onClick={() => {
                            const newFilters = {
                                status: 'all',
                                seller: 'all',
                            }
                            setFilters(newFilters)
                            applyFilters(newFilters)
                            setFiltersOpen(false)
                        }}
                    >
                        <FilterListOffRounded />
                    </Button>
                </DialogActions>
            </Dialog>
            <Tooltip title='Novo Orçamento'>
                <Fab
                    color='black'
                    aria-label='add'
                    className='position-fixed bottom-0 end-0 m-4'
                    onClick={() => navigate('new')}
                >
                    <AddRounded />
                </Fab>
            </Tooltip>
            <ToastContainer />
        </>
    )
}
export default Budget
