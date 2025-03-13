import Select from 'react-select'
import PasswordStrengthBar from 'react-password-strength-bar';
import { useEffect, useRef, useState } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { GrClose } from 'react-icons/gr';
import { motion } from "framer-motion";

function TextualField(props: any) {
    const [fieldValue, setFieldValue] = useState(props.value); // Initialize state with prop value
    const [isFocused, setIsFocused] = useState(false); // Initialize state with prop value
    const inputElement = useRef<any>();

    useEffect(() => {
        if (isFocused && document.activeElement !== inputElement.current && props.value === "") 
            setIsFocused(false)
    }, [props.value])

    const focusInput = () => {
        inputElement.current.focus();
    };

    const handleFieldChange = (e: any) => {
        setFieldValue(e.target.value); // Update state with input value
        props.handleChange(e);
    };
    const handleFocus = (e: any) => {
        setIsFocused(true); // Update state with input value
    };
    const handleBlur = (e: any) => {
        setIsFocused((!!e.target.value)); // Update state with input value
    };

    const wideInputStyle = {
        paddingLeft: (!!props.contenttype && props.contenttype === 'search') ? "2.8rem" : "1.2rem",
        marginBottom: (!!props.contenttype && props.contenttype === 'search') ? 5 : undefined
    }

    if (props.wide) {
        return (
            <>
                <div className="mb-2 position-relative">
                    <div onClick={focusInput} className={`wide-input-label position-absolute ${isFocused ? "focused" : ""}`}>{props.label}</div>
                    <input
                        type={props.type}
                        ref={inputElement}
                        className="form-control wide"
                        id={props.name}
                        value={props.value}
                        placeholder={props.placeholder}
                        name={props.name}
                        onChange={handleFieldChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        style={wideInputStyle}
                        required />
                </div>
            </>
        )
    }
    else {
        return (
            <div className="mb-2 position-relative">
                <input
                    type={props.type}
                    className="form-control"
                    id={props.name}
                    value={fieldValue}
                    placeholder={props.placeholder}
                    name={props.name}
                    onChange={handleFieldChange}
                    style={(!!props.contenttype && props.contenttype === 'search') ? { paddingLeft: "2.8rem", marginBottom: 5 } : {}}
                    required />
                {(!!props.contenttype && props.contenttype === 'search') &&
                    <>
                        <FaMagnifyingGlass
                            style={{
                                color: "var(--search-input-icon)",
                                position: 'absolute',
                                top: "1.1rem",
                                left: 17,
                                fontSize: 18

                            }}
                        />
                        {(fieldValue.length > 0) &&
                            <div style={{
                                color: "var(--inverse-text-color)",
                                position: 'absolute',
                                top: "1.1rem",
                                right: 17,
                                height: 16,
                                width: 16,
                                background: "var(--search-input-icon)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 20,
                                cursor: "pointer"
                            }}
                                onClick={() => handleFieldChange({ target: { name: 'search', value: '' } })}>
                                <GrClose style={{ height: 10, width: 10 }} />
                            </div>
                        }
                    </>
                }
                <div className="invalid-feedback">Please fill out this field.</div>
                {(props.type === 'password' && props.isRegistering === 'true') &&
                    <PasswordStrengthBar
                        className='password-strength-bar'
                        minLength={8}
                        scoreWords={['Weak', 'Weak', 'Okay', 'Good', 'Strong']}
                        shortScoreWord='Too short'
                        password={fieldValue} />
                }
            </div>
        )
    }
}
function SelectField(props: any) {
    const [fieldValue, setFieldValue] = useState(props.value); // Initialize state with prop value

    const handleFieldChange = (selectedOption: any) => {
        var e = {
            target: {
                name: props.name,
                value: selectedOption.value
            }
        };
        props.handleChange(e);
        setFieldValue(selectedOption.value); // Update state with input value
    };

    const style = {
        control: (base: any) => ({
            ...base,
            border: 0,
            // This line disable the blue border
            boxShadow: "none"
        })
    };
    return (
        <div className="mb-2">
            <Select
                className="form-control"
                name={props.name}
                value={props.options.find((option: any) => option.value === fieldValue)}
                placeholder={props.placeholder}
                onChange={handleFieldChange}
                options={props.options}
                styles={style} />
        </div>
    )
}

export default function InputField(props: any) {
    let field;
    switch (props.type) {
        case 'text':
            field = (
                <TextualField
                    type='text'
                    {...props}
                />
            );
            break;
        case 'password':
            field = (
                <TextualField
                    type='password'
                    name={props.name}
                    value={props.value}
                    placeholder={props.placeholder}
                    handleChange={props.handleChange}
                    isRegistering={props.isRegistering}
                />
            );
            break;
        case 'email':
            field = (
                <TextualField
                    type='email'
                    name={props.name}
                    value={props.value}
                    placeholder={props.placeholder}
                    handleChange={props.handleChange}
                    isRegistering={props.isRegistering}
                />
            );
            break;
        case 'select':
            field = (
                <SelectField
                    name={props.name}
                    value={props.value}
                    placeholder={props.placeholder}
                    handleChange={props.handleChange}
                    options={props.options}
                    isRegistering={props.isRegistering}
                    isAddress={false} />
            );
            break;
        case 'address':
            field = (
                <SelectField
                    name={props.name}
                    value={props.value}
                    placeholder={props.placeholder}
                    handleChange={props.handleChange}
                    isRegistering={props.isRegistering}
                    isAddress={true} />
            );
            break;
        case 'search':
            field = (
                <TextualField
                    type='text'
                    contenttype='search'
                    name={props.name}
                    value={props.value}
                    placeholder={props.placeholder}
                    handleChange={props.handleChange}
                    isRegistering={props.isRegistering}
                />
            );
            break;
        default:
            field = '';
    }
    return (
        <>
            <>{field}</>
            {props.showGuide === 'true' &&
                <div className='input-guide mb-2'>Why do we ask for it?</div>
            }
        </>
    )
}