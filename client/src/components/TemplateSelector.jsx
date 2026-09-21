import { Layout, Check } from 'lucide-react';
import React, { useState } from 'react';

function TemplateSelector({ selectedTemplate, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const templates = [
    {
      id: "executive",
      name: "Executive",
      preview: "Professional report format for business presentations",
      color: "#3B82F6"
    },
    {
      id: "detailed",
      name: "Detailed",
      preview: "Comprehensive analysis with workflow visualization",
      color: "#8B5CF6"
    },
    {
      id: "minimal",
      name: "Minimal",
      preview: "Clean, focused presentation for quick review",
      color: "#10B981"
    },
    {
      id: "creative",
      name: "Creative",
      preview: "Visually engaging format for pitches and showcases",
      color: "#F59E0B"
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Layout size={16} />
        <span>Template: {templates.find(t => t.id === selectedTemplate)?.name}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => {
                onChange(template.id);
                setIsOpen(false);
              }}
              className={`p-4 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                selectedTemplate === template.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="size-4 rounded"
                    style={{ backgroundColor: template.color }}
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{template.preview}</p>
                  </div>
                </div>
                {selectedTemplate === template.id && (
                  <Check className="size-4 text-blue-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TemplateSelector;