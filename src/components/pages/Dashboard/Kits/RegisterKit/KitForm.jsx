import { Add, SolarPowerRounded } from '@mui/icons-material'
import {
    Button,
    Card,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import useUtilities from '../../../../../hooks/useUtilities'
import useFirebase from '../../../../../hooks/useFirebase'
import SelectItemDialog from './SelectItemDialog'
import { useParams } from 'react-router-dom'

const KitForm = () => {
    const [kit, setKit] = useState(null)
    const [kitName, setKitName] = useState('')
    const [fixationType, setFixationType] = useState('')
    const [items, setItems] = useState([])
    const [itemsData, setItemsData] = useState([])
    const [openSelect, setOpenSelect] = useState(false)
    const { generateCode, showToastMessage } = useUtilities()
    const { createDocument, getDocumentById, updateDocument } = useFirebase()
    const { id } = useParams()

    const handleAddItem = async () => {
        setOpenSelect(true)
    }

    const handleRegisterKit = async () => {
        const id = kit ? kit.id : generateCode()

        try {
            if (kit) {
                await updateDocument('kits/kits/kits', id, {
                    id,
                    name: kitName,
                    fixationType,
                    items,
                })
            } else {
                await createDocument('kits/kits/kits', id, {
                    id,
                    name: kitName,
                    fixationType,
                    items,
                })
            }

            showToastMessage('success', 'Kit cadastrado com sucesso')
        } catch (e) {
            showToastMessage('error', 'Error inesperado ao tentar cadastrar')
        }
    }

    const handleRemoveItem = (itemIndex) => {
        setItemsData((prevItemsData) => {
            return prevItemsData.filter((item, index) => index !== itemIndex)
        })
        setItems((prevItems) => {
            return prevItems.filter((item, index) => index !== itemIndex)
        })
    }

    useEffect(async () => {
        if (id) {
            const kit = await getDocumentById('kits/kits/kits', id)
            if (kit) {
                setKitName(kit.name)
                setFixationType(kit.fixationType)
                setItems(kit.items)
                setKit({
                    id,
                    name: kit.name,
                    fixationType: kit.fixationType,
                    items: kit.items,
                })
            }
        }
    }, [id])

    useEffect(() => {
        console.log('items', items)
        console.log('itemsData', itemsData)
        if (items.length > 0) {
            items.map((item) => {
                getDocumentById('kits/itens/itens', item).then((result) => {
                    setItemsData((prevItemsData) => [...prevItemsData, result])
                })
            })
        }
    }, [items])

    return (
        <>
            <Paper className='d-flex gap-2 align-items-center px-3 py-2 mb-3'>
                <SolarPowerRounded color='black' />
                <Typography variant='h6' sx={{ color: 'black' }}>
                    Kits
                </Typography>
            </Paper>
            <Card className='p-4 rounded-2'>
                <form className='row g-3'>
                    <div className='col-12'>
                        <TextField
                            className='w-100'
                            value={kitName}
                            onChange={(e) => setKitName(e.target.value)}
                            label='Nome do Kit: '
                            size='small'
                            color='black'
                        />
                    </div>
                    <div className='col-12'>
                        <FormControl fullWidth size='small'>
                            <InputLabel color='black'>
                                Tipo de fixação:
                            </InputLabel>
                            <Select
                                value={fixationType}
                                onChange={(e) =>
                                    setFixationType(e.target.value)
                                }
                                label='Tipo de fixação'
                                color='black'
                            >
                                <MenuItem value='Telha de barro'>
                                    Telha de barro
                                </MenuItem>
                                <MenuItem value='Telha de fibrocimento'>
                                    Telha de fibrocimento
                                </MenuItem>
                                <MenuItem value='Cobertura metálica'>
                                    Cobertura metálica
                                </MenuItem>
                                <MenuItem value='Laje'>Laje</MenuItem>
                                <MenuItem value='Solo'>Solo</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    {items.length > 0 && (
                        <>
                            {itemsData.map((item, index) => {
                                return (
                                    <div key={item.id}>
                                        <Typography variant='h6'>
                                            {item.model}
                                        </Typography>
                                        <Typography variant='body2'>
                                            {item.type}
                                        </Typography>
                                        <Typography variant='body2'>
                                            {item.manufacturer}
                                        </Typography>
                                        <Button
                                            variant='contained'
                                            color='black'
                                            size='small'
                                            onClick={() =>
                                                handleRemoveItem(index)
                                            }
                                        >
                                            Remover
                                        </Button>
                                    </div>
                                )
                            })}
                        </>
                    )}
                    <div className='col-12'>
                        <Button
                            onClick={handleAddItem}
                            variant='outlined'
                            color='black'
                            size='small'
                            startIcon={<Add />}
                        >
                            Adicionar um componente ao kit
                        </Button>
                    </div>
                    <div className='col-12'>
                        <Button
                            onClick={handleRegisterKit}
                            variant='contained'
                            color='black'
                        >
                            Cadastrar Kit
                        </Button>
                    </div>
                </form>
            </Card>
            <SelectItemDialog
                open={openSelect}
                onClose={(item) => {
                    setOpenSelect(false)
                    if (item && !items.includes(item))
                        setItems([...items, item])
                    else showToastMessage('error', 'Item já selecionado')
                }}
            />
            <ToastContainer autoClose={5000} />
        </>
    )
}

export default KitForm
