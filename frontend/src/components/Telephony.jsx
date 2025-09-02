import { useState } from "react";
import callsData from "../data/calls.json";

export default function Telephony() {
  const [calls, setCalls] = useState(callsData);
  const [incoming, setIncoming] = useState(null);

  const simulateIncoming = () => {
    const call = { id: Date.now(), name: "Anna Kumar", number: "+91 98765 43210", type: "incoming", time: new Date() };
    setIncoming(call);
    setTimeout(() => {
      setIncoming(null);
    }, 10000);
  };

  const answer = (call) => {
    setCalls((c) => [{ ...call, type: "answered" }, ...c]);
    setIncoming(null);
  };

  const reject = (call) => {
    setCalls((c) => [{ ...call, type: "rejected" }, ...c]);
    setIncoming(null);
  };

  return (
    <div className="glass-panel text-white p-4 rounded-lg relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Telephony</h2>
        <button
          onClick={simulateIncoming}
          className="px-3 py-1 rounded-lg text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 transition"
        >
          Simulate Call
        </button>
      </div>

      <div className="space-y-2 max-h-40 overflow-auto pr-1">
        {calls.map((c) => (
          <div
            key={c.id}
            className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
          >
            <div>
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-gray-300">{c.number} • {c.type}</div>
            </div>
            <div className="text-xs text-gray-400">
              {new Date(c.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        ))}
      </div>

      {incoming && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white/10 backdrop-blur-xl text-white p-6 rounded-2xl shadow-lg w-80 border border-white/20">
            <div className="text-lg font-semibold">📞 Incoming Call</div>
            <div className="mt-2 text-xl">{incoming.name}</div>
            <div className="text-sm text-gray-300">{incoming.number}</div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => answer(incoming)}
                className="flex-1 py-2 rounded-lg bg-green-500 hover:bg-green-400 transition"
              >
                Answer
              </button>
              <button
                onClick={() => reject(incoming)}
                className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-400 transition"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
