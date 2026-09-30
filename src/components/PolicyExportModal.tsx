import React, { useState, useMemo } from 'react';
import { Copy, Check, Download, Printer, X } from 'lucide-react';
import {
  generatePolicyMarkdown,
  generatePolicyHtml,
  POLICY_META,
  CORE_PRINCIPLES,
  CLIENT_STORAGE_INVENTORY,
  BACKEND_MEMORY_STORES,
  EXTERNAL_DATA_FLOWS,
  USER_CONTROL_MECHANISMS,
} from '../data/privacyPolicyData';

interface PolicyExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ExportFormat = 'markdown' | 'html' | 'json';

export const PolicyExportModal: React.FC<PolicyExportModalProps> = ({ isOpen, onClose }) => {
  const [format, setFormat] = useState<ExportFormat>('markdown');
  const [copied, setCopied] = useState(false);

  const outputContent = useMemo(() => {
    if (format === 'markdown') {
      return generatePolicyMarkdown();
    }
    if (format === 'html') {
      return generatePolicyHtml();
    }
    return JSON.stringify(
      {
        meta: POLICY_META,
        corePrinciples: CORE_PRINCIPLES,
        clientStorageInventory: CLIENT_STORAGE_INVENTORY,
        backendMemoryStores: BACKEND_MEMORY_STORES,
        externalDataFlows: EXTERNAL_DATA_FLOWS,
        userControlMechanisms: USER_CONTROL_MECHANISMS,
      },
      null,
      2
    );
  }, [format]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputContent);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    const ext = format === 'markdown' ? 'md' : format === 'html' ? 'html' : 'json';
    const mime =
      format === 'markdown'
        ? 'text/markdown;charset=utf-8'
        : format === 'html'
          ? 'text/html;charset=utf-8'
          : 'application/json;charset=utf-8';

    const blob = new Blob([outputContent], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `isaac-search-engine-privacy-policy.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    onClose();
    window.setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-policy-title"
    >
      <div className="w-full max-w-4xl bg-[#FBF9F5] dark:bg-stone-900 border border-stone-300 dark:border-stone-700 shadow-xl flex flex-col max-h-[88vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h2 id="export-policy-title" className="text-xl font-semibold text-stone-900 dark:text-stone-100">
              Export &amp; Copy Privacy Policy
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Ready for direct integration into the Isaac Search Engine repository, documentation, or legal routes.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
            aria-label="Close export modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-stone-100/80 dark:bg-stone-950/60 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-1 p-1 bg-stone-200/70 dark:bg-stone-800">
            <button
              type="button"
              onClick={() => setFormat('markdown')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                format === 'markdown'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Markdown (.md)
            </button>
            <button
              type="button"
              onClick={() => setFormat('html')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                format === 'html'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Standalone HTML (.html)
            </button>
            <button
              type="button"
              onClick={() => setFormat('json')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                format === 'json'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              JSON Schema (.json)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white transition-colors whitespace-nowrap cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Document'}</span>
            </button>
          </div>
        </div>

        {/* Code Preview Area */}
        <div className="p-6 overflow-y-auto flex-1 bg-white dark:bg-stone-950">
          <pre className="text-xs font-mono leading-relaxed text-stone-800 dark:text-stone-200 whitespace-pre-wrap break-words select-all">
            {outputContent}
          </pre>
        </div>
      </div>
    </div>
  );
};
