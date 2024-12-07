import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

function SearchBar() {
    const [drugName, setDrugName] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSearch = async (e) => {
        e.preventDefault();
        setError('');
        setSuggestions([]);

        if (drugName) {
            try {
                const suggestionRes = await axios.get(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${drugName}`);
                
                const conceptGroups = suggestionRes.data.drugGroup?.conceptGroup || [];
                const allSuggestions = conceptGroups.flatMap(group => group.conceptProperties || []);

                if (allSuggestions.length > 0) {
                    setSuggestions(allSuggestions);
                } else {
                    setError("No results found");
                }
            } catch (err) {
                setError("API call failed");
            }
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setDrugName(suggestion.name);
        setSuggestions([]);
        // Navigate to the DrugDetail page
        navigate(`/drugs/${encodeURIComponent(suggestion.name)}`);
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input
                    type='text'
                    value={drugName}
                    onChange={(e) => setDrugName(e.target.value)}
                    placeholder='Search for Drug Name'
                />
                <button type='submit'>Search</button>
            </form>
            {error && <p>{error}</p>}
            {suggestions.length > 0 && (
                <ul>
                    {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                            {suggestion.name} 
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchBar;