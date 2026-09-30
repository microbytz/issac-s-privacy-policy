import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Trash2, Play, PlusCircle, Check } from 'lucide-react';

interface LiveKeyRecord {
  key: string;
  scope: 'localStorage' | 'sessionStorage';
  rawValue: string;
  byteSize: number;
}

const TRACKED_PREFIXES = ['isaac_', 'blocked_domains'];

export const LiveStorageInspector: React.FC = () => {
  const [records, setRecords] = useState<LiveKeyRecord[]>([]);
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);
  const [ephemeralEnabled, setEphemeralEnabled] = useState<boolean>(false);

  const scanBrowserStorage = useCallback(() => {
    const found: LiveKeyRecord[] = [];
    try {
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && TRACKED_PREFIXES.some((prefix) => k.startsWith(prefix))) {
          const val = window.localStorage.getItem(k) ?? '';
          found.push({
            key: k,
            scope: 'localStorage',
            rawValue: val,
            byteSize: new Blob([val]).size,
          });
        }
      }
      for (let i = 0; i < window.sessionStorage.length; i++) {
        const k = window.sessionStorage.key(i);
        if (k && TRACKED_PREFIXES.some((prefix) => k.startsWith(prefix))) {
          const val = window.sessionStorage.getItem(k) ?? '';
          found.push({
            key: k,
            scope: 'sessionStorage',
            rawValue: val,
            byteSize: new Blob([val]).size,
          });
        }
      }
      setEphemeralEnabled(window.localStorage.getItem('isaac_clear_history_on_exit') === 'true');
    } catch {
      // Fallback if storage access is restricted
    }
    found.sort((a, b) => a.key.localeCompare(b.key));
    setRecords(found);
  }, []);

  useEffect(() => {
    scanBrowserStorage();
  }, [scanBrowserStorage]);

  const showToast = (msg: string) => {
    setLastActionMessage(msg);
    window.setTimeout(() => {
      setLastActionMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const handleSeedDemoState = () => {
    try {
      window.localStorage.setItem(
        'isaac_history',
        JSON.stringify(['bm25 ranking algorithm', 'searxng privacy architecture', 'common crawl cdx index'])
      );
      window.localStorage.setItem('isaac_clear_history_on_exit', 'true');
      window.localStorage.setItem('blocked_domains', JSON.stringify(['example-tracker.net', 'spam-seo.org']));
      window.localStorage.setItem('isaac_searxng_fallback_enabled', 'true');
      window.sessionStorage.setItem('isaac_session_active', 'true');
      window.sessionStorage.setItem(
        'isaac_history_session_cache',
        JSON.stringify(['bm25 ranking algorithm', 'searxng privacy architecture'])
      );
      scanBrowserStorage();
      showToast('Populated sample Isaac storage keys in your browser for live inspection.');
    } catch {
      showToast('Unable to write to browser Web Storage in this environment.');
    }
  };

  const handleSimulateSessionTermination = () => {
    try {
      window.localStorage.removeItem('isaac_history');
      window.sessionStorage.removeItem('isaac_history_session_cache');
      window.sessionStorage.removeItem('isaac_session_active');
      scanBrowserStorage();
      showToast(
        'Executed Simulate Session Termination: purged isaac_history, isaac_history_session_cache, and isaac_session_active.'
      );
    } catch {
      showToast('Could not complete session termination simulation.');
    }
  };

  const handleToggleEphemeralMode = () => {
    try {
      const next = !ephemeralEnabled;
      window.localStorage.setItem('isaac_clear_history_on_exit', String(next));
      scanBrowserStorage();
      showToast(`Updated isaac_clear_history_on_exit to "${String(next)}".`);
    } catch {
      showToast('Unable to update localStorage flag.');
    }
  };

  const handleRemoveSingleKey = (scope: 'localStorage' | 'sessionStorage', key: string) => {
    try {
      if (scope === 'localStorage') {
        window.localStorage.removeItem(key);
      } else {
        window.sessionStorage.removeItem(key);
      }
      scanBrowserStorage();
      showToast(`Deleted ${scope}["${key}"] from browser storage.`);
    } catch {
      showToast('Failed to delete key.');
    }
  };

  const handlePurgeAllIsaacKeys = () => {
    try {
      const localKeysToRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        // Keep theme if desired, or wipe all except theme, or wipe all
        if (k && TRACKED_PREFIXES.some((prefix) => k.startsWith(prefix)) && k !== 'isaac_theme') {
          localKeysToRemove.push(k);
        }
      }
      localKeysToRemove.forEach((k) => window.localStorage.removeItem(k));

      const sessionKeysToRemove: string[] = [];
      for (let i = 0; i < window.sessionStorage.length; i++) {
        const k = window.sessionStorage.key(i);
        if (k && TRACKED_PREFIXES.some((prefix) => k.startsWith(prefix))) {
          sessionKeysToRemove.push(k);
        }
      }
      sessionKeysToRemove.forEach((k) => window.sessionStorage.removeItem(k));

      scanBrowserStorage();
      showToast('Purged all local Isaac Search Engine history, workspace, and session keys.');
    } catch {
      showToast('Failed to clear storage keys.');
    }
  };

  const totalBytes = records.reduce((acc, item) => acc + item.byteSize, 0);

  return (
    <div className="border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900/70 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="text-xs text-stone-500 dark:text-stone-400 font-mono">
            Interactive Verification Sandbox · Client Origin Inspector
          </div>
          <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mt-1">
            Live Browser Storage &amp; Ephemeral Teardown Auditor
          </h3>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
            Inspect active <code className="font-mono text-xs">isaac_*</code> and{' '}
            <code className="font-mono text-xs">blocked_domains</code> keys currently stored in this browser origin, or test
            the immediate ephemeral session teardown controls described in Section 06.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSeedDemoState}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Seed Sample Keys</span>
          </button>

          <button
            type="button"
            onClick={handleToggleEphemeralMode}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Clear on Exit: {ephemeralEnabled ? 'Enabled' : 'Disabled'}</span>
          </button>

          <button
            type="button"
            onClick={handleSimulateSessionTermination}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-amber-900 text-amber-50 hover:bg-amber-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Simulate Session Termination</span>
          </button>

          <button
            type="button"
            onClick={handlePurgeAllIsaacKeys}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border border-red-800/40 dark:border-red-500/40 text-red-800 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge All Local Keys</span>
          </button>
        </div>
      </div>

      {lastActionMessage && (
        <div
          role="status"
          className="mt-4 px-4 py-2.5 text-xs font-mono border-l-2 border-amber-800 dark:border-amber-500 bg-stone-100 dark:bg-stone-800/80 text-stone-800 dark:text-stone-200 flex items-center justify-between"
        >
          <span>{lastActionMessage}</span>
          <button
            type="button"
            onClick={scanBrowserStorage}
            className="inline-flex items-center gap-1 text-xs underline hover:text-stone-950 dark:hover:text-white ml-4 whitespace-nowrap cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Refresh Scan</span>
          </button>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-mono">
        <div>
          Active Origin Keys Detected: <strong className="text-stone-900 dark:text-stone-100 tabular-nums">{records.length}</strong>
          <span className="mx-2" aria-hidden="true">·</span>
          Total Payload Size: <strong className="text-stone-900 dark:text-stone-100 tabular-nums">{totalBytes} bytes</strong>
        </div>
        <button
          type="button"
          onClick={scanBrowserStorage}
          className="inline-flex items-center gap-1 hover:text-stone-900 dark:hover:text-stone-100 transition-colors whitespace-nowrap cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Re-scan Web Storage</span>
        </button>
      </div>

      {records.length === 0 ? (
        <div className="mt-4 py-8 text-center border-t border-stone-200 dark:border-stone-800">
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Zero <code className="font-mono text-xs">isaac_*</code> or <code className="font-mono text-xs">blocked_domains</code> keys are currently stored in your browser.
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-500 mt-1">
            Click &ldquo;Seed Sample Keys&rdquo; above to test how local storage persistence and immediate session termination work.
          </p>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto border-t border-stone-200 dark:border-stone-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400">
                <th className="py-2.5 pr-4 font-medium">Storage Key</th>
                <th className="py-2.5 px-4 font-medium">Web API Scope</th>
                <th className="py-2.5 px-4 font-medium">Current Stored Value</th>
                <th className="py-2.5 px-4 font-medium text-right">Size</th>
                <th className="py-2.5 pl-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-xs font-mono">
              {records.map((rec) => (
                <tr key={`${rec.scope}:${rec.key}`} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                  <td className="py-2.5 pr-4 font-medium text-stone-900 dark:text-stone-100 whitespace-nowrap">
                    {rec.key}
                  </td>
                  <td className="py-2.5 px-4 text-stone-600 dark:text-stone-400 whitespace-nowrap">
                    {rec.scope}
                  </td>
                  <td className="py-2.5 px-4 text-stone-700 dark:text-stone-300 max-w-md truncate" title={rec.rawValue}>
                    {rec.rawValue}
                  </td>
                  <td className="py-2.5 px-4 text-right text-stone-600 dark:text-stone-400 tabular-nums whitespace-nowrap">
                    {rec.byteSize} B
                  </td>
                  <td className="py-2.5 pl-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleRemoveSingleKey(rec.scope, rec.key)}
                      className="text-red-700 dark:text-red-400 hover:underline cursor-pointer"
                    >
                      Delete Key
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
