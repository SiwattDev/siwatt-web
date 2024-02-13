import { FilterListRounded, SearchRounded } from '@mui/icons-material'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    InputAdornment,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import useFirebase from './../../../../../hooks/useFirebase'

const SelectItemDialog = ({ open, onClose }) => {
    const [items, setItems] = useState([])
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('')
    const [filtered, setFiltered] = useState([])
    const firebase = useFirebase()

    const fetchItems = async () => {
        const fetchedItems = await firebase.getDocumentsInCollection(
            'kits/itens/itens'
        )

        setItems(fetchedItems)
    }

    const handleSearchChange = (event) => {
        setSearch(event.target.value)
    }

    const handleFilterChange = (event) => {
        setFilter(event.target.value)
    }

    const filterItens = () => {
        const filteredItems = items.filter((item) => {
            const matchesSearch =
                !search ||
                (item.nome &&
                    item.nome.toLowerCase().includes(search.toLowerCase())) ||
                !search ||
                (item.modelo &&
                    item.modelo.toLowerCase().includes(search.toLowerCase()))
            const matchesFilter = !filter || item.tipo === filter
            return matchesSearch && matchesFilter
        })

        setFiltered(filteredItems)
    }

    useEffect(() => {
        if (open) fetchItems()
    }, [open])

    useEffect(() => {
        filterItens()
    }, [items, search, filter])

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth='sm'
            >
                <DialogTitle>Selecione um item</DialogTitle>
                <DialogContent className='row g-3'>
                    <div className='col-8'>
                        <TextField
                            value={search}
                            onChange={handleSearchChange}
                            label='Pesquisar'
                            color='black'
                            size='small'
                            className='w-100'
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <SearchRounded />
                                    </InputAdornment>
                                ),
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
                                id='type-entity'
                                color='black'
                            >
                                <FilterListRounded />
                                Filtrar
                            </InputLabel>
                            <Select
                                value={filter}
                                onChange={handleFilterChange}
                                label='icon filter'
                            >
                                <MenuItem value=''>Todos os tipos</MenuItem>
                                <MenuItem value='module'>Módulo</MenuItem>
                                <MenuItem value='inverter'>Inversor</MenuItem>
                                <MenuItem value='structure'>Estrutura</MenuItem>
                                <MenuItem value='solar_cable'>
                                    Cabo Solar
                                </MenuItem>
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
                    {filtered.length > 0 ? (
                        <div className='col-12'>
                            <List className='bg-body-tertiary'>
                                {filtered.map((item, index) => (
                                    <>
                                        <ListItem
                                            key={item.id}
                                            className='cursor-pointer'
                                        >
                                            <ListItemText>
                                                <div>
                                                    <Typography variant='body1'>
                                                        Modelo: {item.modelo}
                                                    </Typography>
                                                    <Typography variant='caption'>
                                                        Fabricante:{' '}
                                                        {item.fabricante}
                                                    </Typography>
                                                    <br />
                                                    <Typography variant='caption'>
                                                        Tipo: {item.tipo}
                                                    </Typography>
                                                </div>
                                            </ListItemText>
                                            <Button
                                                size='small'
                                                color='black'
                                                variant='outlined'
                                                onClick={() => onClose(item.id)}
                                            >
                                                Selecionar
                                            </Button>
                                        </ListItem>
                                        {index === filtered.length && (
                                            <Divider
                                                variant='inset'
                                                component='li'
                                            />
                                        )}
                                    </>
                                ))}
                            </List>
                        </div>
                    ) : (
                        <div>
                            <Typography
                                variant='h6'
                                className='text-center'
                            >
                                Nenhum item encontrado
                            </Typography>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => onClose(null)}
                        variant='contained'
                        color='black'
                    >
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default SelectItemDialog
