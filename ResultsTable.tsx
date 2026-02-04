import React from 'react';
import { RecommendationResult } from '../types';

interface ResultsTableProps {
  results: RecommendationResult[];
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  if (results.length === 0) return null;

  return (
    <div className="glass-panel rounded-3xl shadow-xl border border-white/50 overflow-hidden animate-fade-in-up">
      <div className="p-8 border-b border-brand-blue/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/20">
        <div>
          <h2 className="text-2xl font-display font-bold text-brand-blue">Your Recommendations</h2>
          <p className="text-sm text-brand-grey mt-1">Curated selections based on your unique profile.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-brand-blue/5">
          <thead className="bg-white/30">
            <tr>
              <th scope="col" className="px-8 py-5 text-left text-xs font-bold text-brand-blue/60 uppercase tracking-wider">Profile</th>
              <th scope="col" className="px-8 py-5 text-left text-xs font-bold text-brand-blue/60 uppercase tracking-wider">Top Pick</th>
              <th scope="col" className="px-8 py-5 text-left text-xs font-bold text-brand-blue/60 uppercase tracking-wider">Alternative Pick</th>
              <th scope="col" className="px-8 py-5 text-left text-xs font-bold text-brand-blue/60 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-blue/5">
            {results.map((result, idx) => (
              <tr key={idx} className="hover:bg-white/40 transition-colors duration-200">
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-white shadow-sm border border-white flex items-center justify-center text-brand-blue font-display font-bold text-lg">
                      {result.user.firstName.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-base font-semibold text-brand-blue">{result.user.firstName}</div>
                      <div className="text-xs text-brand-grey/80">{result.user.email}</div>
                    </div>
                  </div>
                </td>
                
                {/* Item 1 */}
                <td className="px-8 py-6">
                  {result.recommendations[0] ? (
                    <div className="flex items-start gap-4 group">
                      <div className="relative overflow-hidden rounded-xl border border-white shadow-sm h-16 w-16">
                         <img src={result.recommendations[0].imageUrl} alt="Rec 1" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <div>
                         <div className="text-sm font-bold text-brand-blue">{result.recommendations[0].brand}</div>
                         <div className="text-xs text-brand-grey truncate max-w-[150px] mt-0.5">{result.recommendations[0].originalName}</div>
                         <a href={result.recommendations[0].itemUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-xs text-brand-blue font-bold hover:text-brand-yellow mt-2 transition-colors">
                            Shop Now 
                            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                         </a>
                      </div>
                    </div>
                  ) : <span className="text-sm text-brand-grey italic">No match found</span>}
                </td>

                {/* Item 2 */}
                <td className="px-8 py-6">
                  {result.recommendations[1] ? (
                    <div className="flex items-start gap-4 group">
                       <div className="relative overflow-hidden rounded-xl border border-white shadow-sm h-16 w-16">
                        <img src={result.recommendations[1].imageUrl} alt="Rec 2" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <div>
                         <div className="text-sm font-bold text-brand-blue">{result.recommendations[1].brand}</div>
                         <div className="text-xs text-brand-grey truncate max-w-[150px] mt-0.5">{result.recommendations[1].originalName}</div>
                         <a href={result.recommendations[1].itemUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-xs text-brand-blue font-bold hover:text-brand-yellow mt-2 transition-colors">
                            Shop Now 
                            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                         </a>
                      </div>
                    </div>
                  ) : <span className="text-sm text-brand-grey italic">No match found</span>}
                </td>

                <td className="px-8 py-6 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-brand-yellow/20 text-brand-blue border border-brand-yellow/20">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};