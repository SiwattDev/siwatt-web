import {
    AddRounded,
    CloseRounded,
    DeleteRounded,
    EditRounded,
    FilterListOffRounded,
    FilterListRounded,
    VisibilityRounded,
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
    Divider,
    Drawer,
    Fab,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Tooltip,
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import useFirebase from '../../../../hooks/useFirebase'
import CreateItemDialog from './CreateItemDialog'

const ProductList = () => {
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [filter, setFilter] = useState({ type: '', supplier: '' })
    const [suppliers, setSuppliers] = useState([])
    const [openDialog, setOpenDialog] = useState(false)
    const [openDrawer, setOpenDrawer] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [filtersApplied, setFiltersApplied] = useState(false)
    const [toBeDeleted, setToBeDeleted] = useState(null)
    const [open, setOpen] = useState(false)
    const [openCreateDialog, setOpenCreateDialog] = useState(false)
    const firebase = useFirebase()

    const types = [
        { value: 'module', label: 'Módulo' },
        { value: 'inverter', label: 'Inversor' },
        { value: 'structure', label: 'Estrutura' },
        { value: 'solar_cable', label: 'Cabo Solar' },
        { value: 'staubli_connector', label: 'Conector Staubli' },
        { value: 'fixation', label: 'Fixação' },
        { value: 'surge_protectors', label: 'Protetores de Surto' },
        { value: 'charge_controller', label: 'Controlador de Carga' },
        { value: 'batteries', label: 'Baterias' },
        { value: 'monitoring', label: 'Monitoramento' },
        { value: 'circuit_breaker', label: 'Disjuntor' },
        { value: 'bidirectional_meter', label: 'Medidor Bidirecional' },
        {
            value: 'automatic_transfer_switch',
            label: 'Chave de Transferência Automática',
        },
    ]

    const getProducts = () => {
        firebase
            .getDocumentsInCollection('kits/itens/itens')
            .then((data) => {
                const promises = data.map(async (product) => {
                    const supplier = await firebase.getDocumentById(
                        'suppliers',
                        product.supplier
                    )
                    return { ...product, supplierName: supplier.name }
                })
                return Promise.all(promises)
            })
            .then((dataWithSupplierName) => {
                setProducts(dataWithSupplierName)
                setFilteredProducts(dataWithSupplierName)
            })
            .catch((error) => console.error(error))

        firebase
            .getDocumentsInCollection('suppliers')
            .then((data) => {
                const supplierOptions = data.map((supplier) => ({
                    value: supplier.id,
                    label: supplier.name,
                }))
                setSuppliers(supplierOptions)
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false))
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
                (product) =>
                    (filter.type === '' ||
                        product.type.includes(filter.type)) &&
                    (filter.supplier === '' ||
                        product.supplierName.includes(filter.supplier))
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

    const handleViewDetails = (product) => {
        setSelectedProduct(product)
        setOpenDrawer(true)
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
                    <div className='col-12'>
                        <FormControl
                            variant='outlined'
                            color='black'
                            size='small'
                            className='w-100'
                        >
                            <InputLabel id='supplier-label'>
                                Fornecedor
                            </InputLabel>
                            <Select
                                labelId='supplier-label'
                                name='supplier'
                                value={filter.supplier}
                                onChange={handleFilterChange}
                                label='Fornecedor'
                            >
                                {suppliers.map((supplier) => (
                                    <MenuItem
                                        key={supplier.value}
                                        value={supplier.label}
                                    >
                                        {supplier.label}
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
            <Drawer
                anchor='right'
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                variant={window.innerWidth < 600 ? 'temporary' : 'persistent'}
                PaperProps={{
                    style: {
                        boxShadow: '-3px 0 10px rgba(0, 0, 0, 0.1)',
                        borderRadius: '20px 0px 0px 20px',
                        border: 'none',
                    },
                }}
            >
                <div className='d-flex justify-content-between align-items-center pt-2 px-4'>
                    <Typography variant='h6'>Detalhes do Produto</Typography>
                    <IconButton
                        variant='contained'
                        color='black'
                        onClick={() => setOpenDrawer(false)}
                        size='small'
                    >
                        <CloseRounded fontSize='small' />
                    </IconButton>
                </div>
                <Divider
                    className='mt-2 mb-3'
                    sx={{ borderColor: 'rgba(0, 0, 0, 0.3)' }}
                />
                {selectedProduct && (
                    <div
                        style={{ width: 300 }}
                        className='pb-2 px-4'
                    >
                        <Typography className='mb-2'>
                            <strong>ID</strong>: {selectedProduct.id}
                        </Typography>
                        <Typography className='mb-2'>
                            <strong>Modelo:</strong> {selectedProduct.model}
                        </Typography>
                        <Typography className='mb-2'>
                            <strong>Descrição:</strong>{' '}
                            {selectedProduct.description}
                        </Typography>
                        <Typography className='mb-2'>
                            <strong>Tipo</strong>: {selectedProduct.type}
                        </Typography>
                        <Typography className='mb-2'>
                            <strong>Fabricante</strong>:{' '}
                            {selectedProduct.manufacturer}
                        </Typography>
                        <Typography className='mb-2'>
                            <strong>Unidade</strong>: {selectedProduct.unit}
                        </Typography>
                        <Typography className='mb-2'>
                            <strong>Fornecedor</strong>:{' '}
                            {selectedProduct.supplierName}
                        </Typography>
                        <Typography className='mb-2'>
                            <strong>Potência</strong>:{' '}
                            {selectedProduct.power + ' KWp'}
                        </Typography>
                        <Typography className='mb-2'>
                            <strong>Código de Barras</strong>:{' '}
                            {selectedProduct.barcode}
                        </Typography>
                        <Typography className='mb-2'>
                            <strong>Preço de Compra</strong>:{' R$ '}
                            {selectedProduct.purchase_price}
                        </Typography>
                        <Typography className='mb-2'>
                            <strong>Preço de Venda</strong>:{' R$ '}
                            {selectedProduct.sale_price}
                        </Typography>
                    </div>
                )}
            </Drawer>
            <div className='row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-0'>
                {filteredProducts.map((product) =>
                    product.delete ? null : (
                        <div
                            className='col'
                            key={product.id}
                        >
                            <Card>
                                <CardContent>
                                    <Typography
                                        variant='h5'
                                        component='div'
                                    >
                                        {product.model}
                                    </Typography>
                                    <Typography
                                        variant='body2'
                                        color='text.secondary'
                                    >
                                        {product.description}
                                    </Typography>
                                </CardContent>
                                <CardActions className='d-flex justify-content-end'>
                                    <ButtonGroup
                                        variant='contained'
                                        color='black'
                                        size='small'
                                    >
                                        <Tooltip title='Ver detalhes'>
                                            <Button
                                                onClick={() =>
                                                    handleViewDetails(product)
                                                }
                                            >
                                                <VisibilityRounded fontSize='small' />
                                            </Button>
                                        </Tooltip>
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
                                                    handleClickOpen(product.id)
                                                }
                                            >
                                                <DeleteRounded fontSize='small' />
                                            </Button>
                                        </Tooltip>
                                    </ButtonGroup>
                                </CardActions>
                            </Card>
                            <Dialog
                                open={open}
                                onClose={handleClose}
                            >
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
                                    <Button
                                        onClick={handleClose}
                                        color='black'
                                    >
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
