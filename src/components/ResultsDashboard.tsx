"use client";
import { AlertCircle, ArrowLeft, ShieldAlert } from "lucide-react";

export default function ResultsDashboard({ data, onReset }: { data: any, onReset: () => void }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <button onClick={onReset} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Search
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Health Score */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
          <h3 className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-4">Confidence Score</h3>
          <div className="w-32 h-32 rounded-full border-4 border-emerald-500/20 flex items-center justify-center border-t-emerald-500">
             <span className="text-4xl font-bold text-emerald-400">{data?.score || 0}</span>
          </div>
        </div>

        {/* Findings List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShieldAlert className="text-orange-500" /> Security Insights
          </h2>
          {data?.findings?.map((item: any, index: number) => (
            <div key={index} className={`bg-gray-900 border-l-4 p-4 rounded-r-lg ${
              item.severity === "High" ? "border-l-red-500" : "border-l-orange-500"
            }`}>
              <h4 className="font-semibold">{item.issue}</h4>
              <p className="text-sm text-gray-400">File: {item.file}</p>
              <p className="text-xs text-gray-500 mt-2 italic">{item.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}