import { createContext, useState } from 'react'

const EntityContext = createContext(null)

function EntityProvider({ children }) {
    const [entity, setEntity] = useState({
        type: 'user',
        name: null,
        fantasy_name: null,
        email: null,
        store_facade: null,
        docs: null,
        phone: null,
        password: null,
        type_entity: null,
        cpf: null,
        cnpj: null,
        state_registration: null,
        address: {
            number: null,
            road: null,
            neighborhood: null,
            city: null,
            reference: null,
            cep: null,
            uf: null,
        },
        direct_contact: {
            name: null,
            email: null,
            phone: null,
            cpf: null,
            birth_of_date: null,
        },
        user_type: {
            type: null,
            permissions: [],
        },
        seller: null,
    })

    return (
        <EntityContext.Provider value={{ entity, setEntity }}>
            {children}
        </EntityContext.Provider>
    )
}

export { EntityContext, EntityProvider }
