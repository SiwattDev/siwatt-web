import BarsCharts from '../../../template/Global/BarChats'

function Panel() {
    let payback = {
        title: 'Payback',
        color: 'black',
        data: [
            { label: '5 anos', value: 57944.71 },
            { label: '10 anos', value: 579447.15 },
            { label: '15 anos', value: 869170.72 },
            { label: '20 anos', value: 1158894.3 },
            { label: '25 anos', value: 1448617.87 },
        ],
    }

    // let geracaoData = {
    //     title: 'geracao',
    //     color: '#FDC611',
    //     data: [
    //         { label: 'Jan', value: 4765 },
    //         { label: 'Fev', value: 4712 },
    //         { label: 'Mar', value: 4255 },
    //         { label: 'Abr', value: 3731 },
    //         { label: 'Mai', value: 3218 },
    //         { label: 'Jun', value: 2912 },
    //         { label: 'Jul', value: 3074 },
    //         { label: 'Ago', value: 3537 },
    //         { label: 'Set', value: 4281 },
    //         { label: 'Out', value: 4404 },
    //         { label: 'Nov', value: 4231 },
    //         { label: 'Dez', value: 4768 },
    //     ],
    // }

    // let casaData = {
    //     title: 'casa',
    //     color: '#0656B4',
    //     data: [
    //         { label: 'Jan', value: 3824 },
    //         { label: 'Fev', value: 3167 },
    //         { label: 'Mar', value: 3965 },
    //         { label: 'Abr', value: 3301 },
    //         { label: 'Mai', value: 3582 },
    //         { label: 'Jun', value: 4019 },
    //         { label: 'Jul', value: 3891 },
    //         { label: 'Ago', value: 2975 },
    //         { label: 'Set', value: 3076 },
    //         { label: 'Out', value: 3956 },
    //         { label: 'Nov', value: 3456 },
    //         { label: 'Dez', value: 4098 },
    //     ],
    // }

    // let apartamentoData = {
    //     title: 'apartamento',
    //     color: '#FF6347',
    //     data: [
    //         { label: 'Jan', value: Math.floor(Math.random() * 5001) + 3000 },
    //         { label: 'Fev', value: Math.floor(Math.random() * 5001) + 3000 },
    //         { label: 'Mar', value: Math.floor(Math.random() * 5001) + 3000 },
    //         { label: 'Abr', value: Math.floor(Math.random() * 5001) + 3000 },
    //         { label: 'Mai', value: Math.floor(Math.random() * 5001) + 3000 },
    //         { label: 'Jun', value: Math.floor(Math.random() * 5001) + 3000 },
    //         { label: 'Jul', value: Math.floor(Math.random() * 5001) + 3000 },
    //         { label: 'Ago', value: Math.floor(Math.random() * 5001) + 3000 },
    //         { label: 'Set', value: Math.floor(Math.random() * 5001) + 3000 },
    //         { label: 'Out', value: Math.floor(Math.random() * 5001) + 3000 },
    //         { label: 'Nov', value: Math.floor(Math.random() * 5001) + 3000 },
    //         { label: 'Dez', value: Math.floor(Math.random() * 5001) + 3000 },
    //     ],
    // }

    // let escritorioData = {
    //     title: 'escritorio',
    //     color: '#32CD32',
    //     data: [
    //         { label: 'Jan', value: Math.floor(Math.random() * 5001) + 3000 },
    //         { label: 'Fev', value: Math.floor(Math.random() * 5001) + 3000 },
    //         { label: 'Mar', value: Math.floor(Math.random() * 5001) + 3000 },
    //         { label: 'Abr', value: Math.floor(Math.random() * 5001) + 3000 },
    //         { label: 'Mai', value: Math.floor(Math.random() * 5001) + 3000 },
    //         { label: 'Jun', value: Math.floor(Math.random() * 5001) + 3000 },
    //         { label: 'Jul', value: Math.floor(Math.random() * 5001) + 3000 },
    //         { label: 'Ago', value: Math.floor(Math.random() * 5001) + 3000 },
    //         { label: 'Set', value: Math.floor(Math.random() * 5001) + 3000 },
    //         { label: 'Out', value: Math.floor(Math.random() * 5001) + 3000 },
    //         { label: 'Nov', value: Math.floor(Math.random() * 5001) + 3000 },
    //         { label: 'Dez', value: Math.floor(Math.random() * 5001) + 3000 },
    //     ],
    // }

    return (
        <>
            <h1>Painel</h1>
            <BarsCharts data={[payback]} valueType='money' />
        </>
    )
}
export default Panel
