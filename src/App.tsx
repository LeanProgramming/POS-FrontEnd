import './App.css'
import { BarcodeInput } from './components/pos/BarcodeInput';
import { Router } from './router/router'

function App() {

  // return <Router />
  const handleScan = (code: string) => {
    console.log("Escaneado:", code);
  };

  return (
    <div className="p-4">
      <BarcodeInput onScan={handleScan} />
    </div>
  );
  
}

export default App
