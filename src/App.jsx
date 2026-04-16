import { useState } from 'react';
import { Button } from '@/components/PrimeReact';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app-container">
      <Header />
      <main className="app-content">
        <Button
          label={`Count is ${count}`}
          onClick={() => setCount((c) => c + 1)}
          className="p-button-primary p-button-rounded p-button-lg"
        />
      </main>
      <Footer />
    </div>
  );
}

export default App;
