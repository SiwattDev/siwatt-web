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

    return { generateCode, showToastMessage }
}

export default useUtilities
