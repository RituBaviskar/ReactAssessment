import React from 'react'

function DrugList({drugs}) {
  return (
    <div>
      <ul>
        {drugs.map(drug =>(
            <li key={drug.rxcui}>
                <a href={`/drugs/${drug.name}`}>{drug.name}</a>
            </li>
        ))}
      </ul>
    </div>
  )
}

export default DrugList
