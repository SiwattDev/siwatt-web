import { AddRounded } from '@mui/icons-material'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    TextField,
    Tooltip,
} from '@mui/material'

function Branchs() {
    return (
        <>
            <Dialog open={true} onClose={() => {}} fullWidth maxWidth='sm'>
                <DialogTitle>Nova Filial</DialogTitle>
                <DialogContent>
                    <TextField size='small' label='Nome da Filial'></TextField>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant='contained'
                        color='black'
                        size='small'
                        onClick={() => {}}
                    >
                        Cadastrar
                    </Button>
                </DialogActions>
            </Dialog>
            <Tooltip title='Nova Filial'>
                <Fab
                    color='black'
                    aria-label='add'
                    className='position-fixed bottom-0 end-0 m-4'
                    onClick={() => {}}
                >
                    <AddRounded />
                </Fab>
            </Tooltip>
        </>
    )
}
export default Branchs
