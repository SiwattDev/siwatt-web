import { toast } from 'react-toastify'

function useUtilities() {
    const generateCode = () => {
        const length = 15
        let result = ''
        const characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        const charactersLength = characters.length
        for (let i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            )
        }
        return result
    }

    const showToastMessage = (type, title, text = '') => {
        toast(title, {
            title,
            text,
            type,
            position: toast.POSITION.BOTTOM_LEFT,
            className: 'toast-message',
        })
    }

    const replaceUserType = (type) => {
        switch (type) {
            case 'administrative':
                return 'Administrativo'
            case 'financial':
                return 'Financeiro'
            case 'manager':
                return 'Gerente'
            case 'support':
                return 'Suporte'
            default:
                return 'Unknown'
        }
    }

    const replaceUserProperties = (property) => {
        switch (property.toLowerCase()) {
            case 'id':
                return 'ID'
            case 'name':
                return 'Nome'
            case 'email':
                return 'E-mail'
            case 'phone':
                return 'Telefone'
            case 'type':
                return 'Tipo'
            case 'uf':
                return 'UF'
            case 'city':
                return 'Cidade'
            case 'neighborhood':
                return 'Bairro'
            case 'cep':
                return 'Cep'
            case 'road':
                return 'Rua'
            case 'number':
                return 'Número'
            case 'reference':
                return 'Referência'
            default:
                return 'Unknown'
        }
    }

    const addressProperties = (property) => {
        const addressProps = [
            'uf',
            'city',
            'neighborhood',
            'cep',
            'road',
            'number',
            'reference',
        ]
        if (addressProps.includes(property)) return true
        return false
    }

    return {
        generateCode,
        showToastMessage,
        replaceUserType,
        replaceUserProperties,
        addressProperties,
    }
}

export default useUtilities
