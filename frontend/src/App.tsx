import { useState, FormEvent } from 'react';
import './App.css'; // Keep if you have custom styles alongside Tailwind

// Define the expected API response structure
interface EchoResponse {
  echo: string;
}

function App() {
  const [message, setMessage] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponse('');

    // Define backend URL (replace with your deployed URL or env variable in production)
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

    try {
      const res = await fetch(`${backendUrl}/api/echo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: EchoResponse = await res.json();
      setResponse(data.echo);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-cyan-400">Echo App</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
            Enter message:
          </label>
          <input
            type="text"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white disabled:opacity-50"
            placeholder="Type something..."
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-75 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Sending...' : 'Send to Backend'}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-800 border border-red-600 text-red-100 rounded-md w-full max-w-md">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {response && (
        <div className="mt-6 p-4 bg-gray-700 border border-gray-600 rounded-md w-full max-w-md">
          <p className="font-semibold text-cyan-400">Backend Echo:</p>
          <p className="mt-1 break-words">{response}</p>
        </div>
      )}
    </div>
  );
}

export default App;
