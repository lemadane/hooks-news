import axios from 'axios';
import React, { FormEvent, useEffect, useState, MouseEvent, useRef, RefObject } from 'react';

const BASE = 'http://hn.algolia.com/api/v1';

type Result = { objectId: string, url: string, title: string };

export default function App() {
  const [results, setResults] = useState([] as Result[]);
  const [query, setQuery] = useState('react hooks');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null as Error | null);
  const searchInputRef = useRef() as RefObject<HTMLInputElement>;

  const getResults = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE}/search?query=${query}`,
      );
      setResults(response.data.hits);
      setError(null);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    getResults();
  };

  const handleClearSearch = (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    setQuery('');
    searchInputRef?.current?.focus();
  };

  useEffect(() => {
    getResults();
    return () => {
    }
  }, []);

  return (
    <div className="container max-w-md mx-auto p-4 m-2 bg-purple-lightest shadow-lg rounded">
      <img src="https://miro.medium.com/max/500/1*cPh7ujRIfcHAy4kW2ADGOw.png" alt="React Logo" className="float-right h-12" />
      <h1 className="text-grey-darkest font-thin">Hooks News</h1>
      <form onSubmit={handleSearch} className="mb-2">
        <input
          type="text"
          value={query}
          onChange={event => setQuery(event.target.value)}
          ref={searchInputRef}
          className="border p-1 rounded"
        />
        <button type="submit" className="bg-orange  m-1 p-1 rounded">Search</button>
        <button type="button" onClick={handleClearSearch} className="bg-teal text-white p-1 rounded">Clear</button>
      </form>
      {
        loading
          ?
          <div className="font-bold text-orange-dark">Loading...</div>
          :
          error
            ?
            <div className="text-red font-bold">{error.message}</div>
            :
            <ul className="list-reset leading-normal">
              {
                results.map((result: Result) => {
                  const { objectId, url, title } = result;
                  return (
                    <li key={objectId}>
                      <a href={url} className="text-indigo-dark hover:text-indigo-darkest">{title}</a>
                    </li>
                  );
                })
              }
            </ul>
      }
    </div>
  );
}
