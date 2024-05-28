import {
    DeleteRounded,
    EditRounded,
    ExpandMoreRounded,
    FilterListRounded,
    MoreHorizRounded,
    VisibilityRounded,
} from '@mui/icons-material'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    ButtonGroup,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useCompareEffect from '../../../../hooks/useCompareEffect'
import useUtilities from '../../../../hooks/useUtilities'
import useActivityLog from './../../../../hooks/useActivityLog'
import useFirebase from './../../../../hooks/useFirebase'
function ListEntities({ type, entityFilters, entityColumns }) {
    const [entities, setEntities] = useState()
    const [filters, setFilters] = useState(entityFilters)
    const columns = entityColumns
    const [loading, setLoading] = useState(true)
    const { getDocumentsInCollection, updateDocument } = useFirebase()
    const navigate = useNavigate()
    const { replaceEntityProperties } = useUtilities()
    const { useDeepCompareEffect } = useCompareEffect()
    const { logAction } = useActivityLog()
    const [open, setOpen] = useState(false)
    const [toBeDeleted, setToBeDeleted] = useState(null)

    useDeepCompareEffect(() => {
        getDocumentsInCollection(type).then((data) => {
            setEntities(data)
            setLoading(false)
        })
    })

    const propertyIsVisible = (property) => {
        const filterFunc = (obj) => obj.property === property
        const propertyObj = filters.filter((obj) => filterFunc(obj))[0]
        return propertyObj?.value
    }

    const handleCheckboxChange = (property) => {
        setFilters((prevFilters) =>
            prevFilters.map((filter) =>
                filter.property === property
                    ? { ...filter, value: !filter.value }
                    : filter
            )
        )
    }

    const getNestedProperty = (obj, key) => {
        return key.split('.').reduce((o, p) => (o ? o[p] : null), obj)
    }

    const handleClickOpen = (id) => {
        setToBeDeleted(id)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleDelete = async () => {
        await updateDocument(type, toBeDeleted, { delete: true })
        logAction('deleted entity', { entity: toBeDeleted })
        setEntities(entities.filter((entity) => entity.id !== toBeDeleted))
        handleClose()
    }

    return (
        <>
            {entities && entities.length ? (
                <>
                    <Accordion
                        className='rounded-1 mb-3'
                        sx={{ '&::before': { display: 'none' } }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreRounded />}
                            aria-controls='panel1-content'
                            id='panel1-header'
                            sx={{
                                '& .MuiAccordionSummary-content.Mui-expanded': {
                                    margin: '0px',
                                },
                            }}
                        >
                            <div className='d-flex align-items-center gap-2'>
                                <FilterListRounded sx={{ fontSize: 28 }} />
                                <Typography variant='h6'>Filtros</Typography>
                            </div>
                        </AccordionSummary>
                        <AccordionDetails className='row g-3'>
                            <FormGroup className='col-12 col-md-6'>
                                {filters.map((filter, index) => {
                                    if (index >= 0 && index < 6) {
                                        return (
                                            <FormControlLabel
                                                key={filter.property}
                                                control={
                                                    <Checkbox
                                                        color='black'
                                                        checked={filter.value}
                                                        onChange={() =>
                                                            handleCheckboxChange(
                                                                filter.property
                                                            )
                                                        }
                                                    />
                                                }
                                                label={replaceEntityProperties(
                                                    filter.property
                                                )}
                                            />
                                        )
                                    }
                                })}
                            </FormGroup>
                            <FormGroup className='col-12 col-md-6'>
                                {filters.map((filter, index) => {
                                    if (index >= 6) {
                                        return (
                                            <FormControlLabel
                                                key={filter.property}
                                                control={
                                                    <Checkbox
                                                        color='black'
                                                        checked={filter.value}
                                                        onChange={() =>
                                                            handleCheckboxChange(
                                                                filter.property
                                                            )
                                                        }
                                                    />
                                                }
                                                label={replaceEntityProperties(
                                                    filter.property
                                                )}
                                            />
                                        )
                                    }
                                })}
                            </FormGroup>
                        </AccordionDetails>
                    </Accordion>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                            <TableHead>
                                <TableRow>
                                    {filters.map((filter) => {
                                        if (filter.value) {
                                            return (
                                                <TableCell
                                                    key={filter.property}
                                                >
                                                    {replaceEntityProperties(
                                                        filter.property
                                                    )}
                                                </TableCell>
                                            )
                                        }
                                    })}
                                    <TableCell>Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {entities?.map((entity) => {
                                    if (entity.id === 'user_types') return null
                                    if (entity.delete) return null
                                    return (
                                        <TableRow
                                            key={entity.id}
                                            sx={{
                                                '&:last-child td,&:last-child th':
                                                    { border: 0 },
                                            }}
                                        >
                                            {columns.map((column) => {
                                                const split =
                                                    column.key.split('.')
                                                const property =
                                                    split.length > 1
                                                        ? split[1]
                                                        : split[0]
                                                if (
                                                    propertyIsVisible(property)
                                                ) {
                                                    return (
                                                        <TableCell
                                                            key={column.key}
                                                        >
                                                            {getNestedProperty(
                                                                entity,
                                                                column.key
                                                            )}
                                                        </TableCell>
                                                    )
                                                }
                                            })}
                                            <TableCell>
                                                <ButtonGroup
                                                    variant='contained'
                                                    color='black'
                                                    size='small'
                                                >
                                                    {type !==
                                                        'kits/itens/itens' && (
                                                        <Tooltip title='Ver detalhes'>
                                                            <Button
                                                                onClick={() =>
                                                                    navigate(
                                                                        '/dashboard/entities/' +
                                                                            type.slice(
                                                                                0,
                                                                                -1
                                                                            ) +
                                                                            '/' +
                                                                            entity.id
                                                                    )
                                                                }
                                                            >
                                                                <VisibilityRounded fontSize='small' />
                                                            </Button>
                                                        </Tooltip>
                                                    )}
                                                    <Tooltip title='Editar'>
                                                        <Button
                                                            onClick={() =>
                                                                navigate(
                                                                    '/dashboard/entity-registration/' +
                                                                        type.slice(
                                                                            0,
                                                                            -1
                                                                        ) +
                                                                        '/edit/' +
                                                                        entity.id
                                                                )
                                                            }
                                                        >
                                                            <EditRounded fontSize='small' />
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip title='Excluir'>
                                                        <Button
                                                            onClick={() =>
                                                                handleClickOpen(
                                                                    entity.id
                                                                )
                                                            }
                                                        >
                                                            <DeleteRounded fontSize='small' />
                                                        </Button>
                                                    </Tooltip>
                                                    {type === 'clients' && (
                                                        <Tooltip title='Mais'>
                                                            <Button>
                                                                <MoreHorizRounded fontSize='small' />
                                                            </Button>
                                                        </Tooltip>
                                                    )}
                                                </ButtonGroup>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                            <Dialog open={open} onClose={handleClose}>
                                <DialogTitle>
                                    {'Confirmação de Exclusão'}
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText color='black'>
                                        Tem certeza de que deseja excluir esta
                                        entidade? Essa ação{' '}
                                        <strong>pode</strong> ser desfeita.
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleClose} color='black'>
                                        Cancelar
                                    </Button>
                                    <Button
                                        onClick={handleDelete}
                                        autoFocus
                                        color='error'
                                        variant='contained'
                                    >
                                        Excluir
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Table>
                    </TableContainer>
                </>
            ) : (
                <Paper className='p-3 d-flex w-100 justify-content-center align-items-center gap-3'>
                    {loading ? (
                        <>
                            <CircularProgress color='black' size={25} />
                            <Typography variant='h6'>Carregando...</Typography>
                        </>
                    ) : (
                        <Typography variant='h4'>
                            Nenhuma entidade encontrada
                        </Typography>
                    )}
                </Paper>
            )}
        </>
    )
}
export default ListEntities
