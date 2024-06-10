import {
    AccessTime,
    DescriptionRounded,
    DocumentScannerRounded,
    ImageRounded,
    MapRounded,
    NoteAddRounded,
    PersonAddAltRounded,
    PersonRounded,
} from '@mui/icons-material'
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Typography,
} from '@mui/material'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import axios from 'axios'
import { validateBr } from 'js-brasil'
import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import styled from 'styled-components'
import { BudgetContext } from '../../../../contexts/budgetContext'
import { EntityContext } from '../../../../contexts/entityContext'
import useFirebase from '../../../../hooks/useFirebase'
import useUtilities from '../../../../hooks/useUtilities'
import useActivityLog from './../../../../hooks/useActivityLog'

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
    const { entity, setEntity } = useContext(EntityContext)
    const { setBudget } = useContext(BudgetContext)
    const { visitId } = useParams()
    const { getDocumentById } = useFirebase()
    const { getPeriodOfDay, getDayOfWeek } = useUtilities()
    const { getActionsWithCriteria } = useActivityLog()
    const [visit, setVisit] = useState()
    const { showToastMessage } = useUtilities()
    const navigate = useNavigate()

    useEffect(() => {
        getDocumentById('visits', visitId)
            .then((data) => setVisit(data))
            .catch((error) => console.error(error))
    }, [visitId])

    const getAddressFromCoordinates = async (latitude, longitude) => {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAeOJrvDZOVM5_X-6uGan_Cu0ZiPH5HGVw`
            )

            if (response.data.results && response.data.results.length > 0) {
                const addressComponents =
                    response.data.results[0].address_components
                const getComponent = (type) =>
                    addressComponents.find((component) =>
                        component.types.includes(type)
                    )?.long_name || 'N/A'

                return {
                    number: getComponent('street_number'),
                    road: getComponent('route'),
                    neighborhood: getComponent('sublocality_level_1'),
                    city: getComponent('administrative_area_level_2'),
                    state: getComponent('administrative_area_level_1'),
                    postalCode: getComponent('postal_code'),
                }
            } else {
                console.error(
                    'No results returned by Google Maps Geocoding API'
                )
                return null
            }
        } catch (error) {
            console.error('Error fetching address from coordinates:', error)
            return null
        }
    }

    const createClientData = (visit, visitId, address) => {
        const data = {
            type: 'client',
            name: visit.clientData.name,
            fantasy_name: visit.clientData.fantasyName,
            type_entity: visit.clientData.cnpj ? 'legal-entity' : 'individual',
            phone: visit.clientData.phone,
            origin: {
                type: 'visit',
                id: visitId,
            },
            address,
        }
        if (data.type_entity === 'legal-entity')
            data.cnpj = visit.clientData.cnpj
        else data.cpf = visit.clientData.cpf

        if (validateBr.cep(address.postalCode))
            data.address.cep = address.postalCode

        return data
    }

    const registerClient = async () => {
        if (!visit) return

        const address = await getAddressFromCoordinates(
            visit.locationData.latitude,
            visit.locationData.longitude
        )
        if (!address) return

        const clientData = createClientData(visit, visitId, address)
        setEntity({
            ...entity,
            ...clientData,
        })

        navigate('/dashboard/entity-registration')
    }

    const generateBudget = () => {
        const criteria = {
            action: 'created entity',
            details: {
                origin: {
                    type: 'visit',
                    id: visit.id,
                },
            },
        }

        getActionsWithCriteria(criteria)
            .then((logs) => {
                console.log('Filtered Logs:', logs)
                if (logs.length === 0) {
                    showToastMessage(
                        'error',
                        'O cliente ainda não foi cadastrado, por favor, cadastre-o e tente novamente.'
                    )
                } else {
                    showToastMessage(
                        'success',
                        'Cliente cadastrado, por favor, cadastre o orçamento.'
                    )
                    setBudget({
                        client: logs[0].details.entity,
                        consumption: {
                            energyBills: visit.energyBills.map(
                                (bill, index) => {
                                    return {
                                        id: new Date().getTime() + index,
                                        months: {
                                            jan: 0,
                                            fev: 0,
                                            mar: 0,
                                            abr: 0,
                                            mai: 0,
                                            jun: 0,
                                            jul: 0,
                                            ago: 0,
                                            set: 0,
                                            out: 0,
                                            nov: 0,
                                            dez: 0,
                                        },
                                        name: `Conta de Energia ${
                                            index + 1
                                        } da Visita`,
                                        photoEnergyBill: bill.energyBill,
                                        photoConsumptionChart:
                                            bill.energyBillGraph,
                                    }
                                }
                            ),
                        },
                    })
                    navigate('/dashboard/budget/new')
                }
            })
            .catch((error) => {
                console.error('Error fetching logs:', error)
            })
    }

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
                        <Box sx={{ display: 'flex', gap: '10px', mt: 2 }}>
                            <Button
                                variant='contained'
                                color='black'
                                onClick={registerClient}
                            >
                                <PersonAddAltRounded sx={{ marginRight: 1 }} />{' '}
                                Cadastrar Cliente
                            </Button>
                            <Button
                                variant='contained'
                                color='black'
                                onClick={generateBudget}
                            >
                                <NoteAddRounded sx={{ marginRight: 1 }} /> Gerar
                                Orçamento
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Box>
                )}
            </CardContent>
            <ToastContainer />
        </Card>
    )
}
export default VisitDetails
