import styled from 'styled-components'

const ChartContainer = styled.div`
    display: flex;
    width: 100%;
    height: 200px;
    align-items: flex-end;
    margin: 50px 0px 0px 0px;
    box-sizing: border-box;
`

const BarGroup = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    align-items: flex-end;
    justify-content: center;
    padding: 0px 2%;
`

const BarContainer = styled.div`
    height: 100%;
    width: 100%;
    margin-bottom: 5px;
    position: relative;
`

const BarLabel = styled.div`
    width: 100%;
    position: absolute;
    bottom: -20px;
    text-align: center;
    font-size: 1rem;

    @media screen and (max-width: 600px) {
        white-space: nowrap;
        transform: rotate(-45deg);
        bottom: -30px;
        font-size: 0.8rem;
    }
`

const BarValue = styled.div`
    width: 100%;
    position: absolute;
    text-align: center;
    top: -25px;
    transform: scale(1.3);
    font-size: 0.8rem;
    font-weight: bold;

    @media screen and (max-width: 600px) {
        font-size: 0.6rem;
        transform: scale(1.4);
        top: -25px;
    }
`

const ChartTable = styled.table`
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    @media screen and (max-width: 600px) {
        font-size: 0.7rem;
    }
`

const ThData = styled.th`
    border: 1px solid black;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
`
const TdData = styled.td`
    border: 1px solid black;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    background: white;
`

const EmptyCell = styled.td`
    border: none;
`

function BarsCharts({ data, valueType }) {
    const maxValue = Math.max(
        ...data.flatMap((dataset) => dataset.data.map((item) => item.value))
    )

    const renderBars = () => {
        return data[0].data.map((item, index) => {
            return (
                <BarGroup key={index}>
                    {data.map((dataset) => (
                        <BarContainer
                            key={dataset.title}
                            style={{
                                height: `${
                                    (dataset.data[index].value / maxValue) * 100
                                }%`,
                                background: dataset.color,
                            }}
                        >
                            {!data[1] && (
                                <BarValue>
                                    {formatValue(
                                        dataset.data[index].value,
                                        valueType
                                    )}
                                </BarValue>
                            )}
                            {!data[1] && <BarLabel>{item.label}</BarLabel>}
                        </BarContainer>
                    ))}
                </BarGroup>
            )
        })
    }

    const formatValue = (value, type) => {
        const formattedValue = new Intl.NumberFormat('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value)

        switch (type) {
            case 'money':
                return `R$ ${formattedValue}`
            case 'kwp':
                return `${formattedValue} KWp`
            default:
                return formattedValue
        }
    }

    const getFontColor = (bgColor) => {
        const color =
            bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor
        const r = parseInt(color.substring(0, 2), 16)
        const g = parseInt(color.substring(2, 4), 16)
        const b = parseInt(color.substring(4, 6), 16)
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
        return luminance > 0.5 ? 'black' : 'white'
    }

    return (
        <>
            <ChartContainer>
                {data[1] && <BarGroup />}
                {renderBars()}
            </ChartContainer>
            {data[1] && (
                <ChartTable>
                    <thead>
                        <tr>
                            <EmptyCell />
                            {data[0].data.map((item, index) => (
                                <TdData key={index}>{item.label}</TdData>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((dataset) => (
                            <tr key={dataset.title}>
                                <ThData
                                    style={{
                                        backgroundColor: dataset.color,
                                        color: getFontColor(dataset.color),
                                    }}
                                >
                                    {dataset.title}
                                </ThData>
                                {dataset.data.map((item, index) => (
                                    <TdData key={index}>{item.value}</TdData>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </ChartTable>
            )}
        </>
    )
}

export default BarsCharts
