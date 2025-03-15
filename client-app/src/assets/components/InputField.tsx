import Select from 'react-select'
import PasswordStrengthBar from 'react-password-strength-bar';
import { useEffect, useState } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { GrClose } from 'react-icons/gr';

interface InputParameters {
    type: string,
    name: string,
    placeholder: string,
    value: any,
    handleChange?: any,
}
interface WideInputParameters extends InputParameters {
    wide: boolean,
    label: string
}
interface TypeaheadInputParameters extends WideInputParameters {
    inputParams: any,
    typeahead: boolean,
    innerRef: any
}

function WideField(props: any) {
    const [isFocused, setIsFocused] = useState(!!props.value); // Initialize state with prop value

    useEffect(() => {
        if (isFocused && document.activeElement !== document.getElementById(props.name) && props.value === "")
            setIsFocused(false)
    }, [props.value])

    const focusInput = () => {
        document.getElementById(props.name)!.focus();
    };

    const handleFieldChange = (e: any) => {
        if (props.handleChange) props.handleChange(e);
    };
    const handleFocus = (e: any) => {
        setIsFocused(true); // Update state with input value
        if (props.typeahead) props.typeaheadProps.onFocus(e);
    };
    const handleBlur = (e: any) => {
        setIsFocused((!!e.target.value)); // Update state with input value
        if (props.typeahead) props.typeaheadProps.onBlur(e);
    };

    const wideInputStyle = {
        paddingLeft: (!!props.contenttype && props.contenttype === 'search') ? "2.8rem" : "1.2rem",
        marginBottom: (!!props.contenttype && props.contenttype === 'search') ? 5 : undefined
    }
    if (props.typeahead) {
        return (
            <>
                <div className="position-relative">
                    <div onClick={focusInput} className={`wide-input-label typeahead-label position-absolute ${isFocused ? "focused" : ""}`}>{props.label}</div>
                    <input
                        {...props.typeaheadProps}
                        className="form-control wide"
                        ref={props.innerRef}
                        id={props.name}
                        style={wideInputStyle}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        value={props.value}
                        required />
                </div>
            </>
        )
    }
    else {
        return (
            <>
                <div className="mb-2 position-relative">
                    <div onClick={focusInput} className={`wide-input-label position-absolute ${isFocused ? "focused" : ""}`}>{props.label}</div>
                    {(props.type !== "textarea")
                        ? (
                            <input
                                type={props.type}
                                className="form-control wide"
                                id={props.name}
                                name={props.name}
                                value={props.value}
                                placeholder={props.placeholder}
                                onChange={handleFieldChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                style={wideInputStyle}
                                required />
                        )
                        : (
                            <textarea
                                rows={props.rows}
                                id={props.name}
                                name={props.name}
                                value={props.value}
                                className="form-control wide"
                                onChange={handleFieldChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                style={{ resize: "none", ...wideInputStyle}}
                                autoComplete={props.autocomplete}
                            ></textarea>
                        )
                    }
                </div>
            </>
        )
    }
}
function TextualField(props: any) {
    const handleFieldChange = (e: any) => {
        if (props.handleChange) props.handleChange(e);
    };

    return (
        <div className="mb-2 position-relative">
            <input
                type={props.type}
                className="form-control"
                id={props.name}
                value={props.value}
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
                    {(props.value.length > 0) &&
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
                    password={props.value} />
            }
        </div>
    )
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
            field = (props.wide)
                ? (
                    <WideField
                        type='text'
                        {...props}
                    />
                )
                : (
                    <TextualField
                        type='text'
                        {...props}
                    />
                );
            break;
        case 'textarea':
            field = (props.wide)
                ? (
                    <WideField
                        type='textarea'
                        {...props}
                    />
                )
                : (
                    <></>
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