import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker'
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo'
import dayjs from 'dayjs'
import { useContext, useEffect, useState } from 'react'
import { BudgetContext } from '../../../../../contexts/budgetContext'

function addThreeDays() {
    let today = new Date()
    today.setDate(today.getDate() + 3)
    return today.toISOString().split('T')[0]
}

function StepValidation() {
    const { budget, setBudget } = useContext(BudgetContext)
    const [selectedDate, setSelectedDate] = useState(dayjs(addThreeDays()))

    const handleDateChange = (date) => {
        setSelectedDate(date)
        setBudget({ ...budget, validity: date.format('YYYY-MM-DD') })
        console.log(date.format('YYYY-MM-DD'))
    }

    useEffect(() => {
        handleDateChange(selectedDate)
    }, [selectedDate])

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['StaticDatePicker']}>
                <DemoItem label='Validade do orçamento'>
                    <StaticDatePicker
                        value={selectedDate}
                        onChange={handleDateChange}
                    />
                </DemoItem>
            </DemoContainer>
        </LocalizationProvider>
    )
}

export default StepValidation
