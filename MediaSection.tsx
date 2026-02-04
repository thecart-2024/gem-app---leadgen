import React, { useState, useEffect } from 'react';
import { getMedia } from '../services/storageService';

// Updated to absolute paths. 
// If your files are in the root directory, starting with '/' ensures the browser looks at the root domain.
const LOGO_PATH = "/logo.png";
const BANNER_PATH = "/banner.png";

const DEFAULT_VIDEOS = [
  "/julian.mp4", 
  "/sophie.mp4",
  "/izzy.mp4"
];

export const MediaSection: React.FC = () => {
  const [videoUrls, setVideoUrls] = useState<string[]>(DEFAULT_VIDEOS);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadVideos = async () => {
      const v1 = await getMedia('video1');
      const v2 = await getMedia('video2');
      const v3 = await getMedia('video3');
      
      const newUrls = [...DEFAULT_VIDEOS];
      
      if (v1) newUrls[0] = v1;
      if (v2) newUrls[1] = v2;
      if (v3) newUrls[2] = v3;
      
      setVideoUrls(newUrls);
    };
    loadVideos();
  }, []);

  const handleMediaError = (id: string, index?: number) => {
    // Prevent console spam if already errored
    if (errors[id]) return;

    console.warn(`Media failed to load: ${id}`);
    
    // Fallback Logic:
    if (typeof index === 'number') {
        const currentUrl = videoUrls[index];
        const defaultUrl = DEFAULT_VIDEOS[index];
        
        // If we are on a custom URL, revert to default
        if (currentUrl !== defaultUrl) {
            console.log(`Reverting video ${index} to default`);
            setVideoUrls(prev => {
                const updated = [...prev];
                updated[index] = defaultUrl;
                return updated;
            });
            return;
        }
    }

    setErrors(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="mt-10 mb-12 animate-fade-in-up px-4">
      {/* --- LOGO SECTION --- */}
      <div className="flex justify-center mb-8">
        {!errors['logo'] ? (
          <img 
            src={LOGO_PATH} 
            alt="TheCart Logo" 
            className="h-16 w-auto object-contain"
            onError={() => handleMediaError('logo')}
          />
        ) : (
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-10 h-10 rounded-lg bg-brand-yellow/20 flex items-center justify-center text-brand-blue shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </div>
            <span className="font-display font-bold text-2xl text-brand-blue tracking-tight">TheCart</span>
          </div>
        )}
      </div>

      {/* --- MARKETING BANNER --- */}
      <div className="max-w-4xl mx-auto mb-16 rounded-3xl overflow-hidden shadow-2xl border border-white/20">
        {!errors['banner'] ? (
          <img 
            src={BANNER_PATH} 
            alt="Marketing Campaign" 
            className="w-full h-auto object-cover"
            onError={() => handleMediaError('banner')}
          />
        ) : (
           <div className="relative w-full h-64 bg-brand-blue/5 flex items-center justify-center">
              <div className="text-center p-8">
                  <p className="text-brand-blue font-display font-bold text-xl">Discover Your Style</p>
                  <p className="text-brand-grey text-sm mt-2">Personalised recommendations powered by AI</p>
              </div>
           </div>
        )}
      </div>

      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-brand-blue mb-4">
          Experience TheCart
        </h2>
        <p className="text-brand-grey max-w-2xl mx-auto text-lg font-light">
          See how our community is using the app to discover their unique style.
        </p>
      </div>

      {/* --- VIDEO GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {videoUrls.map((src, idx) => (
          <div key={idx} className="glass-panel p-4 rounded-3xl shadow-xl flex flex-col items-center transition-transform hover:-translate-y-1 duration-300 border border-white/60">
             <div className="relative w-full aspect-[9/16] bg-brand-blue/5 rounded-2xl overflow-hidden mb-0 border border-white shadow-inner flex items-center justify-center">
                {!errors[`video-${idx}`] ? (
                    <video 
                      src={src} 
                      className="w-full h-full object-cover" 
                      playsInline
                      autoPlay
                      muted
                      loop
                      onError={() => handleMediaError(`video-${idx}`, idx)}
                    />
                ) : (
                    <div className="text-center p-6 opacity-60">
                         <div className="w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        </div>
                        <p className="text-xs font-medium text-brand-blue">Video Not Found</p>
                        <p className="text-[10px] text-brand-grey mt-1 break-all px-2 overflow-hidden">{src}</p>
                    </div>
                )}
             </div>
             <div className="mt-3 text-sm font-bold text-brand-blue/80">
                {idx === 0 && "Julian"}
                {idx === 1 && "Sophie"}
                {idx === 2 && "Izzy"}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};