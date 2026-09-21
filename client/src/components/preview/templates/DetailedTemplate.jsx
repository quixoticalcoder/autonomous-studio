import React from 'react';
import { 
  Layers, 
  GitBranch, 
  Cpu, 
  Users,
  ChevronRight
} from 'lucide-react';

const DetailedTemplate = ({ data, accentColor = "#3B82F6" }) => {
  const { topic, finalOutput, workflow } = data;

  return (
    <div className="max-w-5xl mx-auto bg-white text-gray-800 p-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4" style={{ color: accentColor }}>Detailed Analysis Report</h1>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
          <span className="text-gray-600">Topic:</span>
          <span className="font-semibold">{topic}</span>
        </div>
      </div>

      {/* Agent Workflow Visualization */}
      {workflow && workflow.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <GitBranch size={24} />
            Agent Workflow Process
          </h2>
          
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 to-purple-400"></div>
            
            {workflow.map((step, index) => (
              <div key={index} className="relative flex items-start mb-8">
                <div className="z-10 size-16 rounded-full flex items-center justify-center mr-6" style={{ backgroundColor: `${accentColor}20` }}>
                  <div className="size-8 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                </div>
                
                <div className="flex-1 border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{step.agent}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(step.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                      {step.duration}
                    </span>
                  </div>
                  
                  {/* Render agent-specific content */}
                  {renderAgentOutput(step, accentColor)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Final Recommendation */}
      {finalOutput && (
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">Final Recommendation</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3" style={{ color: accentColor }}>Executive Summary</h3>
              <p className="text-gray-300 mb-6">{finalOutput.summary}</p>
              
              <h3 className="text-lg font-semibold mb-3" style={{ color: accentColor }}>Key Recommendation</h3>
              <p className="text-gray-300">{finalOutput.recommendation}</p>
            </div>
            
            {finalOutput.topConcept && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Selected Concept</h3>
                  <div className="px-3 py-1 bg-white/20 rounded-full text-sm">
                    Recommended
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-3">{finalOutput.topConcept.title}</h4>
                <p className="text-gray-300 mb-4">{finalOutput.topConcept.description}</p>
                <div className="pt-4 border-t border-white/20">
                  <p className="text-sm text-gray-300">
                    <strong>Rationale:</strong> {finalOutput.topConcept.rationale}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

// Helper function to render agent-specific output
const renderAgentOutput = (step, accentColor) => {
  const { agent, output } = step;
  
  switch (agent) {
    case 'Idea Agent':
      return (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Generated Concepts</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {output?.concepts?.slice(0, 3).map((concept, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-3">
                <h5 className="font-medium text-gray-900 mb-1">{concept.title}</h5>
                <p className="text-sm text-gray-600 line-clamp-2">{concept.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
      
    case 'Critic Agent':
      return (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Critical Analysis</h4>
          <p className="text-gray-700">
            Provided detailed critiques for {output?.critiques?.length || 0} concepts
          </p>
        </div>
      );
      
    case 'Refiner Agent':
      return (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Refined Outputs</h4>
          <p className="text-gray-700">
            Delivered {output?.refined?.length || 0} improved concepts
          </p>
        </div>
      );
      
    default:
      return <p className="text-gray-700">Analysis completed successfully</p>;
  }
};

export default DetailedTemplate;