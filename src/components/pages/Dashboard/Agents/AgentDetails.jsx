import { BadgeRounded } from '@mui/icons-material'
import {
    Card,
    CardContent,
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import useFirebase from '../../../../hooks/useFirebase'
import useUtilities from '../../../../hooks/useUtilities'

function AgentDetails() {
    const { id } = useParams()
    const [user, setUser] = useState()
    const { getDocumentById } = useFirebase()
    const { replaceUserType } = useUtilities()

    useEffect(() => {
        getDocumentById('users', id)
            .then((doc) => setUser(doc))
            .catch((err) => console.error(err))
    })

    return (
        <>
            <Paper className='px-3 py-2 mb-3'>
                <Link
                    to='/dashboard/agents'
                    className='d-flex gap-2 align-items-center text-black link-underline link-underline-opacity-0'
                >
                    <BadgeRounded color='black' />
                    <Typography
                        variant='h6'
                        sx={{ color: 'black' }}
                    >
                        Usuários
                    </Typography>
                </Link>
            </Paper>
            {user && (
                <Card>
                    <CardContent>
                        <Typography variant='h5'>{user.name}</Typography>
                        <Divider
                            className='my-2'
                            color='black'
                        ></Divider>
                        <Table size='small'>
                            <TableBody>
                                <TableRow>
                                    <TableCell>ID:</TableCell>
                                    <TableCell>{user.id}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Nome:</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>E-mail:</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Telefone:</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Tipo:</TableCell>
                                    <TableCell>
                                        {replaceUserType(user.user_type.type)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Typography
                            variant='h6'
                            className='mt-4'
                        >
                            Endereço:
                        </Typography>
                        <Table size='small'>
                            <TableBody>
                                <TableRow>
                                    <TableCell>UF:</TableCell>
                                    <TableCell>{user.address.uf}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Cidade:</TableCell>
                                    <TableCell>{user.address.city}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Bairro:</TableCell>
                                    <TableCell>
                                        {user.address.neighborhood}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Cep:</TableCell>
                                    <TableCell>{user.address.cep}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Rua:</TableCell>
                                    <TableCell>{user.address.road}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Número:</TableCell>
                                    <TableCell>{user.address.number}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Referência:</TableCell>
                                    <TableCell>
                                        {user.address.reference}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </>
    )
}
export default AgentDetails
