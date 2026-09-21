import React from 'react';
import { 
  FileText, 
  BarChart3, 
  Target, 
  Star, 
  Brain, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Lightbulb
} from 'lucide-react';

const ExecutiveTemplate = ({ data, accentColor = "#3B82F6" }) => {
  const { topic, finalOutput, workflow } = data;

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800 p-8">
      {/* Header */}
      <header className="mb-10 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold mb-3" style={{ color: accentColor }}>
          Creative Solution Report
        </h1>
        <div className="flex items-center gap-2 text-gray-600">
          <Target size={16} />
          <span className="font-medium">Topic:</span>
          <span>{topic}</span>
        </div>
      </header>

      {/* Executive Summary */}
      {finalOutput?.summary && (
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${accentColor}20` }}>
              <FileText className="size-5" style={{ color: accentColor }} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Executive Summary</h2>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl">
            <p className="text-gray-700 leading-relaxed">{finalOutput.summary}</p>
          </div>
        </section>
      )}

      {/* Top Concept */}
      {finalOutput?.topConcept && (
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${accentColor}20` }}>
              <Star className="size-5" style={{ color: accentColor }} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Recommended Solution</h2>
          </div>
          <div className="border rounded-xl p-6" style={{ borderColor: accentColor, backgroundColor: `${accentColor}08` }}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{finalOutput.topConcept.title}</h3>
                <p className="text-gray-600 mt-2">{finalOutput.topConcept.description}</p>
              </div>
              <span className="px-3 py-1 text-sm font-medium rounded-full" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                Top Pick
              </span>
            </div>
            {finalOutput.topConcept.rationale && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Brain size={16} />
                  Selection Rationale
                </h4>
                <p className="text-gray-700">{finalOutput.topConcept.rationale}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Recommendation */}
      {finalOutput?.recommendation && (
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${accentColor}20` }}>
              <CheckCircle className="size-5" style={{ color: accentColor }} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Implementation Recommendation</h2>
          </div>
          <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-200">
            <p className="text-gray-700">{finalOutput.recommendation}</p>
          </div>
        </section>
      )}

      {/* Workflow Summary */}
      {workflow && workflow.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${accentColor}20` }}>
              <TrendingUp className="size-5" style={{ color: accentColor }} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Analysis Process</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {workflow.map((step, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="size-2 rounded-full" style={{ backgroundColor: accentColor }}></div>
                  <span className="text-sm font-medium text-gray-900">{step.agent}</span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {step.output?.concepts?.length 
                    ? `${step.output.concepts.length} concepts generated`
                    : step.output?.critiques?.length 
                    ? `${step.output.critiques.length} critiques provided`
                    : 'Analysis completed'}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ExecutiveTemplate;