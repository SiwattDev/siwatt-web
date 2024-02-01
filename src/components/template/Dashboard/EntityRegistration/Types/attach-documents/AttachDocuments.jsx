import { CloseRounded, CloudUploadRounded } from '@mui/icons-material'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Typography,
} from '@mui/material'
import { useState } from 'react'

function AttachDocuments({ open, onClose }) {
    const [linksList, setLinksList] = useState([])

    const handleClose = () => {}

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
                <IconButton>
                    <CloseRounded />
                </IconButton>
            </DialogTitle>
            <Divider color='black' />
            <DialogContent className='d-flex flex-column w-100 align-items-center'>
                <CloudUploadRounded
                    color='black'
                    sx={{ fontSize: 250 }}
                />
                <Typography variant='h4'>Carregar arquivos...</Typography>
            </DialogContent>
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
                    onClick={handleClose}
                >
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default AttachDocuments
