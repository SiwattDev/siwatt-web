import { ShareLocationRounded, VisibilityRounded } from '@mui/icons-material'
import { Alert, Box, Button, Grid, Paper, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useFirebase from '../../../../hooks/useFirebase'

function CRM() {
    const [visits, setVisits] = useState([])
    const [visitsBySeller, setVisitsBySeller] = useState([])
    const { getDocumentsInCollection } = useFirebase()

    useEffect(() => {
        Promise.all([
            getDocumentsInCollection('visits'),
            getDocumentsInCollection('users'),
        ])
            .then(([visits, users]) => {
                setVisits(visits)
                const sellers = users.filter(
                    (user) => user.user_type === 'seller'
                )
                const visitsBySeller = sellers.map((seller) => {
                    const sellerVisits = visits.filter(
                        (visit) => visit.user === seller.id
                    )
                    return {
                        seller: seller,
                        visits: sellerVisits,
                    }
                })
                setVisitsBySeller(visitsBySeller)

                console.log(visitsBySeller)
            })
            .catch((error) => console.error(error))
    }, [])

    return (
        <>
            <Paper className='d-flex gap-2 align-items-center px-3 py-2 mb-3'>
                <ShareLocationRounded color='black' />
                <Typography variant='h6' sx={{ color: 'black' }}>
                    CRM Visitas
                </Typography>
            </Paper>
            {visits.length > 0 ? (
                <Grid container spacing={2}>
                    {visitsBySeller.map((visitsBySeller) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={visitsBySeller.seller.id}
                        >
                            <Paper
                                className='p-3 py-2 d-flex justify-content-between'
                                sx={{ height: '100%' }}
                            >
                                <Box>
                                    <Typography variant='h6'>
                                        Nome: {visitsBySeller.seller.name}
                                    </Typography>
                                    <Typography variant='body1'>
                                        E-mail: {visitsBySeller.seller.email}
                                    </Typography>
                                    <Typography variant='body1'>
                                        Telefone: {visitsBySeller.seller.phone}
                                    </Typography>
                                    <Typography variant='body1'>
                                        Local:{' '}
                                        {visitsBySeller.seller.address.city} -{' '}
                                        {visitsBySeller.seller.address.uf}
                                    </Typography>
                                    <Typography variant='body1'>
                                        Total de Visitas:{' '}
                                        {visitsBySeller.visits.length}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Link to={`${visitsBySeller.seller.id}`}>
                                        <Button
                                            size='small'
                                            color='black'
                                            variant='contained'
                                            sx={{ minWidth: '0px' }}
                                        >
                                            <VisibilityRounded fontSize='small' />
                                        </Button>
                                    </Link>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Alert severity='warning'>Nenhuma visita registrada</Alert>
            )}
        </>
    )
}

export default CRM
