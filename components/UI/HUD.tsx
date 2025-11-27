import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { connectToCOTIPlaceholder } from '../../services/future-blockchain-hooks/cotiService';
import { Coins, Info, Terminal } from 'lucide-react';

export const HUD: React.FC = () => {
  const balance = useGameStore((state) => state.balance);
  const logs = useGameStore((state) => state.logs);
  const addLog = useGameStore((state) => state.addLog);

  useEffect(() => {
    // Simulate initial connection
    connectToCOTIPlaceholder().then(() => {
        addLog("Connected to COTI Network (Simulated)", "success");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
      
      {/* Top Bar */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="bg-gray-900/80 border border-gray-700 backdrop-blur-md p-4 rounded-lg shadow-xl text-white">
          <h1 className="text-xl font-bold mb-1 text-blue-400">COTI Realms</h1>
          <p className="text-xs text-gray-400">Prototype v0.1</p>
        </div>

        <div className="bg-gray-900/80 border border-yellow-600/50 backdrop-blur-md p-4 rounded-lg shadow-xl text-white flex items-center gap-3">
            <div className="bg-yellow-500/20 p-2 rounded-full">
                <Coins className="text-yellow-400 w-6 h-6" />
            </div>
            <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Balance (Placeholder)</p>
                <p className="text-2xl font-mono font-bold text-yellow-400">{balance.toLocaleString()}</p>
            </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-end pointer-events-auto">
        
        {/* Event Log */}
        <div className="w-96 bg-gray-900/80 border border-gray-700 backdrop-blur-md rounded-lg overflow-hidden shadow-xl">
            <div className="bg-gray-800/80 px-4 py-2 border-b border-gray-700 flex items-center gap-2">
                <Terminal size={14} className="text-gray-400"/>
                <span className="text-xs font-semibold text-gray-300 uppercase">System Log</span>
            </div>
            <div className="p-3 flex flex-col gap-2 max-h-48 overflow-y-auto">
                {logs.map((log) => (
                    <div key={log.id} className="text-sm border-l-2 pl-2 animate-in fade-in slide-in-from-left-2 duration-300" 
                        style={{
                            borderColor: log.type === 'success' ? '#10b981' : log.type === 'warning' ? '#f59e0b' : '#3b82f6'
                        }}>
                        <span className="text-gray-500 text-xs mr-2">[{log.timestamp.toLocaleTimeString()}]</span>
                        <span className={
                            log.type === 'success' ? 'text-green-400' : 
                            log.type === 'warning' ? 'text-yellow-400' : 
                            'text-blue-300'
                        }>{log.text}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-900/80 border border-gray-700 backdrop-blur-md p-4 rounded-lg shadow-xl text-white max-w-sm">
             <div className="flex items-start gap-3">
                <Info className="text-blue-400 shrink-0 mt-1" />
                <div className="text-sm text-gray-300">
                    <p className="mb-2"><strong className="text-white">Controls:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Click ground to move.</li>
                        <li>Click gold chests when close to open.</li>
                        <li>Scroll to zoom (not implemented in this cam config).</li>
                    </ul>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};