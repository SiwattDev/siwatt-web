import { createContext, useState } from 'react'

const UserContext = createContext(null)

function UserProvider(props) {
    const [user, setUser] = useState(null)

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {props.children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider }
