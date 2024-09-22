"use client";
import { useState } from "react";

// Input Component
const InputField = ({ input, setInput }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Input Data (JSON Format)
    </label>
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder='{"data": ["A","1","C"]}'
      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
    />
  </div>
);

// Filter Component
const FilterSelect = ({ filters, setFilters }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Filter Response
    </label>
    <select
      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
      multiple
      value={filters}
      onChange={(e) =>
        setFilters([...e.target.selectedOptions].map((o) => o.value))
      }
    >
      <option value="Numbers">Numbers</option>
      <option value="Alphabets">Alphabets</option>
      <option value="Highest Lowercase Alphabet">
        Highest Lowercase Alphabet
      </option>
    </select>
  </div>
);

// Response Component
const ResponseDisplay = ({ response, filters }) => {
  if (!response) return null;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-4 w-full max-w-md">
      <h3 className="text-lg font-medium mb-4">Response</h3>
      {filters.includes("Numbers") && response.numbers && (
        <div>Numbers: {response.numbers.join(", ")}</div>
      )}
      {filters.includes("Alphabets") && response.alphabets && (
        <div>Alphabets: {response.alphabets.join(", ")}</div>
      )}
      {filters.includes("Highest Lowercase Alphabet") &&
        response.highest_lowercase_alphabet && (
          <div>
            Highest Lowercase Alphabet: {response.highest_lowercase_alphabet}
          </div>
        )}
      <div className="mt-4">
        <strong>Success:</strong> {JSON.stringify(response.is_success)}
      </div>
      <div>
        <strong>User ID:</strong> {JSON.stringify(response.user_id)}
      </div>
      <div>
        <strong>Email:</strong> {JSON.stringify(response.email)}
      </div>
      <div>
        <strong>Roll Number:</strong> {JSON.stringify(response.roll_number)}
      </div>
    </div>
  );
};

// Main Component
export default function Home() {
  const [input, setInput] = useState(`{"data": ["A","1","C"]}`);
  const [response, setResponse] = useState(null);
  const [filters, setFilters] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      const parsedInput = JSON.parse(input);

      if (!Array.isArray(parsedInput.data)) {
        throw new Error("Input data should be an array");
      }

      parsedInput.data.forEach((item) => {
        if (
          typeof item !== "string" ||
          !(item.match(/^[a-zA-Z]{1}$/) || item.match(/^[0-9]+$/))
        ) {
          throw new Error("All elements must be a single character or a number");
        }
      });

      const res = await fetch("/bfhl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: parsedInput.data }),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      data.numbers = data.numbers.length ? data.numbers : "No numbers";
      data.alphabets = data.alphabets.length ? data.alphabets : "No alphabets";
      data.highest_lowercase_alphabet = data.highest_lowercase_alphabet.length
        ? data.highest_lowercase_alphabet
        : "No lowercase alphabets";
      setResponse(data);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-6">
      <div className="max-w-xl w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">
          JSON Data Processor
        </h2>

        <InputField input={input} setInput={setInput} />
        {error && <div className="text-red-600 mb-4">{error}</div>}
        
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white p-2 rounded-lg mb-4 hover:bg-blue-600"
        >
          Submit
        </button>

        <FilterSelect filters={filters} setFilters={setFilters} />
        <ResponseDisplay response={response} filters={filters} />
      </div>
    </div>
  );
}
