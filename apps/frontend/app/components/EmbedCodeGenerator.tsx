import { useState } from 'react';
import { Copy } from 'lucide-react';

interface EmbedCodeGeneratorProps {
  botId: string;
  width?: number;
  height?: number;
}

const EmbedCodeGenerator = ({ botId, width = 400, height = 600 }: EmbedCodeGeneratorProps) => {
  const [copied, setCopied] = useState(false);
  const [embedWidth, setEmbedWidth] = useState(width);
  const [embedHeight, setEmbedHeight] = useState(height);
  
  // Generate the embed code
  const embedCode = `<iframe 
  src="${window.location.origin}/bots/embed/${botId}" 
  width="${embedWidth}" 
  height="${embedHeight}" 
  style="border: none; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);"
  title="Chat Bot"
></iframe>`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <h3 className="text-lg font-medium text-white mb-4">Embed Your Bot</h3>
      
      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Width (px)</label>
          <input
            type="number"
            value={embedWidth}
            onChange={(e) => setEmbedWidth(parseInt(e.target.value) || 300)}
            className="bg-gray-800 text-white px-3 py-2 rounded-md border border-gray-700 w-24"
            min="200"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Height (px)</label>
          <input
            type="number"
            value={embedHeight}
            onChange={(e) => setEmbedHeight(parseInt(e.target.value) || 400)}
            className="bg-gray-800 text-white px-3 py-2 rounded-md border border-gray-700 w-24"
            min="300"
          />
        </div>
      </div>
      
      <div className="relative">
        <pre className="bg-gray-800 p-3 rounded-lg text-gray-300 text-sm overflow-x-auto">
          {embedCode}
        </pre>
        
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 p-2 rounded-md transition-colors"
          title="Copy to clipboard"
        >
          <Copy size={16} className="text-white" />
        </button>
      </div>
      
      {copied && (
        <p className="text-green-400 text-sm mt-2">Copied to clipboard!</p>
      )}
      
      <div className="mt-4 p-4 bg-gray-800 rounded-lg">
        <h4 className="text-sm font-medium text-white mb-2">Preview</h4>
        <div className="border border-gray-700 inline-block rounded-lg overflow-hidden" style={{ maxWidth: '100%' }}>
          <iframe
            src={`${window.location.origin}/bots/embed/${botId}`}
            width={Math.min(embedWidth, 500)} // Limit preview size
            height={Math.min(embedHeight, 400)}
            title="Chat Bot Preview"
            style={{ border: 'none' }}
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default EmbedCodeGenerator;