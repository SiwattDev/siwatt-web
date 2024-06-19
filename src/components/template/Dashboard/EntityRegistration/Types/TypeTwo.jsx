import { DocumentScannerRounded, PhotoCamera } from '@mui/icons-material'
import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material'
import { maskBr, validateBr } from 'js-brasil'
import { createRef, useState } from 'react'
import useAPI from '../../../../../hooks/useAPI'
import useCompareEffect from '../../../../../hooks/useCompareEffect'
import useFirebase from '../../../../../hooks/useFirebase'
import useStorage from '../../../../../hooks/useStorage'
import useUtilities from '../../../../../hooks/useUtilities'
import Address from './address/Address'
import AttachDocuments from './attach-documents/AttachDocuments'
import DirectContact from './direct-contact/DirectContact'

function Client(props) {
    const { type, state, updateState, updateStateSubObject } = props
    const [sellers, setSellers] = useState([])
    const [selectedFile, setSelectedFile] = useState(null)
    const [openDialog, setOpenDialog] = useState(false)
    const fileInputRef = createRef()
    const { getDocumentsInCollectionWithQuery } = useFirebase()
    const { APICNPJ } = useAPI()
    const { uploadFile } = useStorage()
    const { getDocumentsInCollection } = useFirebase()
    const { showToastMessage } = useUtilities()
    const { useDeepCompareEffect } = useCompareEffect()

    const treatImage = (file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
            const base64String = reader.result
            uploadFile('/clients', base64String, file.name)
                .then((url) => {
                    updateState('store_facade', url)
                })
                .catch((err) => {
                    console.error('Upload falhou:', err)
                })
        }
        reader.readAsDataURL(file)
    }

    const checkIfEntityExists = (value, property) => {
        getDocumentsInCollectionWithQuery(`${type}s`, property, value)
            .then((docs) => {
                if (docs.length > 0) {
                    showToastMessage(
                        'error',
                        `O ${property.toUpperCase()} já está em uso.`
                    )
                    updateState(property, '')
                }
            })
            .catch((err) => {
                console.error(err)
            })
    }

    const cnpjAutoComplete = (e) => {
        let value = e.target.value
        if (validateBr.cnpj(value)) {
            value = maskBr.cnpj(value)
            checkIfEntityExists(value, 'cnpj')
            APICNPJ(e.target.value)
                .then((result) => {
                    updateState('name', result.data.razao_social)
                    updateState(
                        'fantasy_name',
                        result.data.estabelecimento.nome_fantasia
                    )
                    updateState(
                        'state_registration',
                        result.data.estabelecimento.inscricoes_estaduais.filter(
                            (i) => i.ativo === true
                        )[0].inscricao_estadual
                    )
                    updateStateSubObject(
                        'address',
                        'cep',
                        result.data.estabelecimento.cep
                    )
                })
                .catch((err) => console.error(err))
        }
        updateState('cnpj', value)
    }

    useDeepCompareEffect(() => {
        let sellersArray = sellers.length > 0 ? sellers.map((x) => x) : []
        getDocumentsInCollection('users').then((userDocs) => {
            userDocs.forEach((doc) => sellersArray.push(doc))
            getDocumentsInCollection('partners').then((partnerDocs) => {
                partnerDocs.forEach((doc) => sellersArray.push(doc))
                setSellers(sellersArray)
            })
        })
    })

    return (
        <form className='row g-3'>
            <div className='col-12 col-md-6'>
                <FormControl fullWidth size='small'>
                    <InputLabel id='type-entity' color='black'>
                        Tipo de pessoa:
                    </InputLabel>
                    <Select
                        labelId='type-entity'
                        label='Tipo de pessoa:'
                        size='small'
                        color='black'
                        value={state.type_entity || ''}
                        onChange={(e) =>
                            updateState('type_entity', e.target.value)
                        }
                    >
                        <MenuItem value='individual'>Física</MenuItem>
                        <MenuItem value='legal-entity'>Jurídica</MenuItem>
                    </Select>
                </FormControl>
            </div>
            {state.type_entity === 'individual' &&
                state.type !== 'user' &&
                state.type !== 'partner' && (
                    <div className='col-12 col-md-6'>
                        <TextField
                            className='w-100'
                            label='CPF:'
                            variant='outlined'
                            size='small'
                            color='black'
                            value={state.cpf || ''}
                            onChange={(e) => {
                                let value = e.target.value
                                if (validateBr.cpf(value)) {
                                    value = maskBr.cpf(value)
                                    checkIfEntityExists(value, 'cpf')
                                } else value = value.replace(/\D/g, '')
                                updateState('cpf', value)
                            }}
                            autoComplete='off'
                        />
                    </div>
                )}
            {state.type_entity === 'legal-entity' && (
                <>
                    <div className='col-12 col-md-6'>
                        <TextField
                            className='w-100'
                            label='CNPJ:'
                            variant='outlined'
                            size='small'
                            color='black'
                            value={state.cnpj || ''}
                            onChange={(e) => cnpjAutoComplete(e)}
                            autoComplete='off'
                        />
                    </div>
                    <div className='col-12 col-md-6'>
                        <TextField
                            className='w-100'
                            label='Inscrição estadual:'
                            variant='outlined'
                            size='small'
                            color='black'
                            value={state.state_registration || ''}
                            onChange={(e) => {
                                let value = e.target.value
                                updateState('state_registration', value)
                            }}
                            autoComplete='off'
                        />
                    </div>
                </>
            )}
            <div className='col-12 col-md-6'>
                <TextField
                    className='w-100'
                    label='Razão social:'
                    variant='outlined'
                    size='small'
                    color='black'
                    value={state.name || ''}
                    onChange={(e) => updateState('name', e.target.value)}
                    autoComplete='off'
                />
            </div>
            {state.type_entity === 'legal-entity' && (
                <div className='col-12 col-md-6'>
                    <TextField
                        className='w-100'
                        label='Nome fantasia:'
                        variant='outlined'
                        size='small'
                        color='black'
                        value={state.fantasy_name || ''}
                        onChange={(e) =>
                            updateState('fantasy_name', e.target.value)
                        }
                        autoComplete='off'
                    />
                </div>
            )}
            <div className='col-12 col-md-6'>
                <TextField
                    className='w-100'
                    label='E-mail:'
                    variant='outlined'
                    size='small'
                    color='black'
                    value={state.email || ''}
                    onChange={(e) => updateState('email', e.target.value)}
                    autoComplete='off'
                />
            </div>
            <div className='col-12 col-md-6'>
                <TextField
                    className='w-100'
                    label='Telefone:'
                    variant='outlined'
                    size='small'
                    color='black'
                    value={state.phone || ''}
                    onChange={(e) => {
                        let value = e.target.value
                        if (validateBr.telefone(value))
                            value = maskBr.telefone(value)
                        else value = value.replace(/\D/g, '')
                        updateState('phone', value)
                    }}
                    autoComplete='off'
                />
            </div>
            {state.type === 'client' && (
                <div className='col-12'>
                    <input
                        accept='image/*'
                        style={{ display: 'none' }}
                        id='icon-button-file'
                        type='file'
                        onChange={(e) => {
                            setSelectedFile(
                                URL.createObjectURL(e.target.files[0])
                            )
                            treatImage(e.target.files[0])
                        }}
                        ref={fileInputRef}
                    />
                    <Button
                        variant='outlined'
                        startIcon={!selectedFile && <PhotoCamera />}
                        color='black'
                        className={`${
                            selectedFile && 'd-flex flex-column gap-1'
                        } w-100`}
                        onClick={() => fileInputRef.current.click()}
                    >
                        {!selectedFile
                            ? 'Carregar Fachada'
                            : 'Imagem selecionada:'}
                        {selectedFile && (
                            <div className='d-flex justify-content-center'>
                                <img
                                    className='rounded'
                                    src={selectedFile}
                                    alt='preview'
                                    style={{
                                        maxWidth: '80%',
                                        maxHeight: '200px',
                                    }}
                                />
                            </div>
                        )}
                    </Button>
                </div>
            )}
            {state.type === 'client' && (
                <div className='col-12'>
                    <Button
                        variant='outlined'
                        startIcon={!selectedFile && <DocumentScannerRounded />}
                        color='black'
                        className={`${
                            selectedFile && 'd-flex flex-column gap-1'
                        } w-100`}
                        onClick={() => setOpenDialog(!openDialog)}
                    >
                        Documentos do cliente
                    </Button>
                    <AttachDocuments
                        urls={state.docs}
                        open={openDialog}
                        onClose={(urls) => {
                            setOpenDialog(false)
                            if (urls) {
                                updateState('docs', urls)
                                console.log(urls)
                            }
                        }}
                    />
                </div>
            )}
            <Address
                state={state}
                updateStateSubObject={updateStateSubObject}
            />
            {state.type_entity === 'legal-entity' && (
                <DirectContact
                    state={state}
                    updateStateSubObject={updateStateSubObject}
                />
            )}
            {state.type === 'client' && (
                <div className='col-12'>
                    <FormControl fullWidth size='small'>
                        <InputLabel id='seller' color='black'>
                            Vendedor:
                        </InputLabel>
                        <Select
                            labelId='seller'
                            label='Vendedor:'
                            size='small'
                            color='black'
                            sx={{
                                background: 'white',
                                borderRadius: 2,
                            }}
                            value={state.seller}
                            onChange={(e) =>
                                updateState('seller', e.target.value)
                            }
                        >
                            {sellers.length > 0 &&
                                sellers.map((seller) => (
                                    <MenuItem key={seller.id} value={seller.id}>
                                        {seller.name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </div>
            )}
        </form>
    )
}
export default Client
