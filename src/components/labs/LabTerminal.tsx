import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, RefreshCw, Copy, Check } from 'lucide-react';
import { Lab } from '../../types/lab';

interface LabTerminalProps {
  lab: Lab;
  history: string[];
  onCommandRun: (cmd: string, outputLine: string) => void;
  onClear: () => void;
}

export const LabTerminal: React.FC<LabTerminalProps> = ({ lab, history, onCommandRun, onClear }) => {
  const [inputCmd, setInputCmd] = useState('');
  const [copied, setCopied] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleRun = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputCmd.trim();
    if (!cmd) return;

    setInputCmd('');
    const lower = cmd.toLowerCase();

    if (lower === 'clear') {
      onClear();
      return;
    }

    let output = '';

    if (lower === 'help') {
      output = `WebForge Lab Shell v2.4\nAvailable commands:\n - docker ps : List running lab containers\n - docker logs <name> : Display container stdout logs\n - docker restart <name> : Restart container\n - curl <url> : Issue HTTP request\n - cat <file> : Read file contents\n - grep <pattern> <file> : Search file\n - env : Print environment variables\n - nmap <target> : Network port scanner\n - sqlmap <url> : SQL injection audit tool\n - clear : Clear terminal screen`;
    } else if (lower.startsWith('docker ps')) {
      const rows = lab.dockerConfig.containers
        .map((c) => `${c.name.padEnd(24)} ${c.image.padEnd(20)} Port:${c.port}   Status:${c.status} (CPU:${c.cpuUsage}%)`)
        .join('\n');
      output = `CONTAINER ID             IMAGE                PORTS         STATUS\n${rows}`;
    } else if (lower.startsWith('docker logs')) {
      const containerName = lower.split(' ')[2] || lab.dockerConfig.containers[0]?.name;
      const target = lab.dockerConfig.containers.find((c) => c.name.toLowerCase().includes(containerName));
      if (target) {
        output = target.logs.join('\n');
      } else {
        output = `Error: Container "${containerName}" not found.`;
      }
    } else if (lower.startsWith('docker restart')) {
      output = `Container restart signal sent. Container re-initialized with health checks passing.`;
    } else if (lower.startsWith('curl')) {
      if (lower.includes('169.254.169.254')) {
        output = `HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  "AccessKeyId": "ASIAIOSFODNN7EXAMPLE",\n  "Token": "WEBFORGE{ssrf_cloud_metadata_iam_keys_compromised_9091}"\n}`;
      } else if (lower.includes('system-info')) {
        output = `HTTP/1.1 200 OK\n{\n  "env": "production-debug",\n  "JWT_SECRET": "acme_super_secret_key_2026"\n}`;
      } else {
        output = `HTTP/1.1 200 OK\nServer: nginx/1.24.0\nContent-Type: text/html\n\n<!DOCTYPE html><html><body>${lab.title}</body></html>`;
      }
    } else if (lower.startsWith('cat')) {
      const fileName = cmd.split(' ')[1];
      const foundAsset = lab.assets.find((a) => a.name.toLowerCase() === fileName?.toLowerCase());
      if (foundAsset) {
        output = foundAsset.content;
      } else if (fileName === '/etc/iot_master.key') {
        output = 'WEBFORGE{iot_command_injection_ping_diag_pwned_6602}';
      } else {
        output = `cat: ${fileName || 'file'}: No such file or directory`;
      }
    } else if (lower === 'env') {
      output = `NODE_ENV=production\nLAB_ID=${lab.id}\nAPP_SLUG=${lab.slug}\nCONTAINER_RUNTIME=docker-seccomp\nPORT=3000`;
    } else if (lower.startsWith('nmap')) {
      output = `Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for ${lab.slug}.webforge-app.internal\nHost is up (0.00012s latency).\nNot shown: 998 closed tcp ports\nPORT     STATE SERVICE\n80/tcp   open  http\n8080/tcp open  http-proxy\nNmap done: 1 IP address (1 host up) scanned in 0.18 seconds`;
    } else if (lower.startsWith('sqlmap')) {
      output = `[+] sqlmap 1.8.2#stable initialized\n[+] Testing connection to target URL\n[!] Heuristic (basic) test shows target is VULNERABLE to SQL injection!\n[+] Target database: SQLite 3.x\n[+] Extracted row: { id: 999, name: 'VIP Governor', notes: 'WEBFORGE{sqli_hospital_patient_ehr_extracted_8812}' }`;
    } else {
      output = `bash: ${cmd}: command executed. (Exit Code: 0)`;
    }

    onCommandRun(`$ ${cmd}`, output);
  };

  const copyTerminalHistory = () => {
    navigator.clipboard.writeText(history.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 shadow-xl overflow-hidden font-mono text-xs flex flex-col h-[400px]">
      {/* Terminal Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-slate-400">
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-300">
          <TerminalIcon className="w-4 h-4 text-emerald-400" />
          <span>Interactive Shell — {lab.slug}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyTerminalHistory}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all"
            title="Copy Output"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClear}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all"
            title="Clear Terminal"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal History */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2 select-text">
        {history.map((line, idx) => (
          <div
            key={idx}
            className={`whitespace-pre-wrap leading-relaxed ${
              line.startsWith('$') ? 'text-emerald-400 font-bold' : 'text-slate-300'
            }`}
          >
            {line}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Command Form */}
      <form onSubmit={handleRun} className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
        <span className="text-emerald-400 font-bold">$</span>
        <input
          type="text"
          value={inputCmd}
          onChange={(e) => setInputCmd(e.target.value)}
          placeholder="Type command (e.g. docker ps, curl, help, clear)..."
          className="flex-1 bg-transparent text-white focus:outline-none text-xs font-mono"
        />
        <button type="submit" className="text-emerald-400 hover:text-emerald-300 p-1">
          <Play className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
