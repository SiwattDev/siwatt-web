import styled from 'styled-components'

const Label = styled.p`
    margin: 0px 0px 3px 0px;
    font-weight: bold;
`

const InputComponent = styled.input`
    border: none;
    border-radius: 7px;
    padding: 7px 12px;
    font-size: 17px;
    box-shadow: 0px 0px 5px #1d202630;
    width: 100%;
    transition: box-shadow 0.3s linear;
    outline: none;
    &:focus {
        box-shadow: 0px 0px 0px 2px;
    }
`

function Input(props) {
    return (
        <div
            className={props.className}
            style={props.divStyle}
        >
            {props.label && <Label>{props.label}</Label>}
            <InputComponent
                type={props.type}
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}
                style={props.style}
            ></InputComponent>
        </div>
    )
}

export default Input
