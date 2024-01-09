import { Outlet } from 'react-router-dom'
import styled from 'styled-components'

const ContentBox = styled.div`
    background: #f0f1f4;
    border-radius: 20px;
    padding: 20px;
    grid-area: content;
    margin: 0px 10px 10px 0px;
    overflow: auto;
`

function Content() {
    return (
        <ContentBox>
            <Outlet />
        </ContentBox>
    )
}
export default Content
