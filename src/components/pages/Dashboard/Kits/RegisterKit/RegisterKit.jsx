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
import useFirebase from './../../../../../hooks/useFirebase'
import CreateItemDialog from './CreateItemDialog'
import SelectItemDialog from './SelectItemDialog'

const RegisterKit = () => {
    const [kitName, setKitName] = useState('')
    const [fixationType, setFixationType] = useState('')
    const [items, setItems] = useState([])
    const [itemsData, setItemsData] = useState([])
    const [openSelect, setOpenSelect] = useState(false)
    const [openCreate, setOpenCreate] = useState(false)
    const { generateCode, showToastMessage } = useUtilities()
    const { createDocument, getDocumentById } = useFirebase()

    const handleAddItem = async () => {
        setOpenSelect(true)
    }

    const handleRegisterKit = () => {
        const id = generateCode()
        createDocument('kits/kits/kits', id, {
            id,
            name: kitName,
            fixationType,
            items,
        })
            .then(() => {
                showToastMessage('success', 'Kit cadastrado com sucesso')
            })
            .catch(() => {
                showToastMessage(
                    'error',
                    'Error inesperado ao tentar cadastrar'
                )
            })
    }

    useEffect(() => {
        console.log({
            name: kitName,
            fixationType,
            items,
        })
    }, [kitName, fixationType, items])

    useEffect(() => {
        if (items.length > 0) {
            items.map((item) => {
                getDocumentById('kits/itens/itens', item).then((result) => {
                    setItemsData([...itemsData, result])
                })
            })
        }
    }, [items])

    return (
        <>
            <Paper className='d-flex gap-2 align-items-center px-3 py-2 mb-3'>
                <SolarPowerRounded color='black' />
                <Typography
                    variant='h6'
                    sx={{ color: 'black' }}
                >
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
                        <FormControl
                            fullWidth
                            size='small'
                        >
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
                            {itemsData.map((item) => {
                                return (
                                    <div key={item.id}>
                                        <Typography variant='h6'>
                                            {item.modelo}
                                        </Typography>
                                        <Typography variant='body2'>
                                            {item.tipo}
                                        </Typography>
                                        <Typography variant='body2'>
                                            {item.fabricante}
                                        </Typography>
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
            <CreateItemDialog
                open={openCreate}
                onClose={() => setOpenCreate(false)}
            />
            <ToastContainer autoClose={5000} />
        </>
    )
}

export default RegisterKit
