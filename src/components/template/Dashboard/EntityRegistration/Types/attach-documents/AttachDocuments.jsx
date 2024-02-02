import {
    CloseRounded,
    CloudUploadRounded,
    DeleteRounded,
} from '@mui/icons-material'
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    List,
    ListItem,
    Typography,
} from '@mui/material'
import { createRef, useState } from 'react'
import useStorage from '../../../../../../hooks/useStorage'

function AttachDocuments({ open, onClose }) {
    const [filesList, setFilesList] = useState([])
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const fileInputRef = createRef()
    const { uploadFile } = useStorage()

    const handleSave = async () => {
        setUploading(true)
        if (filesList && filesList.length > 0) {
            const urls = await Promise.all(
                filesList.map((file, index) => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader()
                        reader.onloadend = async () => {
                            try {
                                const url = await uploadFile(
                                    'your/path/here',
                                    reader.result,
                                    file.name
                                )
                                resolve(url)
                                setProgress(
                                    ((index + 1) / filesList.length) * 100
                                )
                            } catch (err) {
                                reject(err)
                            }
                        }
                        reader.onerror = reject
                        reader.readAsDataURL(file)
                    })
                })
            )
            onClose(urls)
        } else {
            onClose(null)
        }
        setUploading(false)
    }

    const handleClose = () => {
        onClose() // Chame onClose sem parâmetros
    }

    return (
        <Dialog
            onClose={handleClose}
            open={open}
            maxWidth='md'
            fullWidth={true}
        >
            <DialogTitle
                id='alert-dialog-title'
                className='d-flex justify-content-between'
            >
                <Typography variant='h5'>
                    Anexar documentos do cliente
                </Typography>
                <IconButton onClick={handleClose}>
                    <CloseRounded />
                </IconButton>
            </DialogTitle>
            <Divider color='black' />
            <input
                style={{ display: 'none' }}
                type='file'
                multiple='multiple'
                onChange={(e) => {
                    if (e.target.files.length === 0) {
                        setFilesList(null)
                    } else {
                        setFilesList((prevFiles) => [
                            ...prevFiles,
                            ...Array.from(e.target.files),
                        ])
                    }
                }}
                ref={fileInputRef}
            />

            {uploading ? (
                <Box
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                    justifyContent='center'
                    className='my-3'
                >
                    <CircularProgress color='black' />
                    <Typography variant='h6'>
                        Carregando... {Math.round(progress)}%
                    </Typography>
                </Box>
            ) : filesList && filesList.length > 0 ? (
                <DialogContent className='d-flex flex-column w-100 align-items-center'>
                    <Typography variant='h6'>Arquivos selecionados:</Typography>
                    <List
                        sx={{
                            width: '100%',
                            maxWidth: '600px',
                            bgcolor: 'background.paper',
                        }}
                    >
                        {filesList.map((file, index) => (
                            <ListItem
                                key={file.name}
                                secondaryAction={
                                    <IconButton
                                        aria-label='comment'
                                        onClick={() => {
                                            const newFilesList = [...filesList]
                                            newFilesList.splice(index, 1)
                                            setFilesList(newFilesList)
                                        }}
                                    >
                                        <DeleteRounded />
                                    </IconButton>
                                }
                            >
                                {file.name}
                            </ListItem>
                        ))}
                    </List>
                    <Button
                        color='black'
                        className='px-5 rounded-0'
                        onClick={() => fileInputRef.current.click()}
                    >
                        Adicionar mais arquivos
                    </Button>
                </DialogContent>
            ) : (
                <Button
                    color='black'
                    className='px-5 rounded-0'
                    onClick={() => fileInputRef.current.click()}
                >
                    <DialogContent className='d-flex flex-column w-100 align-items-center'>
                        <CloudUploadRounded
                            color='black'
                            sx={{ fontSize: 250 }}
                        />
                        <Typography variant='h5'>
                            Carregar arquivos...
                        </Typography>
                    </DialogContent>
                </Button>
            )}
            <DialogActions className='p-3 mt-2'>
                <Button
                    color='black'
                    variant='contained'
                    onClick={handleClose}
                >
                    Cancelar
                </Button>
                <Button
                    color='black'
                    variant='contained'
                    autoFocus
                    onClick={handleSave}
                >
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default AttachDocuments
