import React, { useState } from 'react';

declare const odysseyWasm: any;

const SRDLookup: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleSearch = async () => {
    const monster = await odysseyWasm.findMonster(searchTerm);
    if (monster) {
      setResult(JSON.parse(monster));
    } else {
      setResult(null);
    }
  };

  return (
    <div className="absolute top-10 right-0 bg-ls-primary-background border border-ls-border rounded-md shadow-lg p-2 z-50">
      <div className="flex">
        <input
          type="text"
          className="bg-ls-primary-background border border-ls-border rounded-md px-2 py-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="bg-ls-secondary-background text-ls-primary-text rounded-md px-4 py-1 ml-2" onClick={handleSearch}>Search</button>
      </div>
      {result && (
        <div className="mt-2">
          <h3 className="text-lg font-bold">{result.name}</h3>
          <p>{result.size} {result.type}, {result.alignment}</p>
          <p>Armor Class: {result.armor_class}</p>
          <p>Hit Points: {result.hit_points}</p>
        </div>
      )}
    </div>
  );
};

export default SRDLookup;