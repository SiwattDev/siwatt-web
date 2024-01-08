import styled from 'styled-components'

const InputComponent = styled.input`
    border: none;
    border-radius: 7px;
    padding: 7px 12px;
    font-size: 17px;
    box-shadow: 0px 0px 8px #1d202624;
    width: 100%;
    transition: box-shadow 0.3s linear;
    outline: none;
    &:focus {
        box-shadow: 0px 0px 0px 2px;
    }
`

function Input(props) {
    return (
        <>
            <InputComponent
                type={props.type}
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}
            ></InputComponent>
        </>
    )
}

export default Input
