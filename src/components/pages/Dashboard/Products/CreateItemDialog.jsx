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
import useActivityLog from './../../../../hooks/useActivityLog'

const CreateItemDialog = ({ open, onClose, item, onUpdate }) => {
    const [type, setType] = useState(item ? item.type : '')
    const [model, setModel] = useState(item ? item.model : '')
    const [power, setPower] = useState(item ? item.power : '')
    const [price, setPrice] = useState(item ? item.sale_price : '')
    const { createDocument, updateDocument } = useFirebase()
    const { generateCode } = useUtilities()
    const { logAction } = useActivityLog()

    const handleTypeChange = (event) => {
        setType(event.target.value)
    }

    const handleModelChange = (event) => {
        setModel(event.target.value)
    }

    const handlePowerChange = (event) => {
        setPower(event.target.value)
    }

    const handlePriceChange = (event) => {
        const price = event.target.value
            .replace(/\D/g, '')
            .replace(/(\d)(\d{2})$/, '$1,$2')
            .replace(/(?=(\d{3})+(\D))\B/g, '.')
        setPrice('R$ ' + price)
    }

    const handleCreateClick = async () => {
        const id = item ? item.id : generateCode()
        const newItem = {
            id,
            type,
            model,
            power,
            price,
        }
        if (item) {
            await updateDocument('kits/itens/itens', id, newItem)
            logAction('edited item', { item: id, data: newItem, oldData: item })
        } else {
            await createDocument('kits/itens/itens', id, newItem)
            logAction('created item', { item: id })
        }
        onUpdate()
        onClose()
    }

    useEffect(() => {
        if (item) {
            handleTypeChange({ target: { value: item.type } })
            handleModelChange({ target: { value: item.model } })
            handlePowerChange({ target: { value: item.power } })
            handlePriceChange({ target: { value: item.price } })
        }
    }, [item])

    useEffect(() => {
        if (!open) {
            setType('')
            setModel('')
            setPower('')
            setPrice('')
        }
    }, [open])

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='xs'>
            <DialogTitle>
                {item ? 'Editar item' : 'Criar um novo item'}
            </DialogTitle>
            <DialogContent className='row g-3'>
                <div className='col-12'>
                    <FormControl fullWidth size='small' color='black'>
                        <InputLabel id='type-entity' color='black'>
                            Tipo
                        </InputLabel>
                        <Select
                            value={type}
                            onChange={handleTypeChange}
                            label='Tipo'
                        >
                            <MenuItem value='module'>Módulo</MenuItem>
                            <MenuItem value='inverter'>Inversor</MenuItem>
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
                        value={price}
                        onChange={handlePriceChange}
                        label='Preço'
                        size='small'
                        color='black'
                        className='w-100'
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
