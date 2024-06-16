import {
    AddRounded,
    DeleteRounded,
    EditRounded,
    RemoveRounded,
} from '@mui/icons-material'
import {
    Box,
    Button,
    ButtonGroup,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    Grid,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import useActivityLog from './../../../../hooks/useActivityLog'
import useFirebase from './../../../../hooks/useFirebase'
import useUtilities from './../../../../hooks/useUtilities'
import Page404 from './../404/404'

function Branchs() {
    const {
        getDocumentsInCollection,
        getDocumentById,
        createDocument,
        updateDocument,
    } = useFirebase()
    const [teams, setTeams] = useState([])
    const [branch, setBranch] = useState({})
    const [branchs, setBranchs] = useState([])
    const [loading, setLoading] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [mode, setMode] = useState('create')
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
    const [branchToDelete, setBranchToDelete] = useState(null)
    const [selectedTeams, setSelectedTeams] = useState([])
    const { logAction } = useActivityLog()
    const { showToastMessage, generateCode } = useUtilities()

    const teamIsSelected = (id) => {
        return !!branch?.teams?.find((team) => team.id === id)
    }

    const teamIsDisabled = (id) => {
        return selectedTeams.includes(id) && !teamIsSelected(id)
    }

    const updateBranchs = async () => {
        setLoading(true)
        try {
            let data = await getDocumentsInCollection('branches')
            data = data.filter((branch) => !branch.deleted)

            const branchesWithTeams = await Promise.all(
                data.map(async (branch) => {
                    const teams = await Promise.all(
                        branch.teams.map(async (teamId) => {
                            const team = await getDocumentById('teams', teamId)

                            // Fetch the manager details
                            const manager = await getDocumentById(
                                'users',
                                team.manager
                            )
                            team.manager = manager

                            // Fetch the sellers details
                            const sellers = await Promise.all(
                                team.sellers.map(async (sellerId) => {
                                    const seller = await getDocumentById(
                                        'users',
                                        sellerId
                                    )
                                    return seller
                                })
                            )
                            team.sellers = sellers

                            return team
                        })
                    )
                    branch.teams = teams
                    return branch
                })
            )

            setBranchs([...branchesWithTeams])

            // Atualiza equipes selecionadas
            const allTeams = branchesWithTeams.flatMap((branch) => branch.teams)
            setSelectedTeams(allTeams.map((team) => team.id))

            setLoading(false)
        } catch (error) {
            console.error('Error updating branches:', error)
            showToastMessage('error', 'Erro ao atualizar filiais!')
            setLoading(false)
        }
    }

    const createBranch = async () => {
        setLoading(true)
        try {
            const id = generateCode()
            await createDocument('branches', id, {
                id: id,
                name: branch.name,
                teams: branch.teams.map((team) => team.id),
            })
            setBranch({ name: '', manager: null, teams: [] })
            showToastMessage('success', 'Filial criada com sucesso!')
            logAction('created branch', { branch: id })
            setLoading(false)
            updateBranchs()
        } catch (error) {
            console.error('Error creating branch:', error)
            showToastMessage('error', 'Erro ao criar filial!')
            setLoading(false)
        }
    }

    const updateBranch = async () => {
        setLoading(true)
        try {
            await updateDocument('branches', branch.id, {
                id: branch.id,
                name: branch.name,
                teams: branch.teams.map((team) => team.id),
            })
            setBranch({ name: '', manager: null, teams: [] })
            showToastMessage('success', 'Filial atualizada com sucesso!')
            logAction('updated branch', { branch: branch.id })
            setLoading(false)
            updateBranchs()
        } catch (error) {
            console.error('Error updating branch:', error)
            showToastMessage('error', 'Erro ao atualizar filial!')
            setLoading(false)
        }
    }

    const handleConfirmDelete = (id) => {
        setBranchToDelete(id)
        setOpenConfirmDialog(true)
    }

    const confirmDeleteBranch = async () => {
        if (branchToDelete) {
            setLoading(true)
            try {
                await updateDocument('branches', branchToDelete, {
                    deleted: true,
                })
                showToastMessage('success', 'Filial deletada com sucesso!')
                logAction('deleted branch', { branch: branchToDelete })
                setLoading(false)
                updateBranchs()
            } catch (error) {
                console.error('Error deleting branch:', error)
                showToastMessage('error', 'Erro ao deletar filial!')
                setLoading(false)
            }
        }
    }

    const updateTeams = async () => {
        setLoading(true)
        try {
            const data = await getDocumentsInCollection('teams').then((data) =>
                data.filter((team) => !team.deleted)
            )

            const teamsWithDetails = await Promise.all(
                data.map(async (team) => {
                    const manager = await getDocumentById('users', team.manager)
                    team.manager = manager

                    const sellers = await Promise.all(
                        team.sellers.map(async (sellerId) => {
                            const seller = await getDocumentById(
                                'users',
                                sellerId
                            )
                            return seller
                        })
                    )
                    team.sellers = sellers

                    return team
                })
            )

            setTeams(teamsWithDetails)
            setLoading(false)
        } catch (error) {
            console.error('Error updating teams:', error)
            showToastMessage('error', 'Erro ao atualizar equipes!')
            setLoading(false)
        }
    }

    useEffect(() => {
        updateBranchs()
        updateTeams()
    }, [])

    return (
        <>
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                fullWidth
                maxWidth='sm'
            >
                <DialogTitle>
                    {mode === 'create' ? 'Cadastrar Filial' : 'Editar Filial'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label='Nome da Filial'
                        variant='outlined'
                        color='black'
                        size='small'
                        value={branch.name || ''}
                        onChange={(e) =>
                            setBranch({ ...branch, name: e.target.value })
                        }
                        fullWidth
                        margin='dense'
                    />
                    <Typography variant='subtitle1' className='mb-2'>
                        <strong>Equipes</strong>
                    </Typography>
                    {teams.map((team) => (
                        <Card
                            key={team.id}
                            className='mb-3'
                            elevation={3}
                            sx={{
                                border: teamIsSelected(team.id)
                                    ? '2px solid black'
                                    : '2px solid transparent',
                                backgroundColor: teamIsDisabled(team.id)
                                    ? 'rgba(0, 0, 0, 0.12)'
                                    : 'transparent',
                            }}
                        >
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    gap: '10px',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant='h6'
                                        sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: '1',
                                            WebkitBoxOrient: 'vertical',
                                        }}
                                    >
                                        <strong>Gerente:</strong>{' '}
                                        {team.manager.name}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: '1',
                                            WebkitBoxOrient: 'vertical',
                                        }}
                                    >
                                        <strong>Vendedores:</strong>{' '}
                                        {team.sellers
                                            .map((seller) => seller.name)
                                            .join(', ')}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Button
                                        variant='contained'
                                        color='black'
                                        size='small'
                                        disabled={teamIsDisabled(team.id)}
                                        sx={{
                                            minWidth: '0px',
                                        }}
                                        onClick={() => {
                                            setBranch({
                                                ...branch,
                                                teams: teamIsSelected(team.id)
                                                    ? branch?.teams.filter(
                                                          (t) =>
                                                              t.id !== team.id
                                                      )
                                                    : [
                                                          ...(branch.teams ||
                                                              []),
                                                          team,
                                                      ],
                                            })
                                        }}
                                    >
                                        {teamIsSelected(team.id) ? (
                                            <RemoveRounded fontSize='small' />
                                        ) : (
                                            <AddRounded fontSize='small' />
                                        )}
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button
                        variant='contained'
                        color='black'
                        size='small'
                        onClick={() => {
                            if (mode === 'create') createBranch()
                            else updateBranch()
                            setOpenDialog(false)
                        }}
                    >
                        {mode === 'create' ? 'Cadastrar' : 'Atualizar'}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
                fullWidth
                maxWidth='xs'
            >
                <DialogTitle>Confirmação</DialogTitle>
                <DialogContent>
                    Tem certeza que deseja deletar esta filial?
                </DialogContent>
                <DialogActions>
                    <Button
                        variant='contained'
                        color='black'
                        size='small'
                        onClick={() => {
                            setOpenConfirmDialog(false)
                            setBranchToDelete(null)
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant='contained'
                        color='error'
                        size='small'
                        onClick={confirmDeleteBranch}
                    >
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
            {loading ? (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                    }}
                >
                    <CircularProgress color='black' />
                </Box>
            ) : (
                <>
                    {branchs.length === 0 ? (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                            }}
                        >
                            <Page404
                                title='Nenhuma filial encontrada'
                                message='Clique no botão abaixo para criar uma filial.'
                            />
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            {branchs.map((branch) => (
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    lg={4}
                                    key={branch.id}
                                >
                                    <Card elevation={3}>
                                        <CardContent
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '10px',
                                            }}
                                        >
                                            <Typography
                                                variant='h6'
                                                sx={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: '1',
                                                    WebkitBoxOrient: 'vertical',
                                                }}
                                            >
                                                <strong>Filial:</strong>{' '}
                                                {branch.name}
                                            </Typography>
                                            {branch.teams && (
                                                <>
                                                    {branch.teams.map(
                                                        (team) => (
                                                            <Card
                                                                key={team.id}
                                                                elevation={0}
                                                                sx={{
                                                                    border: '1px solid rgba(0, 0, 0, 0.2)',
                                                                    width: '100%',
                                                                }}
                                                            >
                                                                <CardContent className='py-2 px-3'>
                                                                    <Typography
                                                                        sx={{
                                                                            overflow:
                                                                                'hidden',
                                                                            textOverflow:
                                                                                'ellipsis',
                                                                            display:
                                                                                '-webkit-box',
                                                                            WebkitLineClamp:
                                                                                '1',
                                                                            WebkitBoxOrient:
                                                                                'vertical',
                                                                        }}
                                                                    >
                                                                        <strong>
                                                                            Gerente:
                                                                        </strong>{' '}
                                                                        {
                                                                            team
                                                                                .manager
                                                                                .name
                                                                        }
                                                                    </Typography>
                                                                    {team.sellers && (
                                                                        <Typography
                                                                            sx={{
                                                                                overflow:
                                                                                    'hidden',
                                                                                textOverflow:
                                                                                    'ellipsis',
                                                                                display:
                                                                                    '-webkit-box',
                                                                                WebkitLineClamp:
                                                                                    '1',
                                                                                WebkitBoxOrient:
                                                                                    'vertical',
                                                                            }}
                                                                        >
                                                                            {team.sellers
                                                                                .map(
                                                                                    (
                                                                                        seller
                                                                                    ) =>
                                                                                        seller.name
                                                                                )
                                                                                .join(
                                                                                    ', '
                                                                                )}
                                                                        </Typography>
                                                                    )}
                                                                </CardContent>
                                                            </Card>
                                                        )
                                                    )}
                                                </>
                                            )}
                                        </CardContent>
                                        <CardActions
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                            }}
                                        >
                                            <ButtonGroup
                                                size='small'
                                                variant='contained'
                                                color='black'
                                            >
                                                <Button
                                                    sx={{
                                                        minWidth: '0px',
                                                    }}
                                                    onClick={() => {
                                                        setBranch(branch)
                                                        setOpenDialog(true)
                                                        setMode('edit')
                                                    }}
                                                >
                                                    <EditRounded
                                                        fontSize='small'
                                                        className='me-2'
                                                    />{' '}
                                                    Editar
                                                </Button>
                                                <Button
                                                    color='error'
                                                    sx={{
                                                        minWidth: '0px',
                                                    }}
                                                    onClick={() =>
                                                        handleConfirmDelete(
                                                            branch.id
                                                        )
                                                    }
                                                >
                                                    <DeleteRounded
                                                        fontSize='small'
                                                        className='me-2'
                                                    />{' '}
                                                    Excluir
                                                </Button>
                                            </ButtonGroup>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                    <Tooltip title='Cadastrar Filial' placement='left'>
                        <Fab
                            color='black'
                            sx={{
                                position: 'absolute',
                                bottom: '30px',
                                right: '30px',
                            }}
                            onClick={() => {
                                setOpenDialog(true)
                                setBranch({
                                    name: '',
                                    manager: null,
                                    teams: [],
                                })
                                setMode('create')
                            }}
                        >
                            <AddRounded />
                        </Fab>
                    </Tooltip>
                </>
            )}
            <ToastContainer />
        </>
    )
}

export default Branchs
