import React from 'react';

const MinimalTemplate = ({ data, accentColor = "#3B82F6" }) => {
  const { topic, finalOutput } = data;

  return (
    <div className="max-w-3xl mx-auto bg-white text-gray-800 p-8">
      {/* Simple Header */}
      <header className="mb-12 text-center">
        <div className="inline-block mb-4">
          <div className="size-12 rounded-lg mx-auto mb-3" style={{ backgroundColor: accentColor }}></div>
        </div>
        <h1 className="text-4xl font-light text-gray-900 mb-2">Creative Analysis</h1>
        <p className="text-gray-600">Topic: {topic}</p>
      </header>

      {/* Main Content */}
      <div className="space-y-10">
        {finalOutput?.summary && (
          <div className="border-l-4 pl-6 py-2" style={{ borderColor: accentColor }}>
            <h2 className="text-xl font-medium text-gray-900 mb-4">Summary</h2>
            <p className="text-gray-700 leading-relaxed">{finalOutput.summary}</p>
          </div>
        )}

        {finalOutput?.topConcept && (
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-6">Recommended Solution</h2>
            <div className="border rounded-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{finalOutput.topConcept.title}</h3>
              <p className="text-gray-700 mb-4">{finalOutput.topConcept.description}</p>
              {finalOutput.topConcept.rationale && (
                <div className="text-sm text-gray-600">
                  <strong>Why this works:</strong> {finalOutput.topConcept.rationale}
                </div>
              )}
            </div>
          </div>
        )}

        {finalOutput?.recommendation && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Implementation</h2>
            <p className="text-gray-700">{finalOutput.recommendation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinimalTemplate;