import React, { useState, useEffect } from 'react';
import { Lab, RealisticAppType } from '../../../types/lab';
import {
  Globe,
  Lock,
  RotateCw,
  ArrowLeft,
  ArrowRight,
  Shield,
  Search,
  Bell,
  User,
  Settings,
  Terminal as TerminalIcon,
  Code,
  CheckCircle2,
  AlertTriangle,
  FileText,
  CreditCard,
  Building,
  Activity,
  Layers,
  ShoppingBag,
  MessageSquare,
  Compass,
  Bug,
  HelpCircle,
  Cloud,
  Key,
  Folder,
  BarChart3,
  Users,
  Package,
  GraduationCap,
  Cpu,
  Landmark,
  Send,
  Upload,
  Download,
  Eye,
  Trash2,
  Plus
} from 'lucide-react';

interface AppContainerProps {
  lab: Lab;
  onApiCallLog?: (log: { method: string; path: string; status: number; timestamp: string }) => void;
  onTriggerAction?: (actionName: string, data?: any) => void;
}

export const AppContainer: React.FC<AppContainerProps> = ({ lab, onApiCallLog, onTriggerAction }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentRole, setCurrentRole] = useState<'guest' | 'user' | 'admin' | 'executive'>('user');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState([
    { id: 'n1', title: 'Security Audit Alert', desc: 'Unusual REST query detected on internal endpoint', time: '10m ago', unread: true },
    { id: 'n2', title: 'System Backup Complete', desc: 'Database snapshot saved to bucket s3://prod-backups-2026', time: '1h ago', unread: false }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDevTools, setShowDevTools] = useState(true);
  const [apiLogs, setApiLogs] = useState<Array<{ id: string; method: string; path: string; status: number; body?: string; time: string }>>([
    { id: 'log-1', method: 'GET', path: `/api/${lab.appType}/health`, status: 200, time: '2026-08-08 21:55:00' },
    { id: 'log-2', method: 'GET', path: `/api/${lab.appType}/session`, status: 200, time: '2026-08-08 21:55:01' }
  ]);

  // Specific challenge interaction states
  const [corpRoleHeader, setCorpRoleHeader] = useState('employee');
  const [transferFrom, setTransferFrom] = useState('ACC-1001');
  const [transferTo, setTransferTo] = useState('ACC-2002');
  const [transferAmount, setTransferAmount] = useState('500');
  const [transferResult, setTransferResult] = useState<string | null>(null);

  const [patientSearch, setPatientSearch] = useState('');
  const [patientResults, setPatientResults] = useState<any[]>([]);

  const [uploadFileName, setUploadFileName] = useState('solution.svg');
  const [uploadContent, setUploadContent] = useState('<svg xmlns="http://www.w3.org/2000/svg"><script>window.getLmsFlag()</script></svg>');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [cartPrice, setCartPrice] = useState('2500.00');
  const [checkoutReceipt, setCheckoutReceipt] = useState<string | null>(null);

  const [cloudUrlInput, setCloudUrlInput] = useState('http://169.254.169.254/latest/meta-data/iam/security-credentials/admin-role');
  const [cloudFetchResult, setCloudFetchResult] = useState<string | null>(null);

  const [pingHostInput, setPingHostInput] = useState('127.0.0.1; cat /etc/iot_master.key');
  const [pingOutput, setPingOutput] = useState<string | null>(null);

  const logApi = (method: string, path: string, status: number, body?: string) => {
    const time = new Date().toLocaleTimeString();
    const logItem = { id: `log_${Date.now()}`, method, path, status, body, time };
    setApiLogs((prev) => [logItem, ...prev].slice(0, 20));
    if (onApiCallLog) onApiCallLog({ method, path, status, timestamp: time });
  };

  const getAppTitle = () => {
    switch (lab.appType) {
      case 'corporate_portal': return 'Acme Corporate Portal';
      case 'bank_dashboard': return 'Apex Global Bank — Online Banking';
      case 'hospital_system': return 'MedTech Hospital System & EHR';
      case 'learning_management': return 'Forge LMS — Student Portal';
      case 'ecommerce_platform': return 'ShopMax E-Commerce Store';
      case 'forum': return 'DevTrust Tech Forum';
      case 'cms': return 'Aether CMS & Publisher';
      case 'travel_booking': return 'AeroFlight Travel Booking';
      case 'bug_tracker': return 'BugPulse Incident Tracker';
      case 'support_portal': return 'DeskHelp Support Desk';
      case 'cloud_dashboard': return 'SkyWall Cloud Console';
      case 'developer_portal': return 'DevHub API Developer Portal';
      case 'git_repository': return 'CodeForge Git Web Console';
      case 'file_storage': return 'CloudVault Secure Storage';
      case 'analytics_dashboard': return 'PulseMetrics Analytics Engine';
      case 'hr_portal': return 'PeopleOps HR Portal';
      case 'inventory_system': return 'StockSupply Inventory Engine';
      case 'student_portal': return 'CampusOne Student Portal';
      case 'iot_dashboard': return 'SmartGrid IoT Control Center';
      case 'government_portal': return 'GovService Citizen Portal';
      default: return 'Production Web Portal';
    }
  };

  // Render specific app template view
  const renderAppView = () => {
    switch (lab.appType) {
      case 'corporate_portal':
        return (
          <div className="space-y-6">
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Building className="w-5 h-5 text-indigo-400" />
                  Acme Enterprise Intranet Portal
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Internal Corporate Communications & Document Directory
                </p>
              </div>
              <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-xl text-xs">
                <span className="text-slate-400">Header `X-User-Role`:</span>
                <select
                  value={corpRoleHeader}
                  onChange={(e) => setCorpRoleHeader(e.target.value)}
                  className="bg-slate-700 text-white font-bold px-2 py-1 rounded border border-slate-600 focus:outline-none"
                >
                  <option value="employee">employee</option>
                  <option value="manager">manager</option>
                  <option value="executive">executive</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      Internal Document Directory
                    </h3>
                    <span className="text-xs text-slate-500 font-semibold">Showing 4 Documents</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    <div className="py-3 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">Q3 Financial Forecast.pdf</h4>
                        <p className="text-[11px] text-slate-500">Access: Employee Public</p>
                      </div>
                      <button
                        onClick={() => logApi('GET', '/api/corp/documents/doc_101', 200)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg"
                      >
                        Download
                      </button>
                    </div>

                    <div className="py-3 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">Employee Benefits 2026.docx</h4>
                        <p className="text-[11px] text-slate-500">Access: Employee Public</p>
                      </div>
                      <button
                        onClick={() => logApi('GET', '/api/corp/documents/doc_102', 200)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg"
                      >
                        Download
                      </button>
                    </div>

                    <div className="py-3 flex items-center justify-between bg-amber-50/60 p-2 rounded-xl">
                      <div>
                        <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-amber-600" />
                          Executive Vault Archive Q3 (CONFIDENTIAL)
                        </h4>
                        <p className="text-[11px] text-amber-700">Requires `X-User-Role: executive`</p>
                      </div>
                      <button
                        onClick={() => {
                          if (corpRoleHeader === 'executive') {
                            logApi('GET', '/api/corp/documents?vault=true', 200, '{"flag": "WEBFORGE{corp_portal_jwt_secret_revealed_9942}"}');
                            alert('SUCCESS: Vault document unlocked!\n\nDocument Content:\n"WEBFORGE{corp_portal_jwt_secret_revealed_9942}"');
                          } else {
                            logApi('GET', '/api/corp/documents?vault=true', 403, '{"error": "Access Denied. Role executive required"}');
                            alert('403 FORBIDDEN: Your current header is "' + corpRoleHeader + '". Executive privilege required.');
                          }
                        }}
                        className="text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 px-3 py-1.5 rounded-lg shadow-2xs"
                      >
                        Access Archive
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Code className="w-4 h-4 text-indigo-600" />
                    System Debug Metadata
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Test endpoint `/api/corp/system-info` is active for local build diagnostics.
                  </p>
                  <button
                    onClick={() => {
                      logApi('GET', '/api/corp/system-info', 200, JSON.stringify({
                        appName: 'Acme Portal',
                        env: 'production-debug',
                        JWT_SECRET: 'acme_super_secret_key_2026',
                        vaultEndpoint: '/api/corp/documents?vault=true'
                      }, null, 2));
                    }}
                    className="w-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 py-2.5 rounded-xl transition-all"
                  >
                    Query `/api/corp/system-info`
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'bank_dashboard':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-6 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  Apex Global Bank — VIP Client Portal
                </h2>
                <p className="text-xs text-emerald-200/80 mt-1">Logged in as: Alex Vance (Account #ACC-1001)</p>
              </div>
              <div className="text-right bg-emerald-950/60 p-3 rounded-xl border border-emerald-800">
                <span className="text-[11px] text-emerald-300 font-medium block">Current Balance</span>
                <span className="text-lg font-black text-emerald-400">$25,480.00 USD</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Send className="w-4 h-4 text-emerald-600" />
                  Wire Transfer Funds (IDOR Playground)
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">From Account ID (Sender):</label>
                    <input
                      type="text"
                      value={transferFrom}
                      onChange={(e) => setTransferFrom(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Tip: Target Reserve Vault account is <code className="text-emerald-700 font-bold">ACC-9999</code>
                    </span>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">To Account ID (Recipient):</label>
                    <input
                      type="text"
                      value={transferTo}
                      onChange={(e) => setTransferTo(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Amount ($ USD):</label>
                    <input
                      type="text"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (transferFrom === 'ACC-9999') {
                        const receipt = `TRANSFER SUCCESSFUL!\nAmount: $${transferAmount}\nFrom: ACC-9999 (Apex Reserve Vault)\nTo: ${transferTo}\nFlag: WEBFORGE{idor_bank_transfer_ledger_manipulated_7831}`;
                        setTransferResult(receipt);
                        logApi('POST', '/api/bank/transfer', 200, JSON.stringify({ from: transferFrom, to: transferTo, amount: transferAmount, status: 'SUCCESS', flag: 'WEBFORGE{idor_bank_transfer_ledger_manipulated_7831}' }));
                      } else {
                        const receipt = `Transfer completed from ${transferFrom} to ${transferTo} for $${transferAmount}.`;
                        setTransferResult(receipt);
                        logApi('POST', '/api/bank/transfer', 200, JSON.stringify({ from: transferFrom, to: transferTo, amount: transferAmount, status: 'SUCCESS' }));
                      }
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-sm text-xs"
                  >
                    Execute Wire Transfer
                  </button>

                  {transferResult && (
                    <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl whitespace-pre-wrap border border-slate-800">
                      {transferResult}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-slate-800 text-sm">Target Account Ledger</h3>
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="py-2.5 flex justify-between">
                    <span className="font-bold text-slate-800">ACC-1001 (Alex Vance)</span>
                    <span className="text-emerald-600 font-bold">$25,480.00</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="font-bold text-slate-800">ACC-2002 (Sarah Jenkins)</span>
                    <span className="text-slate-600 font-medium">$4,120.00</span>
                  </div>
                  <div className="py-2.5 flex justify-between bg-amber-50/70 p-2 rounded-xl">
                    <span className="font-bold text-amber-900">ACC-9999 (Apex Vault)</span>
                    <span className="text-amber-700 font-black">$5,000,000.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'hospital_system':
        return (
          <div className="space-y-6">
            <div className="bg-sky-900 text-white p-6 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-sky-400" />
                  MedTech Regional Hospital System — Electronic Health Records
                </h2>
                <p className="text-xs text-sky-200/80 mt-1">Doctor Portal & Patient Clinical Summary</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-800 text-sm">Patient Search (SQL Injection Vulnerable)</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter patient name (e.g. Smith or ' OR id=999--)"
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  className="flex-1 p-2.5 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  onClick={() => {
                    const search = patientSearch.trim();
                    logApi('GET', `/api/hospital/patients?search=${encodeURIComponent(search)}`, 200);
                    if (search.includes("' OR id=999--") || search.includes("' OR '1'='1") || search.includes("UNION SELECT")) {
                      setPatientResults([
                        { id: 101, name: 'John Doe', age: 45, condition: 'Hypertension', notes: 'Stable' },
                        { id: 102, name: 'Alice Smith', age: 32, condition: 'Asthma', notes: 'Inhaler prescribed' },
                        { id: 999, name: 'VIP Governor Mark Vance', age: 58, condition: 'CONFIDENTIAL', notes: 'FLAG: WEBFORGE{sqli_hospital_patient_ehr_extracted_8812}' }
                      ]);
                    } else if (search.toLowerCase().includes('smith')) {
                      setPatientResults([{ id: 102, name: 'Alice Smith', age: 32, condition: 'Asthma', notes: 'Inhaler prescribed' }]);
                    } else {
                      setPatientResults([]);
                    }
                  }}
                  className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
                >
                  Search Database
                </button>
              </div>

              {patientResults.length > 0 ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                  {patientResults.map((p) => (
                    <div key={p.id} className="p-3 bg-slate-50 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 text-xs">Patient #{p.id}: {p.name}</span>
                        <p className="text-[11px] text-slate-500">Condition: {p.condition}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-[11px] font-bold text-sky-800 bg-sky-50 px-2 py-1 rounded border border-sky-200">
                          {p.notes}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No patients returned. Try executing a search payload.</p>
              )}
            </div>
          </div>
        );

      case 'learning_management':
        return (
          <div className="space-y-6">
            <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-400" />
                  Forge LMS — Assignment Submission Portal
                </h2>
                <p className="text-xs text-indigo-200/80 mt-1">Course: CS-401 Advanced Software Architecture</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Upload className="w-4 h-4 text-indigo-600" />
                  Submit Assignment Asset (SVG / HTML)
                </h3>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">File Name:</label>
                  <input
                    type="text"
                    value={uploadFileName}
                    onChange={(e) => setUploadFileName(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">File Content:</label>
                  <textarea
                    rows={4}
                    value={uploadContent}
                    onChange={(e) => setUploadContent(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => {
                    logApi('POST', '/api/lms/upload', 200, JSON.stringify({ filename: uploadFileName, content: uploadContent }));
                    setUploadSuccess(true);
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-all"
                >
                  Upload File
                </button>

                {uploadSuccess && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl font-medium flex items-center justify-between">
                    <span>File uploaded successfully! Available in instructor review queue.</span>
                    <button
                      onClick={() => {
                        logApi('POST', '/api/lms/simulate-instructor-review', 200);
                        alert('INSTRUCTOR EVALUATION EXECUTION:\n\nInstructor reviewed payload. XSS Script executed!\n\nFLAG: WEBFORGE{stored_xss_lms_assignment_payload_4410}');
                      }}
                      className="bg-indigo-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg"
                    >
                      Simulate Instructor Review
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <h3 className="font-bold text-slate-800 text-sm">Instructor Submission Queue</h3>
                <p className="text-slate-500">Submitted files are reviewed by the course instructor bot every 30 seconds.</p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px]">
                  <span>Queue Status: ACTIVE</span><br />
                  <span>Submissions Pending: 1</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'ecommerce_platform':
        return (
          <div className="space-y-6">
            <div className="bg-rose-900 text-white p-6 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-rose-400" />
                  ShopMax E-Commerce Store — Checkout
                </h2>
                <p className="text-xs text-rose-200/80 mt-1">Item: High-End Workstation ITEM-99</p>
              </div>
              <span className="text-lg font-black text-rose-300">$2,500.00 USD</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
              <h3 className="font-bold text-slate-800 text-sm">Checkout Request Payload (Price Tampering)</h3>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Item Unit Price ($):</label>
                <input
                  type="text"
                  value={cartPrice}
                  onChange={(e) => setCartPrice(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Original item price is $2500.00. Tamper payload price to $0.01.
                </span>
              </div>

              <button
                onClick={() => {
                  const p = parseFloat(cartPrice);
                  logApi('POST', '/api/ecommerce/checkout', 200, JSON.stringify({ items: [{ id: 'ITEM-99', price: p }] }));
                  if (p < 1.0) {
                    setCheckoutReceipt(`ORDER COMPLETED!\nAmount Charged: $${p.toFixed(2)}\nItem: High-End Workstation ITEM-99\nFlag: WEBFORGE{ecommerce_price_tampered_checkout_success_1029}`);
                  } else {
                    setCheckoutReceipt(`Order completed for standard price $${p.toFixed(2)}. No tampering detected.`);
                  }
                }}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl transition-all shadow-sm"
              >
                Submit Order Checkout
              </button>

              {checkoutReceipt && (
                <div className="p-3 bg-slate-900 text-rose-400 font-mono text-[11px] rounded-xl whitespace-pre-wrap border border-slate-800">
                  {checkoutReceipt}
                </div>
              )}
            </div>
          </div>
        );

      case 'cloud_dashboard':
        return (
          <div className="space-y-6">
            <div className="bg-purple-900 text-white p-6 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-purple-400" />
                  SkyWall Cloud Console — URL Health Inspector (SSRF)
                </h2>
                <p className="text-xs text-purple-200/80 mt-1">AWS EC2 Container Host `i-08a91c28f11`</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
              <h3 className="font-bold text-slate-800 text-sm">Server-Side Request URL Fetcher</h3>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target URL to Fetch:</label>
                <input
                  type="text"
                  value={cloudUrlInput}
                  onChange={(e) => setCloudUrlInput(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                onClick={() => {
                  logApi('POST', '/api/cloud/fetch-url', 200, JSON.stringify({ url: cloudUrlInput }));
                  if (cloudUrlInput.includes('169.254.169.254')) {
                    setCloudFetchResult(
                      JSON.stringify(
                        {
                          Code: 'Success',
                          LastUpdated: '2026-08-08T21:00:00Z',
                          Type: 'AWS-HMAC',
                          AccessKeyId: 'ASIAIOSFODNN7EXAMPLE',
                          SecretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
                          Token: 'WEBFORGE{ssrf_cloud_metadata_iam_keys_compromised_9091}'
                        },
                        null,
                        2
                      )
                    );
                  } else {
                    setCloudFetchResult(`Fetched HTTP 200 OK from ${cloudUrlInput}. Standard HTML body returned.`);
                  }
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all"
              >
                Fetch Remote Response
              </button>

              {cloudFetchResult && (
                <div className="p-3 bg-slate-900 text-purple-300 font-mono text-[11px] rounded-xl whitespace-pre-wrap border border-slate-800">
                  {cloudFetchResult}
                </div>
              )}
            </div>
          </div>
        );

      case 'git_repository':
        return (
          <div className="space-y-6">
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Code className="w-5 h-5 text-amber-400" />
                  CodeForge Git Web Console — Historical Commit Log
                </h2>
                <p className="text-xs text-slate-400 mt-1">Repository: `codeforge/production-backend.git`</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
              <h3 className="font-bold text-slate-800 text-sm">Git Commits Log</h3>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                <div className="p-3 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">Commit #f829a1 — Update README.md</span>
                    <p className="text-[11px] text-slate-500">Committed 2 hours ago by dev@codeforge.local</p>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/80 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-amber-900">Commit #c4a921 — Cleaned up hardcoded config secrets</span>
                    <p className="text-[11px] text-amber-700">Committed 1 day ago by dev@codeforge.local</p>
                  </div>
                  <button
                    onClick={() => {
                      logApi('GET', '/api/git/commit/c4a921', 200);
                      alert(
                        'COMMIT DIFF #c4a921:\n\n- const DB_PASS = "WEBFORGE{exposed_git_commit_history_hardcoded_pass_3301}";\n+ const DB_PASS = process.env.DB_PASS;'
                      );
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                  >
                    View Diff
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'iot_dashboard':
        return (
          <div className="space-y-6">
            <div className="bg-teal-900 text-white p-6 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-teal-400" />
                  SmartGrid IoT Control Center — Network Diagnostic
                </h2>
                <p className="text-xs text-teal-200/80 mt-1">Device: Municipal Solar Inverter Gateway #SG-99</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
              <h3 className="font-bold text-slate-800 text-sm">Ping Diagnostic Utility (Command Injection)</h3>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Host IP:</label>
                <input
                  type="text"
                  value={pingHostInput}
                  onChange={(e) => setPingHostInput(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <button
                onClick={() => {
                  logApi('POST', '/api/iot/ping', 200, JSON.stringify({ host: pingHostInput }));
                  if (pingHostInput.includes('cat /etc/iot_master.key') || pingHostInput.includes(';')) {
                    setPingOutput(
                      `PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.\n64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.04 ms\n\n--- Executing Command Chaining ---\nWEBFORGE{iot_command_injection_ping_diag_pwned_6602}`
                    );
                  } else {
                    setPingOutput(`PING ${pingHostInput}: 2 packets transmitted, 2 received, 0% packet loss.`);
                  }
                }}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-all"
              >
                Execute Ping Diagnostic
              </button>

              {pingOutput && (
                <div className="p-3 bg-slate-900 text-teal-300 font-mono text-[11px] rounded-xl whitespace-pre-wrap border border-slate-800">
                  {pingOutput}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">{getAppTitle()}</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Production portal instance active. Navigate sections, inspect API endpoints, or use the integrated terminal.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="bg-slate-100 rounded-2xl border border-slate-300/80 shadow-md overflow-hidden flex flex-col font-sans">
      {/* Top Browser URL Bar */}
      <div className="bg-slate-200 border-b border-slate-300/80 px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <button className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-600"></button>
          <button className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-600"></button>
          <button className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-600"></button>
        </div>

        <div className="flex-1 max-w-2xl bg-white rounded-xl px-3 py-1.5 border border-slate-300/80 flex items-center gap-2 shadow-2xs font-mono text-[11px] text-slate-700">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-emerald-700 font-bold">https://</span>
          <span className="truncate">{lab.slug}.webforge-app.internal</span>
          <span className="ml-auto text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">
            200 OK
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDevTools(!showDevTools)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all flex items-center gap-1 ${
              showDevTools ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>DevTools</span>
          </button>
        </div>
      </div>

      {/* Main Application Canvas */}
      <div className="p-6 bg-slate-50 min-h-[420px]">{renderAppView()}</div>

      {/* DevTools API Network Inspector Drawer */}
      {showDevTools && (
        <div className="bg-slate-950 text-slate-300 border-t border-slate-800 p-4 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-indigo-400 flex items-center gap-2 text-[11px] uppercase tracking-wider">
              <TerminalIcon className="w-4 h-4 text-indigo-400" />
              DevTools Network API Inspector
            </span>
            <span className="text-[10px] text-slate-500">{apiLogs.length} Requests Logged</span>
          </div>

          <div className="max-h-36 overflow-y-auto divide-y divide-slate-800/80 space-y-1">
            {apiLogs.map((log) => (
              <div key={log.id} className="py-1 flex flex-wrap items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                      log.method === 'GET'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                    }`}
                  >
                    {log.method}
                  </span>
                  <span className="text-slate-200">{log.path}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 text-[10px]">
                  <span className="text-emerald-400">{log.status} OK</span>
                  <span>{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
