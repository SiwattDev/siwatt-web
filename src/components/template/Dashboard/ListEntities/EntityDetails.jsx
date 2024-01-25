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
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import useCompareEffect from '../../../../hooks/useCompareEffect'
import useFirebase from '../../../../hooks/useFirebase'
import useUtilities from '../../../../hooks/useUtilities'

function EntityDetails() {
    const { type, id } = useParams()
    const [entity, setEntity] = useState()
    const [seller, setSeller] = useState()
    const { getDocumentById } = useFirebase()
    const { replaceUserType, replaceEntityType } = useUtilities()
    const { useDeepCompareEffect } = useCompareEffect()

    useDeepCompareEffect(() => {
        getDocumentById(`${type}s`, id)
            .then((doc) => {
                setEntity(doc)
                console.log(doc)
                if (type === 'client') {
                    if (doc && doc.seller) {
                        console.log(doc.seller)
                        getDocumentById('users', doc.seller)
                            .then((doc) => {
                                if (doc) {
                                    setSeller(doc)
                                }
                            })
                            .catch((err) => {
                                console.log(err)
                                console.log('loading: ', 'partners', doc.seller)
                                getDocumentById('partners', doc.seller)
                                    .then((doc) => {
                                        console.log(doc)
                                        if (doc) {
                                            setSeller(doc)
                                        } else {
                                            setSeller(null)
                                        }
                                    })
                                    .catch((err) => console.log('tentei', err))
                            })
                    }
                }
            })
            .catch((err) => console.error(err))
    })

    return (
        <>
            <Paper className='px-3 py-2 mb-3'>
                <Link
                    to={`/dashboard/${type}s`}
                    className='d-flex gap-2 align-items-center text-black link-underline link-underline-opacity-0'
                >
                    <BadgeRounded color='black' />
                    <Typography
                        variant='h6'
                        sx={{ color: 'black' }}
                    >
                        {replaceEntityType(type)}
                    </Typography>
                </Link>
            </Paper>
            {entity && (
                <Card>
                    <CardContent>
                        <Typography variant='h5'>
                            {entity.fantasy_name
                                ? entity.fantasy_name
                                : entity.name}
                        </Typography>
                        <Divider
                            className='my-2'
                            color='black'
                        ></Divider>
                        <Table size='small'>
                            <TableBody>
                                <TableRow>
                                    <TableCell>ID:</TableCell>
                                    <TableCell>{entity.id}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Nome:</TableCell>
                                    <TableCell>{entity.name}</TableCell>
                                </TableRow>
                                {(type === 'client' || type === 'supplier') &&
                                    Object.prototype.hasOwnProperty.call(
                                        entity,
                                        'cnpj'
                                    ) && (
                                        <TableRow>
                                            <TableCell>
                                                Nome Fantasia:
                                            </TableCell>
                                            <TableCell>
                                                {entity.fantasy_name}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                <TableRow>
                                    <TableCell>E-mail:</TableCell>
                                    <TableCell>{entity.email}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Telefone:</TableCell>
                                    <TableCell>{entity.phone}</TableCell>
                                </TableRow>
                                {(type === 'client' || type === 'supplier') && (
                                    <TableRow>
                                        <TableCell>Tipo de pessoa:</TableCell>
                                        <TableCell>
                                            {Object.prototype.hasOwnProperty.call(
                                                entity,
                                                'cpf'
                                            )
                                                ? 'Física'
                                                : 'Jurídica'}
                                        </TableCell>
                                    </TableRow>
                                )}
                                {type === 'client' && (
                                    <TableRow>
                                        <TableCell>Fachada:</TableCell>
                                        <TableCell>
                                            <img
                                                src={entity.store_facade}
                                                alt='Fachada do cliente'
                                                style={{
                                                    maxHeight: '100px',
                                                    maxWidth: '100%',
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                )}
                                {type === 'client' && (
                                    <TableRow>
                                        <TableCell>Vendedor:</TableCell>
                                        <TableCell>
                                            {seller?.name || 'Carregando...'}
                                        </TableCell>
                                    </TableRow>
                                )}
                                {(type === 'client' || type === 'supplier') && (
                                    <TableRow>
                                        <TableCell>
                                            {Object.prototype.hasOwnProperty.call(
                                                entity,
                                                'cpf'
                                            )
                                                ? 'CPF'
                                                : 'CNPJ'}
                                        </TableCell>
                                        <TableCell>
                                            {Object.prototype.hasOwnProperty.call(
                                                entity,
                                                'cpf'
                                            )
                                                ? entity.cpf
                                                : entity.cnpj}
                                        </TableCell>
                                    </TableRow>
                                )}
                                {type === 'user' && (
                                    <TableRow>
                                        <TableCell>Tipo:</TableCell>
                                        <TableCell>
                                            {replaceUserType(
                                                entity.user_type.type
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )}
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
                                    <TableCell>{entity.address.uf}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Cidade:</TableCell>
                                    <TableCell>{entity.address.city}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Bairro:</TableCell>
                                    <TableCell>
                                        {entity.address.neighborhood}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Cep:</TableCell>
                                    <TableCell>{entity.address.cep}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Rua:</TableCell>
                                    <TableCell>{entity.address.road}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Número:</TableCell>
                                    <TableCell>
                                        {entity.address.number}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Referência:</TableCell>
                                    <TableCell>
                                        {entity.address.reference}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        {(type === 'client' || type === 'supplier') &&
                            Object.prototype.hasOwnProperty.call(
                                entity,
                                'cnpj'
                            ) && (
                                <>
                                    <Typography
                                        variant='h6'
                                        className='mt-4'
                                    >
                                        Contato Direto:
                                    </Typography>
                                    <Table size='small'>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Nome:</TableCell>
                                                <TableCell>
                                                    {entity.direct_contact.name}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Telefone:</TableCell>
                                                <TableCell>
                                                    {
                                                        entity.direct_contact
                                                            .phone
                                                    }
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>E-mail:</TableCell>
                                                <TableCell>
                                                    {
                                                        entity.direct_contact
                                                            .email
                                                    }
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>CPF:</TableCell>
                                                <TableCell>
                                                    {entity.direct_contact.cpf}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    Data de nascimento:
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        entity.direct_contact
                                                            .birth_of_date
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </>
                            )}
                    </CardContent>
                </Card>
            )}
        </>
    )
}
export default EntityDetails
