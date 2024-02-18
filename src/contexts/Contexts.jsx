import { ThemeProvider } from './themeContext'
import { UserProvider } from './userContext'

function Contexts(props) {
    return (
        <ThemeProvider>
            <UserProvider>{props.children}</UserProvider>
        </ThemeProvider>
    )
}
export default Contexts
