import {
    AddRounded,
    CloseRounded,
    GridViewRounded,
    MenuRounded,
    SolarPowerRounded,
} from '@mui/icons-material'
import { Masonry } from '@mui/lab'
import {
    Card,
    CardContent,
    Collapse,
    Divider,
    Paper,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useFirebase from '../../../../hooks/useFirebase'

function Kits() {
    const [kits, setKits] = useState([])
    const [expanded, setExpanded] = useState(null)
    const { getDocumentById, getDocumentsInCollection } = useFirebase()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchKits = async () => {
            const kitsData = await getDocumentsInCollection('kits/kits/kits')
            const kitsWithItems = await Promise.all(
                kitsData.map(async (kit) => {
                    const items = await Promise.all(
                        kit.items.map((itemId) =>
                            getDocumentById('kits/itens/itens', itemId)
                        )
                    )
                    return { ...kit, items }
                })
            )
            setKits(kitsWithItems)
        }
        fetchKits()
    }, [getDocumentById])

    const handleExpandClick = (id) => {
        setExpanded(expanded !== id ? id : null)
    }

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
            <Masonry
                columns={3}
                spacing={2}
            >
                {kits.map((kit) => (
                    <Card
                        key={kit.id}
                        onClick={() => handleExpandClick(kit.id)}
                    >
                        <CardContent>
                            <Typography variant='h5'>{kit.name}</Typography>
                            <Typography variant='subtitle1'>
                                {kit.fixationType}
                            </Typography>
                            {kit.items.length > 0 && (
                                <>
                                    <Collapse
                                        in={expanded === kit.id}
                                        timeout='auto'
                                        unmountOnExit
                                    >
                                        <Typography
                                            variant='h6'
                                            className='fw-bold'
                                        >
                                            Componentes:
                                        </Typography>
                                        {kit.items.map((item, index) => (
                                            <>
                                                <Typography>
                                                    Modelo: {item.modelo}
                                                </Typography>
                                                <Typography>
                                                    Fabricante:{' '}
                                                    {item.fabricante}
                                                </Typography>
                                                <Typography>
                                                    Tipo: {item.tipo}
                                                </Typography>
                                                {index === kit.items.length && (
                                                    <Divider color='black' />
                                                )}
                                            </>
                                        ))}
                                    </Collapse>
                                </>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </Masonry>
            <div className='position-fixed bottom-0 end-0 m-4'>
                <SpeedDial
                    ariaLabel='SpeedDial basic example'
                    sx={{ position: 'absolute', bottom: 16, right: 16 }}
                    icon={
                        <SpeedDialIcon
                            icon={<MenuRounded />}
                            openIcon={<CloseRounded />}
                        />
                    }
                    color='black'
                    FabProps={{
                        sx: {
                            bgcolor: 'black.main',
                            '&:hover': {
                                bgcolor: 'black.main',
                            },
                        },
                    }}
                >
                    <SpeedDialAction
                        icon={<AddRounded />}
                        tooltipTitle='Cadastrar Novo Kit'
                        onClick={() => navigate('new')}
                    />
                    <SpeedDialAction
                        icon={<GridViewRounded />}
                        tooltipTitle='Ver Elementos Cadastrados'
                        onClick={() => navigate('new')}
                    />
                </SpeedDial>
            </div>
        </>
    )
}
export default Kits
