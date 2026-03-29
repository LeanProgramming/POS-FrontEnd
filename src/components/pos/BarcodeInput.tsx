import { useEffect, useRef, useState, type KeyboardEvent } from "react"

interface IBarcodeInputProps {
    onScan:(code:string) => void
}

export const BarcodeInput = ({onScan}:IBarcodeInputProps) => {

    const [value, setValue] = useState<string>('')

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(()=>{
        inputRef.current?.focus()
    },[])

    const handleKeyDown = (e:KeyboardEvent<HTMLInputElement>) => {
        if(e.key==='Enter') {
            const code = value.trim()

            if(code.length === 0) return

            onScan(code)
            setValue('')
        }
    }

  return (
    <div className="w-full"><input ref={inputRef} type="text" value={value} onChange={e=>setValue(e.target.value)} onKeyDown={handleKeyDown} placeholder="Escanee código de barras" className="w-full p-4 text-xl border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
  )
}
