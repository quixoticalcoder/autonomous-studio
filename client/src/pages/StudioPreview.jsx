import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Download, 
  Share2, 
  Printer, 
  ArrowLeft,
  FileText 
} from 'lucide-react';
import TemplateSelector from '../components/TemplateSelector';
import DetailedTemplate from '../components/preview/templates/DetailedTemplate';;
import ExecutiveTemplate from '../components/preview/templates/ExecutiveTemplate';
import MinimalTemplate from '../components/preview/templates/MinimalTemplate';
import ColorPicker from '../components/ColorPicker';

function StudioPreview() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { finalOutput, topic, workflow } = location.state || {};
  
  // Default to preview if no data
  const [previewData, setPreviewData] = React.useState({
    template: 'executive',
    accentColor: '#3B82F6',
    data: {
      topic: topic || 'Sample Topic',
      finalOutput: finalOutput || {
        summary: 'This is a sample summary of the creative analysis.',
        recommendation: 'Proceed with the recommended concept after further validation.',
        topConcept: {
          title: 'Sample Creative Concept',
          description: 'This is a detailed description of the selected concept.',
          rationale: 'Selected based on innovation potential and feasibility.'
        }
      },
      workflow: workflow || []
    }
  });

  const renderTemplate = () => {
    const { template, accentColor, data } = previewData;
    
    switch (template) {
      case 'detailed':
        return <DetailedTemplate data={data} accentColor={accentColor} />;
      case 'minimal':
        return <MinimalTemplate data={data} accentColor={accentColor} />;
      case 'executive':
      default:
        return <ExecutiveTemplate data={data} accentColor={accentColor} />;
    }
  };

  const downloadPDF = () => {
    window.print();
  };

  const sharePreview = () => {
    if (navigator.share) {
      navigator.share({
        title: `Creative Analysis: ${topic}`,
        text: `Check out this creative analysis for "${topic}"`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (!location.state?.finalOutput) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="size-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Preview Available</h2>
          <p className="text-gray-500 mb-6">Please generate content in the studio first</p>
          <button
            onClick={() => navigate('/studio')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Studio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* Preview Controls */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
                Back to Studio
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Creative Preview</h1>
                <p className="text-gray-600">Topic: {topic}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <TemplateSelector
                selectedTemplate={previewData.template}
                onChange={(template) => 
                  setPreviewData(prev => ({ ...prev, template }))
                }
              />
              
              <ColorPicker
                selectedColor={previewData.accentColor}
                onChange={(color) => 
                  setPreviewData(prev => ({ ...prev, accentColor: color }))
                }
              />
              
              <div className="flex gap-2">
                <button
                  onClick={sharePreview}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <Share2 size={16} />
                  Share
                </button>
                <button
                  onClick={downloadPDF}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Printer size={16} />
                  Print/PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="max-w-6xl mx-auto">
        <div id="creative-preview" className="border border-gray-300 bg-white shadow-lg rounded-xl overflow-hidden">
          {renderTemplate()}
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #creative-preview, #creative-preview * {
            visibility: visible;
          }
          #creative-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            box-shadow: none;
            border: none;
          }
          button, nav, .print-hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default StudioPreview;