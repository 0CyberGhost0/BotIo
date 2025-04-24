import { useState } from "react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import VisuallyHidden from '@radix-ui/react-visually-hidden';

interface DataSource {
  id: string;
  name: string;
  emoji: string;
}

interface DataSourceDialogProps {
  source: DataSource;
  onTrain: (sourceId: string, data: { file?: File; text?: string }) => void;
}

const getDialogDescription = (type: string) => {
  switch (type) {
    case "url":
      return "Enter the URL to fetch data from the web.";
    case "pdf":
      return "Upload a .pdf file to extract content.";
    case "txt":
      return "Upload a .txt file containing text.";
    case "text":
      return "Paste any text you want to train the bot with.";
    case "youtube":
      return "Enter a YouTube video URL";
    case "notion":
      return "Enter a Notion page URL";
    case "docs":
      return "Upload a .docx file to extract content.";
    default:
      return "Provide data to train your chatbot.";
  }
};

const DataSourceDialog: React.FC<DataSourceDialogProps> = ({ source, onTrain }) => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");

  const handleSubmit = () => {
    const data: { file?: File; text?: string } = {};
    if (file) {
      data.file = file;
    } else if (text) {
      data.text = text;
    }
    onTrain(source.id, data);
  };

  const renderInput = () => {
    switch (source.id) {
      case "url":
      case "youtube":
      case "notion":
        return (
          <input
            type="url"
            placeholder={
              source.id === "youtube"
                ? "https://youtube.com/watch?v=..."
                : source.id === "notion"
                ? "https://notion.so/..."
                : "https://example.com"
            }
            className="w-full p-2 mt-2 rounded bg-gray-800 text-white border border-gray-600"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        );
      case "pdf":
      case "txt":
      case "docs":
        return (
          <input
            type="file"
            accept={source.id === "pdf" ? ".pdf" : source.id === "txt" ? ".txt" : ".docx"}
            className="w-full p-2 mt-2 rounded bg-gray-800 text-white border border-gray-600"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        );
      case "text":
        return (
          <textarea
            placeholder="Paste your training text here..."
            rows={6}
            className="w-full p-2 mt-2 rounded bg-gray-800 text-white border border-gray-600"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        );
      default:
        return <div>Unsupported data source</div>;
    }
  };

  return (
    <>
      <DialogHeader>
        {/* Keep DialogTitle visible for accessibility */}
        <DialogTitle className="text-xl font-semibold">Upload via {source.name}</DialogTitle>
        
         
          <VisuallyHidden asChild>
            <DialogTitle>Upload via {source.name}</DialogTitle>
          </VisuallyHidden>
          {/* Then, optionally add a visible heading for sighted users: */}
          <h2 className="text-xl font-semibold">Upload via {source.name}</h2>
       
        <DialogDescription className="text-gray-400 text-sm">
          {getDialogDescription(source.id)}
        </DialogDescription>
      </DialogHeader>
      <div>{renderInput()}</div>
      <button
        className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 transition rounded-md text-white font-medium shadow-md"
        onClick={handleSubmit}
        disabled={
          (source.id === "url" || source.id === "youtube" || source.id === "notion" || source.id === "text") &&
          !text
        }
      >
        🚀 Train Bot
      </button>
    </>
  );
};

export default DataSourceDialog;