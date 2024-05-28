import {
    AddRounded,
    DeleteRounded,
    EditRounded,
    FilterListOffRounded,
    FilterListRounded,
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
    DialogContentText,
    DialogTitle,
    Fab,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    Tooltip,
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import useFirebase from '../../../../hooks/useFirebase'
import useActivityLog from './../../../../hooks/useActivityLog'
import CreateItemDialog from './CreateItemDialog'

const ProductList = () => {
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [filter, setFilter] = useState({ type: '', supplier: '' })
    const [openDialog, setOpenDialog] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [filtersApplied, setFiltersApplied] = useState(false)
    const [toBeDeleted, setToBeDeleted] = useState(null)
    const [open, setOpen] = useState(false)
    const [openCreateDialog, setOpenCreateDialog] = useState(false)
    const firebase = useFirebase()
    const { logAction } = useActivityLog()

    const types = [
        { value: 'module', label: 'Módulo' },
        { value: 'inverter', label: 'Inversor' },
    ]

    const getProducts = () => {
        firebase
            .getDocumentsInCollection('kits/itens/itens')
            .then((data) => {
                setLoading(false)
                setProducts(data)
                setFilteredProducts(data)
                console.log(data)
            })
            .catch((error) => console.error(error))
    }

    const enableDisableProduct = (id, disabled) => {
        console.log(disabled)
        const product = products.find((p) => p.id === id)
        firebase
            .updateDocument('kits/itens/itens', id, {
                ...product,
                disabled: disabled,
            })
            .then(getProducts)
            .then(() => {
                logAction('edited product', {
                    product: id,
                    data: { ...product, disabled },
                    oldData: product,
                })
            })
    }

    useEffect(() => {
        getProducts()
    }, [])

    const handleFilterChange = (event) => {
        setFilter({
            ...filter,
            [event.target.name]: event.target.value,
        })
    }

    const applyFilter = () => {
        setFilteredProducts(
            products.filter(
                (product) => filter.type === '' || product.type === filter.type
            )
        )
        setOpenDialog(false)
        setFiltersApplied(true)
    }

    const clearFilters = () => {
        setFilter({ type: '', supplier: '' })
        setFilteredProducts(products)
        setFiltersApplied(false)
    }

    const handleClickOpen = (id) => {
        setToBeDeleted(id)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleDelete = async () => {
        await firebase.updateDocument('kits/itens/itens', toBeDeleted, {
            delete: true,
        })
        logAction('deleted product', { product: toBeDeleted })
        handleClose()
        getProducts()
    }

    const handleCreateNew = () => {
        setSelectedProduct(null)
        setOpenCreateDialog(true)
    }

    const handleEdit = (product) => {
        setSelectedProduct(product)
        setOpenCreateDialog(true)
    }

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <CircularProgress color='black' />
            </Box>
        )
    }

    return (
        <div>
            <Button
                variant='contained'
                onClick={() => setOpenDialog(true)}
                color='black'
                size='small'
                className='ms-3'
            >
                <FilterListRounded className='me-2' /> Filtrar
            </Button>
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                fullWidth
                maxWidth='xs'
            >
                <DialogTitle>Filtrar Produtos</DialogTitle>
                <DialogContent className='row gap-3'>
                    <div className='col-12 mt-2'>
                        <FormControl
                            variant='outlined'
                            color='black'
                            size='small'
                            className='w-100'
                        >
                            <InputLabel id='type-label'>Tipo</InputLabel>
                            <Select
                                labelId='type-label'
                                name='type'
                                value={filter.type}
                                onChange={handleFilterChange}
                                label='Tipo'
                            >
                                {types.map((type) => (
                                    <MenuItem
                                        key={type.value}
                                        value={type.value}
                                    >
                                        {type.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant='contained'
                        color='black'
                        onClick={() => setOpenDialog(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant='contained'
                        color='black'
                        onClick={applyFilter}
                    >
                        Aplicar
                    </Button>
                    <Button
                        variant='contained'
                        color='black'
                        onClick={clearFilters}
                        disabled={!filtersApplied}
                    >
                        <FilterListOffRounded />
                    </Button>
                </DialogActions>
            </Dialog>
            <div className='row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-0'>
                {filteredProducts.map((product) =>
                    product.delete ? null : (
                        <div className='col' key={product.id}>
                            <Card>
                                <CardContent>
                                    <Typography
                                        variant='h5'
                                        sx={{
                                            display: '-webkit-box',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            WebkitBoxOrient: 'vertical',
                                            WebkitLineClamp: '1',
                                        }}
                                    >
                                        {product.model}
                                    </Typography>
                                    <Typography variant='body2'>
                                        ID: {product.id}
                                    </Typography>
                                    <Typography variant='body2'>
                                        Potência: {product.power}
                                    </Typography>
                                    <Typography variant='body2'>
                                        Preço: {product.price}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Switch
                                        checked={!product.disabled}
                                        onChange={() =>
                                            enableDisableProduct(
                                                product.id,
                                                !product.disabled
                                            )
                                        }
                                        color='black'
                                    />

                                    <div className='d-flex justify-content-end w-100'>
                                        <ButtonGroup
                                            variant='contained'
                                            color='black'
                                            size='small'
                                        >
                                            <Tooltip title='Editar'>
                                                <Button
                                                    onClick={() =>
                                                        handleEdit(product)
                                                    }
                                                >
                                                    <EditRounded fontSize='small' />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title='Excluir'>
                                                <Button
                                                    onClick={() =>
                                                        handleClickOpen(
                                                            product.id
                                                        )
                                                    }
                                                >
                                                    <DeleteRounded fontSize='small' />
                                                </Button>
                                            </Tooltip>
                                        </ButtonGroup>
                                    </div>
                                </CardActions>
                            </Card>
                            <Dialog open={open} onClose={handleClose}>
                                <DialogTitle>
                                    {'Confirmação de Exclusão'}
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText color='black'>
                                        Tem certeza de que deseja excluir este
                                        produto? Essa ação <strong>pode</strong>{' '}
                                        ser desfeita.
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
                        </div>
                    )
                )}
            </div>
            <Tooltip title='Novo Produto'>
                <Fab
                    color='black'
                    aria-label='add'
                    className='position-fixed bottom-0 end-0 m-4'
                    onClick={handleCreateNew}
                >
                    <AddRounded />
                </Fab>
            </Tooltip>
            <CreateItemDialog
                open={openCreateDialog}
                onClose={() => setOpenCreateDialog(false)}
                item={selectedProduct}
                onUpdate={getProducts}
            />
        </div>
    )
}

export default ProductList
