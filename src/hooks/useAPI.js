import axios from 'axios'

function useAPI() {
    const APICNPJ = (cnpj) => {
        return new Promise((resolve, reject) => {
            axios
                .get(`https://publica.cnpj.ws/cnpj/${cnpj}`)
                .then((resp) => resolve(resp))
                .catch((err) => reject(err))
        })
    }

    const APICep = (cep) => {
        return new Promise((resolve, reject) => {
            axios
                .get(`https://viacep.com.br/ws/${cep}/json/`)
                .then((resp) => resolve(resp))
                .catch((err) => reject(err))
        })
    }

    return { APICNPJ, APICep }
}
export default useAPI
