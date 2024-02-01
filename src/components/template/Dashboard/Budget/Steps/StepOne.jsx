import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useFirebase from './../../../../../hooks/useFirebase'

function StepOne({ client, setClient, budgetData, setBudgetData }) {
    const { clientId } = useParams()
    const { getDocumentById } = useFirebase()

    useEffect(() => {
        getDocumentById('clients', clientId).then((data) => {
            setClient(data)
        })
    })

    return <></>
}

export default StepOne
