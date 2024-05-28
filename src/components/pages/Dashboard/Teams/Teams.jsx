import {
    AddRounded,
    DeleteRounded,
    EditRounded,
    PeopleRounded,
} from '@mui/icons-material'
import {
    Box,
    Button,
    ButtonGroup,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    FormGroup,
    Grid,
    MenuItem,
    Paper,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import useActivityLog from '../../../../hooks/useActivityLog'
import useUtilities from '../../../../hooks/useUtilities'
import useFirebase from './../../../../hooks/useFirebase'
import Page404 from './../404/404'

function Teams() {
    const [teams, setTeams] = useState(null)
    const [users, setUsers] = useState(null)
    const [newTeam, setNewTeam] = useState({ sellers: [] })
    const [activeSeller, setActiveSeller] = useState(null)
    const [openDialog, setOpenDialog] = useState(false)
    const [editingTeam, setEditingTeam] = useState(null)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [loading, setLoading] = useState(false)
    const [openSellersDialog, setOpenSellersDialog] = useState(false)
    const [teamToShow, setTeamToShow] = useState(null)
    const { getDocumentsInCollection, createDocument, updateDocument } =
        useFirebase()
    const { showToastMessage, generateCode } = useUtilities()
    const { logAction } = useActivityLog()

    const fetchTeams = () => {
        setLoading(true)
        getDocumentsInCollection('/teams').then((data) => {
            setTeams(data.filter((team) => !team.deleted))
            setLoading(false)
        })
    }

    const handleAddTeam = () => {
        if (newTeam.manager && newTeam.sellers.length > 0) {
            const managerHasTeam = teams.some(
                (team) =>
                    team.manager === newTeam.manager &&
                    (!editingTeam || team.id !== editingTeam.id)
            )
            if (managerHasTeam) {
                showToastMessage(
                    'error',
                    'Cada gerente só pode ter uma equipe!'
                )
                return
            }

            const sellerInOtherTeam = teams.some(
                (team) =>
                    team.id !== editingTeam?.id &&
                    team.sellers.some((seller) =>
                        newTeam.sellers.includes(seller)
                    )
            )
            if (sellerInOtherTeam) {
                showToastMessage(
                    'error',
                    'Um vendedor não pode estar em duas equipes!'
                )
                return
            }

            const teamId = editingTeam ? editingTeam.id : generateCode()
            const teamWithId = { ...newTeam, id: teamId }

            if (editingTeam) {
                updateDocument('/teams', editingTeam.id, teamWithId)
                    .then(() => {
                        showToastMessage(
                            'success',
                            'Equipe atualizada com sucesso!'
                        )
                        setEditingTeam(null)
                        logAction('edited team', {
                            team: teamId,
                            data: teamWithId,
                            oldData: editingTeam,
                        })
                        fetchTeams()
                    })
                    .catch((e) => {
                        console.log(e)
                        showToastMessage(
                            'error',
                            'Ops! Erro inesperado ao atualizar equipe!'
                        )
                    })
            } else {
                createDocument('/teams', teamId, teamWithId)
                    .then(() => {
                        showToastMessage(
                            'success',
                            'Equipe criada com sucesso!'
                        )
                        logAction('created team', { team: teamId })
                        fetchTeams()
                    })
                    .catch((e) => {
                        console.log(e)
                        showToastMessage(
                            'error',
                            'Ops! Erro inesperado ao criar equipe!'
                        )
                    })
            }
        } else {
            if (!newTeam.manager)
                showToastMessage('error', 'Selecione o gerente da equipe')
            if (newTeam.sellers.length === 0)
                showToastMessage('error', 'Selecione pelo menos um vendedor')
        }
    }

    const handleRemoveSeller = (seller) => {
        setNewTeam({
            ...newTeam,
            sellers: [...newTeam.sellers.filter((id) => id !== seller)],
        })
    }

    const handleEditTeam = (team) => {
        setNewTeam(team)
        setEditingTeam(team)
        setOpenDialog(true)
    }

    const handleDeleteTeam = (team) => {
        updateDocument('/teams', team.id, { ...team, deleted: true })
            .then(() => {
                showToastMessage('success', 'Equipe excluída com sucesso!')
                setOpenDeleteDialog(false)
                setEditingTeam(null)
                fetchTeams()
                logAction('deleted team', { team: team.id })
            })
            .catch((e) => {
                console.log(e)
                showToastMessage(
                    'error',
                    'Ops! Erro inesperado ao excluir equipe!'
                )
            })
    }

    useEffect(() => {
        setLoading(true)
        getDocumentsInCollection('/users').then((data) => {
            const managers = data.filter((user) => user.user_type === 'manager')
            const sellers = data.filter((user) => user.user_type === 'seller')
            setUsers({ managers: managers, sellers })
            fetchTeams()
        })
    }, [])

    useEffect(() => {
        console.log(teamToShow)
    }, [teamToShow])

    return (
        <Box height={'100%'}>
            <Grid container spacing={2}>
                {teams &&
                    !loading &&
                    teams.map((team) => {
                        const teamData = {
                            manager: users.managers.find(
                                (manager) => manager.id === team.manager
                            ),
                            sellers: team.sellers.map((seller) =>
                                users.sellers.find((user) => user.id === seller)
                            ),
                        }
                        return (
                            <Grid item xs={12} sm={6} lg={4} key={team.id}>
                                <Paper className='p-3'>
                                    <Typography variant='h6'>
                                        <strong>Gerente</strong>:{' '}
                                        {teamData.manager.name}
                                    </Typography>
                                    <Typography className='mb-2'>
                                        <strong>Equipe</strong>: {team.id}
                                    </Typography>
                                    <ButtonGroup
                                        size='small'
                                        variant='contained'
                                        color='inherit'
                                    >
                                        <Tooltip title='Ver vendedores'>
                                            <Button
                                                color='black'
                                                onClick={() => {
                                                    setTeamToShow(team)
                                                    setOpenSellersDialog(true)
                                                }}
                                            >
                                                <PeopleRounded fontSize='small' />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title='Editar'>
                                            <Button
                                                color='black'
                                                onClick={() =>
                                                    handleEditTeam(team)
                                                }
                                            >
                                                <EditRounded fontSize='small' />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title='Excluir'>
                                            <Button
                                                color='error'
                                                onClick={() => {
                                                    setNewTeam(team)
                                                    setEditingTeam(team)
                                                    setOpenDeleteDialog(true)
                                                }}
                                            >
                                                <DeleteRounded fontSize='small' />
                                            </Button>
                                        </Tooltip>
                                    </ButtonGroup>
                                </Paper>
                            </Grid>
                        )
                    })}
            </Grid>
            {loading && (
                <Box
                    className='d-flex flex-column align-items-center justify-content-center'
                    height='100%'
                >
                    <CircularProgress color='black' />
                    <Typography className='mt-3'>
                        Carregando equipes...
                    </Typography>
                </Box>
            )}
            {!loading && (!teams || teams.length === 0) && (
                <Page404
                    fullPage={false}
                    title='Nenhuma equipe encontrada!'
                    message='Clique no botão abaixo para criar uma nova equipe.'
                />
            )}
            <Tooltip title='Nova Equipe'>
                <Fab
                    color='black'
                    aria-label='add'
                    className='position-fixed bottom-0 end-0 m-4'
                    onClick={() => setOpenDialog(true)}
                >
                    <AddRounded />
                </Fab>
            </Tooltip>
            <Dialog
                open={openDialog}
                onClose={() => {
                    setOpenDialog(false)
                    setEditingTeam(null)
                    setNewTeam({
                        manager: null,
                        sellers: [],
                    })
                }}
                fullWidth
                maxWidth='xs'
            >
                <DialogTitle>
                    {editingTeam ? 'Editar Equipe' : 'Nova Equipe'}
                </DialogTitle>
                {users && (
                    <DialogContent>
                        <TextField
                            select
                            size='small'
                            variant='outlined'
                            color='black'
                            fullWidth
                            label='Gerente'
                            className='my-2'
                            value={newTeam.manager}
                            onChange={(e) =>
                                setNewTeam({
                                    ...newTeam,
                                    manager: e.target.value,
                                })
                            }
                        >
                            {users.managers.map((manager) => (
                                <MenuItem key={manager.id} value={manager.id}>
                                    {manager.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        {users.sellers.length > 0 &&
                            newTeam.sellers.length > 0 && (
                                <>
                                    <Typography>Vendedores:</Typography>
                                    {newTeam.sellers.map((seller) => {
                                        const sellerData = users.sellers.find(
                                            (user) => user.id === seller
                                        )
                                        return (
                                            <Paper
                                                key={seller}
                                                className='mb-2 border px-2 py-1 d-flex justify-content-between align-items-center'
                                                elevation={0}
                                            >
                                                <Typography>
                                                    {sellerData.name}
                                                </Typography>
                                                <Button
                                                    variant='contained'
                                                    color='error'
                                                    size='small'
                                                    onClick={() =>
                                                        handleRemoveSeller(
                                                            seller
                                                        )
                                                    }
                                                >
                                                    Remover
                                                </Button>
                                            </Paper>
                                        )
                                    })}
                                </>
                            )}
                        <FormGroup
                            className='row container mt-3'
                            sx={{
                                width: '100%',
                                padding: '0px',
                                margin: '0',
                                flexDirection: 'row',
                            }}
                        >
                            <TextField
                                select
                                size='small'
                                variant='outlined'
                                color='black'
                                label='Adicionar Vendedor'
                                className='col-10'
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '5px 0px 0px 5px',
                                    },
                                }}
                                value={activeSeller}
                                onChange={(e) =>
                                    setActiveSeller(e.target.value)
                                }
                            >
                                {users.sellers.map((seller) => (
                                    <MenuItem key={seller.id} value={seller.id}>
                                        {seller.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Tooltip title='Adicionar'>
                                <Button
                                    variant='contained'
                                    size='small'
                                    color='black'
                                    className='rounded-0 rounded-end col-2'
                                    disabled={!activeSeller}
                                    onClick={() => {
                                        if (
                                            !newTeam.sellers.includes(
                                                activeSeller
                                            )
                                        ) {
                                            setNewTeam({
                                                ...newTeam,
                                                sellers: [
                                                    ...newTeam.sellers,
                                                    activeSeller,
                                                ],
                                            })
                                            setActiveSeller(null)
                                        } else {
                                            console.log(
                                                'Vendedor já adicionado'
                                            )
                                            setActiveSeller(null)
                                            showToastMessage(
                                                'error',
                                                'Vendedor já adicionado'
                                            )
                                        }
                                    }}
                                >
                                    <AddRounded />
                                </Button>
                            </Tooltip>
                        </FormGroup>
                    </DialogContent>
                )}
                <DialogActions>
                    <Button
                        variant='contained'
                        color='black'
                        onClick={() => {
                            setOpenDialog(false)
                            setEditingTeam(null)
                            setNewTeam({
                                manager: null,
                                sellers: [],
                            })
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant='contained'
                        color='black'
                        onClick={() => {
                            setOpenDialog(false)
                            handleAddTeam()
                            setNewTeam({
                                manager: null,
                                sellers: [],
                            })
                        }}
                    >
                        {editingTeam ? 'Editar' : 'Criar'}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
            >
                <DialogTitle>Excluir Equipe</DialogTitle>
                <DialogContent className='pb-2'>
                    Você tem certeza de que deseja excluir esta equipe?
                </DialogContent>
                <DialogActions>
                    <Button
                        variant='contained'
                        color='black'
                        size='small'
                        onClick={() => setOpenDeleteDialog(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant='contained'
                        color='error'
                        size='small'
                        onClick={() => handleDeleteTeam(editingTeam)}
                    >
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openSellersDialog}
                onClose={() => setOpenSellersDialog(false)}
                fullWidth
                maxWidth='xs'
            >
                <DialogTitle>Vendedores</DialogTitle>
                <DialogContent className='pb-2' sx={{ maxHeight: '260px' }}>
                    {teamToShow &&
                        teamToShow.sellers.map((seller) => {
                            const sellerData = users.sellers.find(
                                (user) => user.id === seller
                            )
                            return (
                                <Paper
                                    key={seller}
                                    className='mb-2 p-2 border'
                                    elevation={0}
                                >
                                    <Typography>{sellerData.name}</Typography>
                                    <Typography>
                                        <strong>E-mail</strong>:{' '}
                                        {sellerData.email}
                                    </Typography>
                                    <Typography>
                                        <strong>Telefone</strong>:{' '}
                                        {sellerData.phone}
                                    </Typography>
                                    <Typography>
                                        <strong>Cidade</strong>:{' '}
                                        {sellerData.address.city}
                                    </Typography>
                                </Paper>
                            )
                        })}
                </DialogContent>
                <DialogActions>
                    <Button
                        variant='contained'
                        color='black'
                        onClick={() => setOpenSellersDialog(false)}
                    >
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer />
        </Box>
    )
}

export default Teams
