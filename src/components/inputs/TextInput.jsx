import { useState } from "react";

const TextInput = ({label, type, value, name, placeholder, onChange, hasError}) => {

    const [isTyping, setIsTyping] = useState(false);

    const handleInput = (event) => {
        setIsTyping(event.target.value.length > 0);
    };

    return (
        <div className={`w-full relative flex flex-col gap-1 border ${hasError ? 'border-red-300' : 'border-gray-200' } rounded-md bg-white hover:border-orange-500`}>
            <label className={`text-[11px] absolute left-3 px-1 bg-white transition-all duration-200 ${isTyping ? "opacity-100 -top-2.5 scale-100" : "opacity-0 top-2 scale-90"}`}>
                {label}
            </label>

            <input 
            value={value}
            onInput={handleInput} 
            onChange={onChange}
            type={type} 
            name={name} 
            placeholder={placeholder} 
            className="w-full border-0 outline-none bg-transparent py-2.5 px-3 text-[10px] placeholder:text-[10px"/>
        </div>
    )
}

export default TextInput;