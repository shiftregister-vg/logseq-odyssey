import React from 'react';

const SRDLookup: React.FC = () => {
  return (
    <div className="absolute top-10 right-0 bg-ls-primary-background border border-ls-border rounded-md shadow-lg p-2 z-50">
      <ul>
        <li className="px-4 py-2 cursor-pointer hover:bg-ls-secondary-background">Lookup Monster</li>
        <li className="px-4 py-2 cursor-pointer hover:bg-ls-secondary-background">Lookup Spell</li>
        <li className="px-4 py-2 cursor-pointer hover:bg-ls-secondary-background">Lookup Rule</li>
      </ul>
    </div>
  );
};

export default SRDLookup;