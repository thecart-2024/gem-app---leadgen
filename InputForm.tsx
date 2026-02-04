import React, { useState } from 'react';
import { StyleArchetype, UserProfile } from '../types';

interface InputFormProps {
  onRecommend: (profile: UserProfile) => void;
  isLoading: boolean;
}

const AGE_RANGES = [
  'Under 18',
  '18–24',
  '25–30',
  '31–40',
  '41–50',
  '51–60',
  '60+'
];

export const InputForm: React.FC<InputFormProps> = ({ onRecommend, isLoading }) => {
  const [profile, setProfile] = useState<UserProfile>({
    email: '',
    firstName: '',
    gender: 'Female',
    styleArchetype: StyleArchetype.CASUAL,
    saves: '',
    ageRange: '25–30',
    marketingConsent: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRecommend(profile);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;

    setProfile(prev => ({
      ...prev,
      [target.name]: value
    }));
  };

  const inputClass = "w-full px-5 py-3 bg-white/50 border border-transparent rounded-xl focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow/50 transition-all outline-none text-brand-blue placeholder-brand-grey/60 shadow-inner";
  const labelClass = "block text-sm font-semibold text-brand-blue mb-2 ml-1";

  return (
    <div className="glass-panel p-8 rounded-3xl shadow-xl mb-12 relative overflow-hidden">
      {/* Subtle top sheen */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-50"></div>

      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-full bg-brand-yellow flex items-center justify-center text-brand-blue shadow-lg shadow-brand-yellow/30">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-2xl font-display font-bold text-brand-blue">
          Your Profile
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>First Name</label>
            <input
              type="text"
              name="firstName"
              required
              className={inputClass}
              placeholder="e.g. Jane"
              value={profile.firstName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              name="email"
              required
              className={inputClass}
              placeholder="jane@example.com"
              value={profile.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>Gender</label>
            <div className="relative">
              <select
                name="gender"
                className={`${inputClass} appearance-none`}
                value={profile.gender}
                onChange={handleChange}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-blue">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
          <div>
            <label className={labelClass}>Age Range</label>
            <div className="relative">
              <select
                name="ageRange"
                className={`${inputClass} appearance-none`}
                value={profile.ageRange}
                onChange={handleChange}
              >
                {AGE_RANGES.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-blue">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
          <div>
            <label className={labelClass}>Style Preference</label>
            <div className="relative">
              <select
                name="styleArchetype"
                className={`${inputClass} appearance-none`}
                value={profile.styleArchetype}
                onChange={handleChange}
              >
                {Object.values(StyleArchetype).map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-blue">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass}>
            Tell us what you're looking for
          </label>
          <textarea
            name="saves"
            rows={3}
            className={`${inputClass} resize-none`}
            placeholder="e.g., Looking for a green midi dress for a garden party. Loves sustainable fabrics."
            value={profile.saves}
            onChange={handleChange}
          />
        </div>
        
        <div className="flex items-start gap-3 pt-2 px-1">
          <div className="flex items-center h-6">
            <input
              id="marketingConsent"
              name="marketingConsent"
              type="checkbox"
              className="h-5 w-5 text-brand-yellow border-brand-grey/30 rounded focus:ring-brand-yellow bg-white/50"
              checked={profile.marketingConsent || false}
              onChange={handleChange}
            />
          </div>
          <div className="text-sm leading-snug">
            <label htmlFor="marketingConsent" className="font-medium text-brand-blue/80 cursor-pointer select-none">
              I'm happy for my recommendations to be sent directly to my email and to be added to email lists for future personalised recommendations and discounts
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-8 rounded-xl font-bold text-lg shadow-lg shadow-brand-yellow/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0
            ${isLoading 
              ? 'bg-brand-grey/20 text-brand-grey cursor-not-allowed' 
              : 'bg-brand-yellow text-brand-blue hover:bg-[#ffc933] hover:shadow-xl'
            }
          `}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Thinking...
            </span>
          ) : (
            'Generate Recommendation'
          )}
        </button>
      </form>
    </div>
  );
};