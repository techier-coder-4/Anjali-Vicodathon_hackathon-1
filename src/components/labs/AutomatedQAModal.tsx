import React, { useState } from 'react';
import { LabQAResult } from '../../types/lab';
import { LabService } from '../../services/labService';
import { CheckCircle2, AlertTriangle, ShieldCheck, Play, X, RefreshCw } from 'lucide-react';

interface AutomatedQAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AutomatedQAModal: React.FC<AutomatedQAModalProps> = ({ isOpen, onClose }) => {
  const [testResults, setTestResults] = useState<LabQAResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  if (!isOpen) return null;

  const handleRunAllTests = () => {
    setIsRunning(true);
    setTestResults([]);

    const allLabs = LabService.getLabs();
    let index = 0;

    const interval = setInterval(() => {
      if (index >= allLabs.length) {
        clearInterval(interval);
        setIsRunning(false);
        return;
      }

      const lab = allLabs[index];
      const result = LabService.runQATestSuite(lab.id);
      setTestResults((prev) => [...prev, result]);
      index++;
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl font-sans border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            <h2 className="text-lg font-black text-slate-900">Automated QA Validation Engine</h2>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-800 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Executes end-to-end integration, Docker health, route checks, flag reachability, hints validation, and runtime error tests across all practical labs.
        </p>

        <button
          onClick={handleRunAllTests}
          disabled={isRunning}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          <span>{isRunning ? 'Running QA Test Suite...' : 'Run Automated QA Tests'}</span>
        </button>

        {testResults.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 text-xs">Test Execution Results ({testResults.length} Labs Scanned)</h3>

            <div className="space-y-3">
              {testResults.map((res) => (
                <div
                  key={res.labId}
                  className={`p-4 rounded-2xl border text-xs space-y-2 ${
                    res.passed ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-900">{res.labTitle} ({res.labId})</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      res.passed ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                    }`}>
                      {res.passed ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                    {res.checks.map((chk, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-slate-700">
                        {chk.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        )}
                        <span className="truncate">{chk.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
