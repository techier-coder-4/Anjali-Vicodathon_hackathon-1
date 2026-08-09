import React, { useState } from 'react';
import { Lab } from '../../types/lab';
import { Server, Activity, RefreshCw, Cpu, HardDrive, ShieldCheck, CheckCircle2, AlertTriangle, Play, Square } from 'lucide-react';

interface DockerInspectorProps {
  lab: Lab;
  onRestartContainer: (containerName: string) => void;
  onResetRuntime: () => void;
}

export const DockerInspector: React.FC<DockerInspectorProps> = ({ lab, onRestartContainer, onResetRuntime }) => {
  const [selectedContainer, setSelectedContainer] = useState(lab.dockerConfig.containers[0]?.name || '');

  const activeContainer = lab.dockerConfig.containers.find((c) => c.name === selectedContainer) || lab.dockerConfig.containers[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-600" />
            Docker Orchestrator & Container Inspector
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Network Bridge: <code className="font-mono font-bold text-slate-700">{lab.dockerConfig.networkName}</code></p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetRuntime}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Environment</span>
          </button>
        </div>
      </div>

      {/* Container List Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {lab.dockerConfig.containers.map((c) => {
          const isSelected = c.name === selectedContainer;
          return (
            <div
              key={c.name}
              onClick={() => setSelectedContainer(c.name)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs'
                  : 'border-slate-200 bg-slate-50 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs truncate">{c.name}</span>
                <span className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Healthy
                </span>
              </div>

              <p className="text-[11px] font-mono text-slate-500 mt-1">{c.image}</p>

              <div className="mt-3 pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-[10px] text-slate-600 font-medium">
                <div>CPU: <strong className="text-slate-800">{c.cpuUsage}%</strong></div>
                <div>RAM: <strong className="text-slate-800">{c.memoryUsage} MB</strong></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Container Log & Control Details */}
      {activeContainer && (
        <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Active Container: {activeContainer.name}
              </span>
              <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                Exposed Port: {activeContainer.port}
              </span>
            </div>

            <button
              onClick={() => onRestartContainer(activeContainer.name)}
              className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restart Container</span>
            </button>
          </div>

          <div className="space-y-1 font-mono text-[11px]">
            <span className="text-slate-400 text-[10px] font-bold block mb-1">STDOUT Stream Logs:</span>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 max-h-36 overflow-y-auto space-y-1">
              {activeContainer.logs.map((log, i) => (
                <div key={i} className="text-slate-300">{log}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
