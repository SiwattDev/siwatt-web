import { Box, Paper } from '@mui/material'

function BudgetResult() {
    // const budget = {
    //     client: {
    //         name: 'Minha Empresa LTDA',
    //         cnpj: '12.456.789/1011-12',
    //         phone: '(12) 34567-8910',
    //     },
    //     generation: {
    //         plantSize: 12,
    //     },
    // }

    return (
        <Box>
            <Paper
                className='p-0 m-auto position-relative'
                sx={{ maxWidth: '415px' }}
            ></Paper>
        </Box>
    )
}
export default BudgetResult
