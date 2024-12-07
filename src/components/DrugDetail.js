import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function DrugDetail() {
    const [drugInfo, setDrugInfo] = useState(null);
    const [ndcs, setNDCs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { drug_name } = useParams();

    useEffect(() => {
        const fetchDrugDetails = async () => {
            setLoading(true);
            setError('');

            try {
                // Fetch drug details by name
                const res = await axios.get(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(drug_name)}`);
                console.log("API Response for drug details:", res.data); // Debug log

                // Access the drugGroup and conceptGroup safely
                const drugGroup = res.data.drugGroup;
                const conceptGroup = drugGroup?.conceptGroup || [];
                const sbdGroup = conceptGroup.find(group => group.tty === 'SBD');

                // Check if we found the SBD group and concept properties
                if (sbdGroup && sbdGroup.conceptProperties?.length > 0) {
                    const firstDrug = sbdGroup.conceptProperties[0]; // Take the first drug info
                    console.log("Setting drugInfo:", firstDrug); // Debug
                    setDrugInfo(firstDrug); // Set the drug information

                    // Fetch NDCs using RXCUI if it exists
                    const ndcRes = await axios.get(`https://rxnav.nlm.nih.gov/REST/rxcui/${firstDrug.rxcui}/ndcs.json`);
                    console.log("NDCs Response:", ndcRes.data); // Debug
                    const ndcList = ndcRes.data.ndcList ? ndcRes.data.ndcList.ndc : [];
                    setNDCs(ndcList);
                } else {
                    setError("No drug information found for the provided name.");
                }
            } catch (err) {
                setError("Failed to fetch drug details: " + (err.response && err.response.data ? err.response.data : err.message));
                console.error("Error fetching drug details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDrugDetails();
    }, [drug_name]);

    // Log the drugInfo state for debugging
    useEffect(() => {
        console.log("Current drugInfo State:", drugInfo);
    }, [drugInfo]);

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {drugInfo && (
                <>
                    <h2 style={{ marginTop: '20px' }}>Drug Details</h2>
                    <h3>{drugInfo.name}</h3>
                    <p>RXCUI: {drugInfo.rxcui}</p>
                    <p>Synonym: {drugInfo.synonym || 'N/A'}</p>
                    <h3>NDCs:</h3>
                    <ul>
                        {ndcs.length > 0 ? (
                            ndcs.map((ndc, index) => (
                                <li key={index}>{ndc}</li>
                            ))
                        ) : (
                            <li>No NDCs available.</li>
                        )}
                    </ul>
                </>
            )}
        </div>
    );
}

export default DrugDetail;