import { UserProvider } from './userContext'

function Contexts(props) {
    return <UserProvider>{props.children}</UserProvider>
}
export default Contexts
