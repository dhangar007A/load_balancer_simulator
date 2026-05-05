import { useState, useEffect } from 'react';

function App() {
  const [lbStatus, setLbStatus] = useState(null);
  const [requestCount, setRequestCount] = useState(10);
  const [logs, setLogs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [nodeStats, setNodeStats] = useState({});

  useEffect(() => {
    fetchLbStatus();
  }, []);

  const fetchLbStatus = async () => {
    try {
      const res = await fetch('http://localhost:5000/lb/status');
      const data = await res.json();
      setLbStatus(data);
    } catch (e) {
      console.error("Failed to fetch LB status", e);
    }
  };

  const changeAlgorithm = async (algorithm) => {
    try {
      await fetch('http://localhost:5000/lb/algorithm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm })
      });
      fetchLbStatus();
      setLogs([]);
      setNodeStats({});
    } catch (e) {
      console.error("Failed to change algorithm", e);
    }
  };

  const sendRequests = async () => {
    setIsProcessing(true);
    setLogs([]);
    const stats = {};
    if (lbStatus) {
        lbStatus.backends.forEach(b => stats[b.id] = 0);
    }
    setNodeStats(stats);

    const promises = [];
    for (let i = 0; i < requestCount; i++) {
      // Small delay to prevent network stack overwhelm on client side
      const p = new Promise(resolve => setTimeout(resolve, i * 10))
        .then(() => fetch('http://localhost:5000/api/process'))
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setLogs(prev => [{ id: i, node: data.nodeId, time: data.processingTimeMs }, ...prev]);
                setNodeStats(prev => ({
                    ...prev,
                    [data.nodeId]: (prev[data.nodeId] || 0) + 1
                }));
            }
        }).catch(err => console.error(err));
      promises.push(p);
    }

    await Promise.all(promises);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-cyan-500 selection:text-white p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600 tracking-tight">
                    OmniBalance Dashboard
                </h1>
                <p className="text-gray-400 mt-2">Cloud Computing Load Balancer Visualizer</p>
            </div>
            {lbStatus && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex gap-4 items-center shadow-2xl">
                    <span className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Active Algorithm</span>
                    <select 
                        className="bg-gray-800 border border-gray-700 text-cyan-400 font-semibold rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                        value={lbStatus.algorithm}
                        onChange={(e) => changeAlgorithm(e.target.value)}
                    >
                        <option value="RoundRobin">Round Robin</option>
                        <option value="Random">Random</option>
                    </select>
                </div>
            )}
        </div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lbStatus?.backends.map((backend) => {
                const count = nodeStats[backend.id] || 0;
                const total = logs.length || 1;
                const percentage = Math.round((count / total) * 100);

                return (
                    <div key={backend.id} className="relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 p-6 flex flex-col items-center justify-center group hover:border-cyan-500 transition-colors">
                        <div className="absolute top-0 right-0 p-4">
                            <span className="flex h-3 w-3 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-200">{backend.id}</h2>
                        <p className="text-sm text-gray-500 mb-6">{backend.url}</p>
                        
                        <div className="text-5xl font-black text-cyan-400 mb-2">{count}</div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Requests Handled</p>
                        
                        <div className="w-full bg-gray-800 rounded-full h-2">
                            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <div className="text-xs text-gray-400 mt-2 self-end">{percentage}% Load</div>
                    </div>
                )
            })}
        </div>

        {/* Control Panel */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <span className="text-gray-300 font-medium">Batch Size:</span>
                <input 
                    type="range" 
                    min="10" 
                    max="500" 
                    step="10" 
                    value={requestCount} 
                    onChange={(e) => setRequestCount(Number(e.target.value))}
                    className="w-48 accent-cyan-500"
                />
                <span className="text-2xl font-bold text-white w-12">{requestCount}</span>
            </div>
            
            <button 
                onClick={sendRequests}
                disabled={isProcessing}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
                {isProcessing ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Simulating Load...
                    </>
                ) : (
                    'Fire Requests'
                )}
            </button>
        </div>

        {/* Live Logs */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Live Request Logs
            </h3>
            <div className="h-64 overflow-y-auto font-mono text-sm space-y-2 pr-2 custom-scrollbar">
                {logs.length === 0 && <div className="text-gray-600 text-center py-10">No recent logs. Fire requests to see traffic.</div>}
                {logs.map((log, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-950 p-3 rounded-lg border border-gray-800/50">
                        <span className="text-gray-400">Request #{log.id}</span>
                        <span className="text-cyan-400 font-bold">{log.node}</span>
                        <span className="text-green-400">{log.time}ms</span>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  )
}

export default App
