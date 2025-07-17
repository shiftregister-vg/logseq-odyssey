import React from 'react';
import { Action } from '../../types';

interface ActionEditorProps {
  actions: Action[];
  onChange: (actions: Action[]) => void;
}

const ActionEditor: React.FC<ActionEditorProps> = ({ actions, onChange }) => {
  const handleAddAction = () => {
    onChange([...(actions || []), { name: '', description: '' }]);
  };

  const handleRemoveAction = (index: number) => {
    const newActions = [...(actions || [])];
    newActions.splice(index, 1);
    onChange(newActions);
  };

  const handleActionChange = (index: number, field: keyof Action, value: string) => {
    const newActions = [...(actions || [])];
    newActions[index] = { ...newActions[index], [field]: value };
    onChange(newActions);
  };

  return (
    <div className="flex flex-col gap-2">
      {(actions || []).map((action, index) => (
        <div key={index} className="flex flex-col gap-2 p-2 border border-ls-border rounded-md">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={action.name}
              onChange={(e) => handleActionChange(index, 'name', e.target.value)}
              placeholder="Action Name"
              className="w-full p-2 bg-transparent text-primary-text border border-ls-border rounded-md text-base"
            />
            <button onClick={() => handleRemoveAction(index)} className="p-2 bg-transparent text-primary-text border-none rounded-md cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <textarea
            value={action.description}
            onChange={(e) => handleActionChange(index, 'description', e.target.value)}
            placeholder="Action Description"
            className="w-full p-2 bg-transparent text-primary-text border border-ls-border rounded-md text-base min-h-20 resize-y"
          />
        </div>
      ))}
      <button onClick={handleAddAction} className="p-2 bg-transparent text-primary-text border border-ls-border rounded-md cursor-pointer flex items-center justify-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Add Action
      </button>
    </div>
  );
};

export default ActionEditor;
