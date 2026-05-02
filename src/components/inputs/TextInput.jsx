const TextInput = ({
    label: _label,
    type = "text",
    value = "",
    name,
    placeholder,
    onChange,
    hasError,
    className = "",
    ...inputProps
}) => {
    return (
        <div
            className={`w-full rounded-md border transition-colors ${
                hasError ? "border-red-300" : "border-gray-100 hover:border-orange-500"
            } bg-white focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-100/80`}
        >
            <input
                value={value}
                onChange={onChange}
                type={type}
                name={name}
                placeholder={placeholder}
                className={`w-full border-0 bg-transparent px-3 py-2.5 text-xs outline-none placeholder:text-xs ${className}`}
                {...inputProps}
            />
        </div>
    );
};

export default TextInput;
