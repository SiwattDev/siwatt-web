// CreateItemDialog.jsx
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'
import useFirebase from '../../../../hooks/useFirebase'
import useUtilities from '../../../../hooks/useUtilities'

const CreateItemDialog = ({ open, onClose, item, onUpdate }) => {
    const [type, setType] = useState(item ? item.type : '')
    const [model, setModel] = useState(item ? item.model : '')
    const [manufacturer, setManufacturer] = useState(
        item ? item.manufacturer : ''
    )
    const [description, setDescription] = useState(item ? item.description : '')
    const [value, setValue] = useState(item ? item.value : '')
    const [unit, setUnit] = useState(item ? item.unit : '')
    const [supplier, setSupplier] = useState(item ? item.supplier : '')
    const [power, setPower] = useState(item ? item.power : '')
    const [barcode, setBarcode] = useState(item ? item.barcode : '')
    const [purchasePrice, setpurchase_price] = useState(
        item ? item.purchase_price : ''
    )
    const [salePrice, setsale_price] = useState(item ? item.sale_price : '')
    const [suppliers, setSuppliers] = useState([])
    const { createDocument, updateDocument, getDocumentsInCollection } =
        useFirebase()
    const { generateCode } = useUtilities()

    useEffect(() => {
        getDocumentsInCollection('suppliers').then(setSuppliers)
    }, [])

    const handleTypeChange = (event) => {
        setType(event.target.value)
    }

    const handleModelChange = (event) => {
        setModel(event.target.value)
    }

    const handleManufacturerChange = (event) => {
        setManufacturer(event.target.value)
    }

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value)
    }

    const handleValueChange = (event) => {
        setValue(event.target.value)
    }

    const handleUnitChange = (event) => {
        setUnit(event.target.value)
    }

    const handleSupplierChange = (event) => {
        setSupplier(event.target.value)
    }

    const handlePowerChange = (event) => {
        setPower(event.target.value)
    }

    const handleBarcodeChange = (event) => {
        setBarcode(event.target.value)
    }

    const handlePurchasePriceChange = (event) => {
        setpurchase_price(event.target.value)
    }

    const handleSalePriceChange = (event) => {
        setsale_price(event.target.value)
    }

    const handleCreateClick = async () => {
        const id = item ? item.id : generateCode()
        const newItem = {
            id,
            type,
            model,
            manufacturer,
            description,
            unit: value + unit.toLowerCase(),
            supplier,
            power,
            barcode,
            purchase_price: purchasePrice,
            sale_price: salePrice,
        }
        if (item) {
            await updateDocument('kits/itens/itens', id, newItem)
        } else {
            await createDocument('kits/itens/itens', id, newItem)
        }
        onUpdate()
        onClose()
    }

    const separateTextNumber = (str) => {
        var numbers = str.match(/\d+/)[0]
        var text = str.replace(numbers, '')
        numbers = parseInt(numbers)
        return [numbers, text]
    }

    useEffect(() => {
        if (item) {
            const unitArray = separateTextNumber(item.unit)
            handleTypeChange({ target: { value: item.type } })
            handleModelChange({ target: { value: item.model } })
            handleManufacturerChange({ target: { value: item.manufacturer } })
            handleDescriptionChange({ target: { value: item.description } })
            handleValueChange({ target: { value: unitArray[0] } })
            handleUnitChange({ target: { value: unitArray[1] } })
            handleSupplierChange({ target: { value: item.supplier } })
            handlePowerChange({ target: { value: item.power } })
            handleBarcodeChange({ target: { value: item.barcode } })
            handlePurchasePriceChange({
                target: { value: item.purchase_price },
            })
            handleSalePriceChange({ target: { value: item.sale_price } })
        }
    }, [item])

    useEffect(() => {
        if (!open) {
            setType('')
            setModel('')
            setManufacturer('')
            setDescription('')
            setValue('')
            setUnit('')
            setSupplier('')
            setPower('')
            setBarcode('')
            setpurchase_price('')
            setsale_price('')
        }
    }, [open])

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth='xs'
        >
            <DialogTitle>
                {item ? 'Editar item' : 'Criar um novo item'}
            </DialogTitle>
            <DialogContent className='row g-3'>
                <div className='col-12'>
                    <TextField
                        value={description}
                        onChange={handleDescriptionChange}
                        label='Descrição'
                        size='small'
                        color='black'
                        className='w-100'
                    />
                </div>
                <div className='col-12'>
                    <FormControl
                        fullWidth
                        size='small'
                        color='black'
                    >
                        <InputLabel
                            id='type-entity'
                            color='black'
                        >
                            Tipo
                        </InputLabel>
                        <Select
                            value={type}
                            onChange={handleTypeChange}
                            label='Tipo'
                        >
                            <MenuItem value='module'>Módulo</MenuItem>
                            <MenuItem value='inverter'>Inversor</MenuItem>
                            <MenuItem value='structure'>Estrutura</MenuItem>
                            <MenuItem value='solar_cable'>Cabo Solar</MenuItem>
                            <MenuItem value='staubli_connector'>
                                Staubli Conector
                            </MenuItem>
                            <MenuItem value='fixation'>Fixação</MenuItem>
                            <MenuItem value='surge_protectors'>
                                Protetores de Surto
                            </MenuItem>
                            <MenuItem value='charge_controller'>
                                Controlador de Carga
                            </MenuItem>
                            <MenuItem value='batteries'>Baterias</MenuItem>
                            <MenuItem value='monitoring'>
                                Monitoramento
                            </MenuItem>
                            <MenuItem value='circuit_breaker'>
                                Disjuntor
                            </MenuItem>
                            <MenuItem value='bidirectional_meter'>
                                Medidor Bidirecional
                            </MenuItem>
                            <MenuItem value='automatic_transfer_switch'>
                                Chave de Transferência Automática
                            </MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className='col-12'>
                    <TextField
                        value={model}
                        onChange={handleModelChange}
                        label='Modelo'
                        size='small'
                        color='black'
                        className='w-100'
                    />
                </div>
                <div className='col-12'>
                    <TextField
                        value={manufacturer}
                        onChange={handleManufacturerChange}
                        label='Fabricante'
                        size='small'
                        color='black'
                        className='w-100'
                    />
                </div>
                <div className='col-12'>
                    <FormControl
                        fullWidth
                        size='small'
                        color='black'
                        className='row g-0 d-flex flex-row'
                    >
                        <div className='col-8'>
                            <TextField
                                value={value}
                                onChange={handleValueChange}
                                label='Unidade'
                                size='small'
                                color='black'
                                className='w-100'
                                InputProps={{
                                    sx: { borderRadius: '5px 0px 0px 5px' },
                                }}
                            />
                        </div>
                        <div className='col-4'>
                            <FormControl
                                fullWidth
                                size='small'
                                color='black'
                            >
                                <InputLabel
                                    id='supplier-entity'
                                    color='black'
                                >
                                    Unidade de medida
                                </InputLabel>
                                <Select
                                    value={unit}
                                    onChange={handleUnitChange}
                                    label='Unidade de medida'
                                    sx={{ borderRadius: '0px 5px 5px 0px' }}
                                    className='w-100'
                                >
                                    <MenuItem value='un'>UN</MenuItem>
                                    <MenuItem value='m'>M</MenuItem>
                                    <MenuItem value='cm'>CM</MenuItem>
                                    <MenuItem value='mm'>MM</MenuItem>
                                    <MenuItem value='in'>IN</MenuItem>
                                    <MenuItem value='ft'>FT</MenuItem>
                                    <MenuItem value='l'>L</MenuItem>
                                    <MenuItem value='kl'>KL</MenuItem>
                                    <MenuItem value='ml'>ML</MenuItem>
                                    <MenuItem value='g'>G</MenuItem>
                                    <MenuItem value='kg'>KG</MenuItem>
                                    <MenuItem value='t'>T</MenuItem>
                                    <MenuItem value='lb'>LB</MenuItem>
                                    <MenuItem value='m3'>M³</MenuItem>
                                    <MenuItem value='km3'>KM³</MenuItem>
                                    <MenuItem value='hm3'>HM³</MenuItem>
                                    <MenuItem value='dam3'>DAM³</MenuItem>
                                    <MenuItem value='dm3'>DM³</MenuItem>
                                    <MenuItem value='cm3'>CM³</MenuItem>
                                    <MenuItem value='mm3'>MM³</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </FormControl>
                </div>
                <div className='col-12'>
                    <FormControl
                        fullWidth
                        size='small'
                        color='black'
                    >
                        <InputLabel
                            id='supplier-entity'
                            color='black'
                        >
                            Fornecedor
                        </InputLabel>
                        <Select
                            value={supplier}
                            onChange={handleSupplierChange}
                            label='Fornecedor'
                        >
                            {suppliers.map((supplier) => (
                                <MenuItem
                                    key={supplier.id}
                                    value={supplier.id}
                                >
                                    {supplier.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className='col-12'>
                    <TextField
                        value={power}
                        onChange={handlePowerChange}
                        label='Potência'
                        size='small'
                        color='black'
                        className='w-100'
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    KWp
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
                <div className='col-12'>
                    <TextField
                        value={barcode}
                        onChange={handleBarcodeChange}
                        label='Código de Barras'
                        size='small'
                        color='black'
                        className='w-100'
                    />
                </div>
                <div className='col-12'>
                    <TextField
                        value={purchasePrice}
                        onChange={handlePurchasePriceChange}
                        label='Preço de Compra'
                        size='small'
                        color='black'
                        className='w-100'
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                    R$
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
                <div className='col-12'>
                    <TextField
                        value={salePrice}
                        onChange={handleSalePriceChange}
                        label='Preço de Venda'
                        size='small'
                        color='black'
                        className='w-100'
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                    R$
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => handleCreateClick()}
                    variant='contained'
                    color='black'
                >
                    {item ? 'Atualizar' : 'Criar'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CreateItemDialog
