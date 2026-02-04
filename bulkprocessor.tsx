import React, { useState } from 'react';
import { UserProfile, CatalogItem, RecommendationResult, RecommendationContext } from '../types';
import { parseUserCSV, parseCatalogCSV } from '../services/csvService';
import { extractKeywordsFromSaves } from '../services/geminiService';
import { generateRecommendations } from '../services/recommendationService';

interface BulkProcessorProps {
  onResultsGenerated: (results: RecommendationResult[]) => void;
}

export const BulkProcessor: React.FC<BulkProcessorProps> = ({ onResultsGenerated }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [logs, setLogs] = useState<string[]>([]);
  
  const processBatch = async () => {
    if (users.length === 0) {
      alert("Please upload a User Data CSV first.");
      return;
    }

    setIsProcessing(true);
    setLogs([]);
    const results: RecommendationResult[] = [];
    setProgress({ current: 0, total: users.length });

    // Initialize Inventory Stats Context
    const context: RecommendationContext = {
      brandUsage: {},
      itemUsage: {},
      totalBatchSize: users.length
    };

    // Iterate through users
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      try {
        setLogs(prev => [`Analysing Profile: ${user.firstName} (${user.email})...`, ...prev].slice(0, 5));
        
        // 1. Extract keywords (Using Gemini)
        // Rate limit protection: small delay
        await new Promise(r => setTimeout(r, 100)); 
        const keywords = await extractKeywordsFromSaves(user.saves);
        
        // 2. Generate Recs with Context (Enforces "Sold Out" logic)
        const result = generateRecommendations(user, keywords, catalog, context);
        results.push(result);

      } catch (error) {
        console.error(`Error processing user ${user.email}`, error);
        setLogs(prev => [`Error: ${user.email} - ${error}`, ...prev]);
        results.push({ user, recommendations: [] });
      }
      
      setProgress({ current: i + 1, total: users.length });
    }

    setIsProcessing(false);
    onResultsGenerated(results);
    
    // Calculate Stats
    const totalSoldOutItems = Object.values(context.itemUsage).filter(count => count >= 3).length;
    const uniqueBrandsUsed = Object.keys(context.brandUsage).length;
    
    setLogs(prev => [
      `Completed!`,
      `Unique Brands Used: ${uniqueBrandsUsed}`,
      `Items Marked 'Sold Out' (Max 3 uses): ${totalSoldOutItems}`,
      ...prev
    ]);
  };

  const handleUserUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      try {
        const parsedUsers = await parseUserCSV(e.target.files[0]);
        setUsers(parsedUsers);
        setLogs(prev => [`Parsed and deduplicated into ${parsedUsers.length} unique profiles.`, ...prev]);
      } catch (err) {
        alert("Error parsing User CSV");
      }
    }
  };

  const handleCatalogUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      try {
        const parsedCatalog = await parseCatalogCSV(e.target.files[0]);
        setCatalog(parsedCatalog);
        setLogs(prev => [`Loaded ${parsedCatalog.length} items from catalog.`, ...prev]);
      } catch (err) {
        alert("Error parsing Catalog CSV");
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
        Mass Recommendation Engine
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* User Data Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors relative">
           <div className="absolute top-2 right-2 text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">Step 1</div>
          <div className="text-indigo-600 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900">Upload User Sheet</h3>
          <p className="text-xs text-gray-500 mb-4">Combines saves by Email automatically.</p>
          <input 
            type="file" 
            accept=".csv"
            onChange={handleUserUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
          {users.length > 0 && (
            <div className="mt-3 bg-indigo-50 p-2 rounded text-indigo-800 text-sm font-medium">
               ✓ {users.length} Unique Profiles Ready
            </div>
          )}
        </div>

        {/* Catalog Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors relative">
           <div className="absolute top-2 right-2 text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">Step 2</div>
          <div className="text-pink-600 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900">Upload Catalog Sheet</h3>
          <p className="text-xs text-gray-500 mb-4">AWIN, Rakuten, & Partner Feeds</p>
          <input 
            type="file" 
            accept=".csv"
            onChange={handleCatalogUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-pink-50 file:text-pink-700
              hover:file:bg-pink-100"
          />
          {catalog.length > 0 ? (
            <div className="mt-3 bg-pink-50 p-2 rounded text-pink-800 text-sm font-medium">
               ✓ {catalog.length} Catalog Items Loaded
            </div>
          ) : (
             <div className="mt-3 text-gray-400 text-xs italic">
               Waiting for upload...
            </div>
          )}
        </div>

      </div>

      {/* Actions */}
      <div className="mt-8 border-t border-gray-100 pt-6">
        {isProcessing ? (
          <div className="w-full">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-indigo-700">Analysing Profiles & Matching...</span>
              <span className="text-sm font-medium text-indigo-700">{Math.round((progress.current / progress.total) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${(progress.current / progress.total) * 100}%` }}></div>
            </div>
            <div className="mt-4 bg-gray-900 text-green-400 font-mono text-xs p-3 rounded h-24 overflow-hidden flex flex-col-reverse">
               {logs.map((log, i) => <div key={i}>{log}</div>)}
            </div>
          </div>
        ) : (
          <button
            onClick={processBatch}
            disabled={users.length === 0}
            className={`w-full py-4 px-6 rounded-lg text-white font-bold text-lg shadow-md transition-all 
              ${users.length === 0 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg transform hover:-translate-y-0.5'}`}
          >
            Generate Recommendations CSV
          </button>
        )}
      </div>
    </div>
  );
};
