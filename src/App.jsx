import { useState } from 'react';
import { Button } from './components/PrimeReact';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-column align-items-center justify-content-center h-screen">
      <h1>가계부 프로그램</h1>
      <Button 
        label={`Count is ${count}`} 
        onClick={() => setCount((c) => c + 1)} 
        className="p-button-primary p-button-rounded p-button-lg" 
      />
    </div>
  );
}

export default App;
