import { HandshakeRounded } from '@mui/icons-material'
import { Paper, Typography } from '@mui/material'
import ListEntities from '../../../template/Dashboard/ListEntities/ListEntities'

function Partners() {
    return (
        <>
            <Paper className='d-flex gap-2 align-items-center px-3 py-2 mb-3'>
                <HandshakeRounded color='black' />
                <Typography
                    variant='h6'
                    sx={{ color: 'black' }}
                >
                    Parceiros
                </Typography>
            </Paper>
            <ListEntities
                type='partners'
                entityFilters={[
                    { property: 'id', value: false },
                    { property: 'name', value: true },
                    { property: 'email', value: true },
                    { property: 'phone', value: true },
                    { property: 'uf', value: false },
                    { property: 'city', value: false },
                    { property: 'neighborhood', value: false },
                    { property: 'cep', value: true },
                    { property: 'road', value: false },
                    { property: 'number', value: false },
                    { property: 'reference', value: false },
                ]}
                entityColumns={[
                    { key: 'id', title: 'ID' },
                    { key: 'name', title: 'Nome' },
                    { key: 'email', title: 'Email' },
                    { key: 'phone', title: 'Telefone' },
                    { key: 'address.uf', title: 'UF' },
                    { key: 'address.city', title: 'Cidade' },
                    {
                        key: 'address.neighborhood',
                        title: 'Bairro',
                    },
                    { key: 'address.cep', title: 'CEP' },
                    { key: 'address.road', title: 'Rua' },
                    { key: 'address.number', title: 'Número' },
                    {
                        key: 'address.reference',
                        title: 'Referência',
                    },
                ]}
            />
        </>
    )
}
export default Partners
