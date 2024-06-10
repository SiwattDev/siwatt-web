import { BudgetProvider } from './budgetContext'
import { EntityProvider } from './entityContext'
import { ThemeProvider } from './themeContext'
import { UserProvider } from './userContext'

function Contexts(props) {
    return (
        <ThemeProvider>
            <UserProvider>
                <EntityProvider>
                    <BudgetProvider>{props.children}</BudgetProvider>
                </EntityProvider>
            </UserProvider>
        </ThemeProvider>
    )
}
export default Contexts
