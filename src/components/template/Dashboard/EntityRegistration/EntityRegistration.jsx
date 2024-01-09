import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material'

function EntityRegistration() {
    return (
        <div>
            <h1>Cadastro de Entidade</h1>
            <FormControl fullWidth>
                <InputLabel
                    id='type-registration'
                    color='black'
                >
                    Tipo de cadastro:
                </InputLabel>
                <Select
                    labelId='type-registration'
                    label='Tipo de cadastro: '
                    size='small'
                    color='black'
                    sx={{ background: 'white', borderRadius: 2 }}
                >
                    <MenuItem value=''>Usuário</MenuItem>
                    <MenuItem value=''>Cliente</MenuItem>
                    <MenuItem value=''>Fornecedor</MenuItem>
                    <MenuItem value=''>Parceiro</MenuItem>
                </Select>
            </FormControl>
            <TextField
                label='Razão social: '
                variant='outlined'
                size='small'
                color='black'
                sx={{ background: 'white', borderRadius: 2 }}
            />
            <TextField
                label='Nome fantasia: '
                variant='outlined'
                size='small'
                color='black'
                sx={{ background: 'white', borderRadius: 2 }}
            />
            <TextField
                label='E-mail: '
                variant='outlined'
                size='small'
                color='black'
                sx={{ background: 'white', borderRadius: 2 }}
            />
            <TextField
                label='Telefone: '
                variant='outlined'
                size='small'
                color='black'
                sx={{ background: 'white', borderRadius: 2 }}
            />
            <FormControl fullWidth>
                <InputLabel
                    id='type-entity'
                    color='black'
                >
                    Tipo de pessoa:
                </InputLabel>
                <Select
                    labelId='type-entity'
                    label='Tipo de pessoa: '
                    size='small'
                    color='black'
                    sx={{ background: 'white', borderRadius: 2 }}
                >
                    <MenuItem value=''>Física</MenuItem>
                    <MenuItem value=''>Jurídica</MenuItem>
                </Select>
            </FormControl>
            <TextField
                label='CPF: '
                variant='outlined'
                size='small'
                color='black'
                sx={{ background: 'white', borderRadius: 2 }}
            />
            <TextField
                label='CNPJ: '
                variant='outlined'
                size='small'
                color='black'
                sx={{ background: 'white', borderRadius: 2 }}
            />
            <TextField
                label='Inscrição estadual: '
                variant='outlined'
                size='small'
                color='black'
                sx={{ background: 'white', borderRadius: 2 }}
            />
            <TextField
                label='Número: '
                variant='outlined'
                size='small'
                color='black'
                sx={{ background: 'white', borderRadius: 2 }}
            />
            <TextField
                label='Bairro: '
                variant='outlined'
                size='small'
                color='black'
                sx={{ background: 'white', borderRadius: 2 }}
            />
            <TextField
                label='Cidade: '
                variant='outlined'
                size='small'
                color='black'
                sx={{ background: 'white', borderRadius: 2 }}
            />
            <TextField
                label='Referência: '
                variant='outlined'
                size='small'
                color='black'
                sx={{ background: 'white', borderRadius: 2 }}
            />
            <TextField
                label='Endereço: '
                variant='outlined'
                size='small'
                color='black'
                sx={{ background: 'white', borderRadius: 2 }}
            />
            <TextField
                label='Cep: '
                variant='outlined'
                size='small'
                color='black'
                sx={{ background: 'white', borderRadius: 2 }}
            />
            <TextField
                label='UF: '
                variant='outlined'
                size='small'
                color='black'
                sx={{ background: 'white', borderRadius: 2 }}
            />
            <div>
                <Typography variant='h6'>Contato direto: </Typography>
                <TextField
                    label='Nome: '
                    variant='outlined'
                    size='small'
                    color='black'
                    sx={{ background: 'white', borderRadius: 2 }}
                />
                <TextField
                    label='Email: '
                    variant='outlined'
                    size='small'
                    color='black'
                    sx={{ background: 'white', borderRadius: 2 }}
                />
                <TextField
                    label='Telefone: '
                    variant='outlined'
                    size='small'
                    color='black'
                    sx={{ background: 'white', borderRadius: 2 }}
                />
            </div>
            <FormControl fullWidth>
                <InputLabel
                    id='seller'
                    color='black'
                >
                    Vendedor:
                </InputLabel>
                <Select
                    labelId='seller'
                    label='Vendedor: '
                    size='small'
                    color='black'
                    sx={{ background: 'white', borderRadius: 2 }}
                >
                    <MenuItem value=''>Gilvan</MenuItem>
                    <MenuItem value=''>Vanortton</MenuItem>
                    <MenuItem value=''>Pessoa</MenuItem>
                </Select>
            </FormControl>
        </div>
    )
}

export default EntityRegistration
