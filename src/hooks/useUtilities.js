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

    const replaceEntityType = (type) => {
        switch (type) {
            case 'user':
                return 'Usuário'
            case 'client':
                return 'Cliente'
            case 'supplier':
                return 'Fornecedor'
            case 'partner':
                return 'Parceiros'
            default:
                return 'Unknown'
        }
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

    const replaceEntityProperties = (property) => {
        switch (property.toLowerCase()) {
            case 'id':
                return 'ID'
            case 'name':
                return 'Nome'
            case 'email':
                return 'E-mail'
            case 'phone':
                return 'Telefone'
            case 'user_type':
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
            case 'model':
                return 'Modelo'
            case 'description':
                return 'Descrição'
            case 'manufacturer':
                return 'Fabricante'
            case 'unit':
                return 'Medida'
            case 'supplier':
                return 'Fornecedor'
            case 'power':
                return 'Potência'
            case 'barcode':
                return 'Código de Barrar'
            case 'purchase_price':
                return 'Preço de Compra'
            case 'sale_price':
                return 'Preço de Venda'

            default:
                return 'Unknown'
        }
    }

    const replaceBudgetStatus = (status) => {
        switch (status) {
            case 'opened':
                return 'Em aberto'
            case 'in-progress':
                return 'Em andamento'
            case 'closed':
                return 'Fechado'
            case 'canceled':
                return 'Cancelado'
            default:
                return 'Unknown'
        }
    }

    const replaceVisitProgress = (progress) => {
        switch (progress) {
            case 'pending':
                return 'Pendente'
            case 'budget-generated':
                return 'Orçamento Gerado'
            case 'achieved':
                return 'Concretizado'
            case 'no-requirement':
                return 'Sem Requisito'
            default:
                return 'Unknown'
        }
    }

    function getWindowSizes() {
        var width =
            window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth
        var height =
            window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight
        return {
            width: width,
            height: height,
        }
    }

    function getPeriodOfDay(date) {
        const hour = date.getHours()
        if (hour < 6) return 'Madrugada'
        else if (hour < 12) return 'Manhã'
        else if (hour < 18) return 'Tarde'
        else return 'Noite'
    }

    function getDayOfWeek(date) {
        const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
        return daysOfWeek[date.getDay()]
    }

    return {
        generateCode,
        showToastMessage,
        replaceEntityType,
        replaceUserType,
        replaceEntityProperties,
        replaceBudgetStatus,
        replaceVisitProgress,
        getWindowSizes,
        getPeriodOfDay,
        getDayOfWeek,
    }
}

export default useUtilities
