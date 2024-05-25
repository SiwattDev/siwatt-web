import {
    LockClockRounded,
    LockOpenRounded,
    LockRounded,
    NoEncryptionRounded,
} from '@mui/icons-material'
import { Alert, Grid, Paper, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import useFirebase from './../../../../../hooks/useFirebase'

function BySeller() {
    const { getDocumentsInCollection } = useFirebase()
    const [users, setUsers] = useState([])
    const [budgets, setBudgets] = useState([])
    const [sellerBudgetMap, setSellerBudgetMap] = useState()

    const sellerBudgets = (budgetsData = budgets, usersData = users) => {
        console.log(budgetsData)
        console.log(usersData)
        let sellerBudgetMap = {}
        let sellers = usersData.filter((user) => user.user_type === 'seller')
        console.log(sellers)

        sellers.forEach((seller) => {
            let sellerBudgets = budgetsData.filter(
                (budget) => budget.client.seller.id === seller.id
            )

            console.log(sellerBudgets)

            let budgetCounts = {
                open: 0,
                inProgress: 0,
                closing: 0,
                cancelled: 0,
            }

            sellerBudgets.forEach((budget) => {
                switch (budget.status) {
                    case 'opened':
                        budgetCounts.open++
                        break
                    case 'in-progress':
                        budgetCounts.inProgress++
                        break
                    case 'closed':
                        budgetCounts.closing++
                        break
                    case 'cancelled':
                        budgetCounts.cancelled++
                        break
                    default:
                        break
                }
            })

            sellerBudgetMap[seller.id] = {
                budgetCounts,
                ...seller,
            }
        })

        console.log(sellerBudgetMap)

        return sellerBudgetMap
    }

    useEffect(() => {
        Promise.all([
            getDocumentsInCollection('users'),
            getDocumentsInCollection('budgets'),
        ]).then(([users, budgets]) => {
            setUsers(users)
            setBudgets(budgets)
            setSellerBudgetMap(sellerBudgets(budgets, users))
        })
    }, [])

    useEffect(() => {
        console.log(sellerBudgetMap)
    }, [sellerBudgetMap])

    return (
        <>
            <Grid container spacing={2}>
                {sellerBudgetMap &&
                    Object.keys(sellerBudgetMap).map((key) => (
                        <Grid item xs={12} sm={6} lg={4} key={key}>
                            <Paper style={{ margin: '10px', padding: '10px' }}>
                                <Typography variant='h5'>{`Vendedor: ${sellerBudgetMap[key].name}`}</Typography>
                                <Alert
                                    sx={{
                                        '& .MuiAlert-icon': {
                                            marginRight: 0,
                                            padding: 0,
                                        },
                                        '& .MuiAlert-message': {
                                            padding: '5px 0',
                                        },
                                    }}
                                    icon={
                                        <LockOpenRounded
                                            className='me-1'
                                            fontSize='small'
                                        />
                                    }
                                    severity='warning'
                                    className='py-0 px-2 d-flex align-items-center mt-2'
                                >
                                    <Typography variant='body1'>{`Orçamentos abertos: ${sellerBudgetMap[key].budgetCounts.open}`}</Typography>
                                </Alert>
                                <Alert
                                    sx={{
                                        '& .MuiAlert-icon': {
                                            marginRight: 0,
                                            padding: 0,
                                        },
                                        '& .MuiAlert-message': {
                                            padding: '5px 0',
                                        },
                                    }}
                                    icon={
                                        <LockClockRounded
                                            className='me-1'
                                            fontSize='small'
                                        />
                                    }
                                    severity='success'
                                    className='py-0 px-2 d-flex align-items-center mt-2'
                                >
                                    <Typography variant='body1'>{`Orçamentos em andamento: ${sellerBudgetMap[key].budgetCounts.inProgress}`}</Typography>
                                </Alert>
                                <Alert
                                    sx={{
                                        '& .MuiAlert-icon': {
                                            marginRight: 0,
                                            padding: 0,
                                        },
                                        '& .MuiAlert-message': {
                                            padding: '5px 0',
                                        },
                                    }}
                                    icon={
                                        <LockRounded
                                            className='me-1'
                                            fontSize='small'
                                        />
                                    }
                                    severity='primary'
                                    className='py-0 px-2 d-flex align-items-center mt-2'
                                >
                                    <Typography variant='body1'>{`Orçamentos fechando: ${sellerBudgetMap[key].budgetCounts.closing}`}</Typography>
                                </Alert>
                                <Alert
                                    sx={{
                                        '& .MuiAlert-icon': {
                                            marginRight: 0,
                                            padding: 0,
                                        },
                                        '& .MuiAlert-message': {
                                            padding: '5px 0',
                                        },
                                    }}
                                    icon={
                                        <NoEncryptionRounded
                                            className='me-1'
                                            fontSize='small'
                                        />
                                    }
                                    severity='error'
                                    className='py-0 px-2 d-flex align-items-center mt-2'
                                >
                                    <Typography variant='body1'>{`Orçamentos cancelados: ${sellerBudgetMap[key].budgetCounts.cancelled}`}</Typography>
                                </Alert>
                            </Paper>
                        </Grid>
                    ))}
            </Grid>
        </>
    )
}

export default BySeller
