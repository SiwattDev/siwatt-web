import {
    AccessTime,
    DescriptionRounded,
    DocumentScannerRounded,
    ImageRounded,
    MapRounded,
    PersonRounded,
} from '@mui/icons-material'
import {
    Box,
    Card,
    CardContent,
    CircularProgress,
    Typography,
} from '@mui/material'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import useFirebase from '../../../../hooks/useFirebase'
import useUtilities from '../../../../hooks/useUtilities'

const StyledImage = styled.img`
    display: block;
    width: auto;
    height: auto;
    max-width: 500px;
    max-height: 300px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
    margin: 20px auto 0px;
`

function VisitDetails() {
    const { visitId } = useParams()
    const { getDocumentById } = useFirebase()
    const { getPeriodOfDay, getDayOfWeek } = useUtilities()
    const [visit, setVisit] = useState()

    useEffect(() => {
        getDocumentById('visits', visitId)
            .then((data) => setVisit(data))
            .catch((error) => console.error(error))
    }, [visitId, getDocumentById])

    return (
        <Card>
            <CardContent>
                {visit ? (
                    <>
                        <Typography variant='h5' component='div'>
                            Cliente: {visit.clientData.name}
                        </Typography>
                        <Typography variant='subtitle2'>
                            ID: {visit.id}
                        </Typography>
                        <Card className='mb-3 mt-3' elevation={3}>
                            <CardContent>
                                <Typography variant='h6' className='mb-3'>
                                    <MapRounded sx={{ mr: 1 }} />
                                    Local da visita
                                </Typography>
                                <LoadScript googleMapsApiKey='AIzaSyAeOJrvDZOVM5_X-6uGan_Cu0ZiPH5HGVw'>
                                    <GoogleMap
                                        mapContainerStyle={{
                                            width: '100%',
                                            height: '300px',
                                            maxWidth: '500px',
                                            boxShadow:
                                                '0px 0px 10px 0px rgba(0,0,0,0.25)',
                                            borderRadius: '10px',
                                            margin: '0px auto',
                                        }}
                                        zoom={19}
                                        center={{
                                            lat: visit.locationData.latitude,
                                            lng: visit.locationData.longitude,
                                        }}
                                    >
                                        <Marker
                                            position={{
                                                lat: visit.locationData
                                                    .latitude,
                                                lng: visit.locationData
                                                    .longitude,
                                            }}
                                        />
                                    </GoogleMap>
                                </LoadScript>
                                <Typography
                                    variant='subtitle2'
                                    sx={{
                                        width: '100%',
                                        maxWidth: '500px',
                                        margin: '0px auto',
                                    }}
                                >
                                    Latitude: {visit.locationData.latitude},
                                    Longitude: {visit.locationData.longitude}
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card className='mb-3' elevation={3}>
                            <CardContent>
                                <Typography variant='h6'>
                                    <AccessTime sx={{ mr: 1 }} />
                                    Data e Hora da Visita
                                </Typography>
                                <Typography variant='subtitle2'>
                                    <strong>Data:</strong>{' '}
                                    {new Date(visit.date).toLocaleDateString(
                                        'pt-BR'
                                    )}{' '}
                                    - {getDayOfWeek(new Date(visit.date))}
                                </Typography>
                                <Typography variant='subtitle2'>
                                    <strong>Hora:</strong>{' '}
                                    {new Date(visit.date).toLocaleTimeString()}{' '}
                                    - {getPeriodOfDay(new Date(visit.date))}
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card className='mb-3' elevation={3}>
                            <CardContent>
                                <Typography variant='h6'>
                                    <PersonRounded sx={{ mr: 1 }} />
                                    Dados do Cliente
                                </Typography>
                                <Typography variant='subtitle2'>
                                    <strong>Nome:</strong>{' '}
                                    {visit.clientData.name}
                                </Typography>
                                {visit.clientData.fantasyName && (
                                    <Typography variant='subtitle2'>
                                        <strong>Nome Fantasia:</strong>{' '}
                                        {visit.clientData.fantasyName}
                                    </Typography>
                                )}
                                <Typography variant='subtitle2'>
                                    <strong>
                                        {visit.clientData.cnpj ? 'CNPJ' : 'CPF'}
                                        :
                                    </strong>{' '}
                                    {visit.clientData.cnpj ||
                                        visit.clientData.cpf}
                                </Typography>
                                <Typography variant='subtitle2'>
                                    <strong>Telefone:</strong>{' '}
                                    {visit.clientData.phone}
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card className='mb-3' elevation={3}>
                            <CardContent>
                                <Typography variant='h6'>
                                    <ImageRounded sx={{ mr: 1 }} />
                                    Imagens da Visita
                                </Typography>
                                {visit.visitImages.length > 0 ? (
                                    <>
                                        {visit.visitImages.map((image) => (
                                            <StyledImage
                                                key={image}
                                                src={image}
                                            />
                                        ))}
                                    </>
                                ) : (
                                    <Typography variant='subtitle2'>
                                        Algo está errado {`>_<`}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                        <Card className='mb-3' elevation={3}>
                            <CardContent>
                                <Typography variant='h6'>
                                    <DescriptionRounded sx={{ mr: 1 }} />
                                    Observações
                                </Typography>
                                <Typography
                                    variant='subtitle2'
                                    className='mt-2'
                                >
                                    {visit.comment}
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card className='mb-3' elevation={3}>
                            <CardContent>
                                <Typography variant='h6'>
                                    <DocumentScannerRounded sx={{ mr: 1 }} />
                                    Contas de Energia
                                </Typography>
                                {visit.energyBills?.length > 0 ? (
                                    <>
                                        {visit.energyBills.map(
                                            (bill, index) => (
                                                <Box key={index}>
                                                    <StyledImage
                                                        src={bill.energyBill}
                                                    />
                                                    <StyledImage
                                                        src={
                                                            bill.energyBillGraph
                                                        }
                                                    />
                                                </Box>
                                            )
                                        )}
                                    </>
                                ) : (
                                    <Typography variant='subtitle2'>
                                        Nenhuma conta de energia encontrada,
                                        algo parece errado.
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Box>
                )}
            </CardContent>
        </Card>
    )
}
export default VisitDetails
