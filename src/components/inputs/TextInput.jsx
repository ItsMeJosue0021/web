import { useState } from "react";

const TextInput = ({label, type, name, placeholder, onChange}) => {

    const [isTyping, setIsTyping] = useState(false);

    const handleInput = (event) => {
        setIsTyping(event.target.value.length > 0);
    };

    return (
        <div className="w-full relative flex flex-col gap-1 border border-gray-200 rounded-md bg-white hover:border-orange-500">
            <label className={`text-xs absolute left-3 px-1 bg-white transition-all duration-200 ${isTyping ? "opacity-100 -top-2.5 scale-100" : "opacity-0 top-2 scale-90"}`}>
                {label}
            </label>

            <input 
            onInput={handleInput} 
            onChange={onChange}
            type={type} 
            name={name} 
            placeholder={placeholder} 
            className="w-full border-0 outline-none bg-transparent py-2.5 px-3 text-sm placeholder:text-xs"/>
        </div>
    )
}

export default TextInput;