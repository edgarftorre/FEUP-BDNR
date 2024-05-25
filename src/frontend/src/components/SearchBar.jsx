import { useState } from 'react';

function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');

    const handleQueryChange = (event) => {
      const newQuery = event.target.value;
      setQuery(newQuery);
      onSearch(newQuery);
    };
  
    return (
      <div>
        <input type="text" value={query} onChange={handleQueryChange} />
      </div>
    );
}

export default SearchBar;





