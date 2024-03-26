import { createContext, useState } from 'react'

const BudgetContext = createContext(null)

function BudgetProvider({ children }) {
    const [budget, setBudget] = useState()

    return (
        <BudgetContext.Provider value={{ budget, setBudget }}>
            {children}
        </BudgetContext.Provider>
    )
}
export { BudgetContext, BudgetProvider }
