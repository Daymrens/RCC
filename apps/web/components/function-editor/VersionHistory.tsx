'use client';

import { useState, useEffect } from 'react';
import { History, RotateCcw, X } from 'lucide-react';

interface Version {
  id: string;
  version: number;
  createdAt: string;
  comment?: string;
  code?: string;
}

interface VersionHistoryProps {
  functionId: string;
  onRestore: (version: Version) => void;
}

export default function VersionHistory({ functionId, onRestore }: VersionHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [versions, setVersions] = useState<Version[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadVersions();
    }
  }, [isOpen, functionId]);

  const loadVersions = async () => {
    const res = await fetch(`http://localhost:3001/api/functions/${functionId}/versions`);
    const data = await res.json();
    setVersions(data);
  };

  const handleRestore = (version: Version) => {
    if (confirm(`Restore to version ${version.version}?`)) {
      onRestore(version);
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1 bg-surface-2 rounded hover:bg-surface-3"
        title="Version History"
      >
        <History size={16} />
        History
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg w-full max-w-4xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-lg font-bold">Version History</h2>
          <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-text">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          <div className="w-64 border-r border-border overflow-y-auto">
            {versions.map(version => (
              <div
                key={version.id}
                onClick={() => setSelectedVersion(version)}
                className={`p-3 border-b border-border cursor-pointer hover:bg-surface-2 ${
                  selectedVersion?.id === version.id ? 'bg-surface-2' : ''
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold">v{version.version}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRestore(version);
                    }}
                    className="p-1 hover:bg-surface-3 rounded"
                    title="Restore this version"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
                <div className="text-xs text-text-muted">
                  {new Date(version.createdAt).toLocaleString()}
                </div>
                {version.comment && (
                  <div className="text-xs text-text-muted mt-1">{version.comment}</div>
                )}
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {selectedVersion ? (
              <div>
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Version {selectedVersion.version}</h3>
                  <div className="text-sm text-text-muted">
                    {new Date(selectedVersion.createdAt).toLocaleString()}
                  </div>
                  {selectedVersion.comment && (
                    <div className="text-sm mt-2">{selectedVersion.comment}</div>
                  )}
                </div>
                <pre className="bg-surface-2 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                  {selectedVersion.code || 'No code'}
                </pre>
              </div>
            ) : (
              <div className="text-center text-text-muted py-20">
                Select a version to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
