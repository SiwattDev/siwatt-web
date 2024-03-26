import { BudgetProvider } from './budgetContext'
import { ThemeProvider } from './themeContext'
import { UserProvider } from './userContext'

function Contexts(props) {
    return (
        <ThemeProvider>
            <UserProvider>
                <BudgetProvider>{props.children}</BudgetProvider>
            </UserProvider>
        </ThemeProvider>
    )
}
export default Contexts
