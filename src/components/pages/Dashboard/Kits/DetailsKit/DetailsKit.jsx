import { SolarPowerRounded } from '@mui/icons-material'
import {
    Card,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useFirebase from '../../../../../hooks/useFirebase'

function DetailsKit() {
    const [kit, setKit] = useState()
    const { id } = useParams()
    const { getDocumentById } = useFirebase()

    useEffect(() => {
        const fetchKits = async () => {
            const kit = await getDocumentById('/kits/kits/kits', id)
            const items = await Promise.all(
                kit.items.map((itemId) =>
                    getDocumentById('kits/itens/itens', itemId)
                )
            )
            setKit({ ...kit, items: items })
        }
        fetchKits()
    }, [id])

    return (
        <>
            <Paper className='d-flex gap-2 align-items-center px-3 py-2 mb-3'>
                <SolarPowerRounded color='black' />
                <Typography variant='h6' sx={{ color: 'black' }}>
                    Kits
                </Typography>
            </Paper>
            <Card className='p-4 rounded-2'>
                <Typography variant='h5'>Detalhes do Kit</Typography>
                {kit && (
                    <>
                        <Table size='small'>
                            <TableBody>
                                <TableRow>
                                    <TableCell>ID:</TableCell>
                                    <TableCell>{kit.id}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Nome:</TableCell>
                                    <TableCell>{kit.name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Fixação:</TableCell>
                                    <TableCell>{kit.fixationType}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        {kit.items && (
                            <>
                                <Typography variant='h6' className='mt-4 mb-1'>
                                    Componentes do Kit:
                                </Typography>
                                {kit.items.map((item, index) => (
                                    <>
                                        <Typography
                                            variant='subtitle1'
                                            className={
                                                index === 0
                                                    ? 'mb-2'
                                                    : 'mb-2 mt-4'
                                            }
                                        >
                                            {item.model}:
                                        </Typography>
                                        <Table size='small' key={item.id}>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>ID:</TableCell>
                                                    <TableCell>
                                                        {item.id}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Tipo:</TableCell>
                                                    <TableCell>
                                                        {item.type}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        Modelo:
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.model}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        Fabricante:
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.manufacturer}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        Descrição:
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.description}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        Medida:
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.unit}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </>
                                ))}
                            </>
                        )}
                    </>
                )}
            </Card>
        </>
    )
}
export default DetailsKit
