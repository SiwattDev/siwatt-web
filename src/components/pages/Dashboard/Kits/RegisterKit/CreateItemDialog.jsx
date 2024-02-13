import {
    Button,
    Dialog,
    DialogTitle,
    MenuItem,
    Select,
    TextField,
} from '@mui/material'
import { useState } from 'react'
import useFirebase from './../../../../../hooks/useFirebase'

const CreateItemDialog = ({ open, onClose, onItemCreated }) => {
    const [type, setType] = useState('')
    const [model, setModel] = useState('')
    const firebase = useFirebase()

    const handleTypeChange = (event) => {
        setType(event.target.value)
    }

    const handleModelChange = (event) => {
        setModel(event.target.value)
    }

    const handleCreateClick = async () => {
        const newItem = { type, model }
        const itemId = await firebase.createDocument(
            'kits/itens/itens',
            null,
            newItem
        )
        onItemCreated({ ...newItem, id: itemId })
        onClose()
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle>Criar um novo item</DialogTitle>
            <Select
                value={type}
                onChange={handleTypeChange}
            >
                <MenuItem value='Módulo'>Módulo</MenuItem>
                <MenuItem value='Inversor'>Inversor</MenuItem>
                <MenuItem value='Estrutura'>Estrutura</MenuItem>
                {/* Adicione mais opções conforme necessário */}
            </Select>
            <TextField
                value={model}
                onChange={handleModelChange}
                placeholder='Modelo'
            />
            <Button onClick={handleCreateClick}>Criar</Button>
        </Dialog>
    )
}

export default CreateItemDialog
