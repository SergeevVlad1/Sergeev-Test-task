import { forwardRef } from "react";

export enum EInputTypes {
    INPUT = 'input',
    RADIO = 'radio',
    CHECKBOX = 'checkbox',
    EMAIL = 'email',
    PASSWORD = 'password',
    SUBMIT = 'submit',
    TEXT = 'text',
    COLOR = 'color',
    TEXTAREA = 'textarea',
}


export interface IInputProps {
    isChecked?: boolean,
    placeholder?: string,
    onClick?: () => void,
    type: EInputTypes,
    onDisabled?: boolean,
    className?: string;
}

export const Input = forwardRef<HTMLInputElement, IInputProps>(({ type, isChecked, placeholder, onClick, className, onDisabled, ...rest }, ref) => {
    return <input className={className} disabled={onDisabled} type={type} checked={isChecked} placeholder={placeholder} onClick={onClick} ref={ref} {...rest} />
})