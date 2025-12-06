
import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Wand2, 
  Copy, 
  Sparkles, 
  Target, 
  MessageSquare, 
  Share2,
  RefreshCw,
  AlertCircle,
  BrainCircuit,
  Globe,
  Settings,
  X,
  Save,
  Key,
  Check
} from 'lucide-react';
import { type FormState, Tone, Platform, Framework, Language, AiProvider } from './types';
import { GENRE_OPTIONS, TONE_OPTIONS, PLATFORM_OPTIONS, FRAMEWORK_OPTIONS, LANGUAGE_OPTIONS, PLATFORM_FRAMEWORK_PRIORITY } from './constants';
import { TextInput, SelectInput, TextArea } from './components/InputFields';
import { buildPrompt } from './components/PromptBuilder';
import { generateMarketingCopy } from './services/geminiService';
import { generateMarketingCopyOpenAI } from './services/openaiService';

const App: React.FC = () => {
  // Initial sort for default platform
  const initialPlatform = PLATFORM_OPTIONS[0] as Platform;
  const initialSortedFrameworks = PLATFORM_FRAMEWORK_PRIORITY[initialPlatform] || FRAMEWORK_OPTIONS;

  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeys, setApiKeys] = useState<{ gemini: string; openai: string }>({ gemini: '', openai: '' });
  const [selectedProvider, setSelectedProvider] = useState<AiProvider>(AiProvider.GEMINI);

  // Form State
  const [formData, setFormData] = useState<FormState>({
    gameName: '',
    genre: GENRE_OPTIONS[0],
    tone: TONE_OPTIONS[0] as Tone,
    platform: initialPlatform,
    framework: initialSortedFrameworks[0] as Framework,
    language: LANGUAGE_OPTIONS[0] as Language,
    usps: [''],
    competitorReferences: '',
    keywords: '',
    rawDescription: '',
    customPrompt: ''
  });

  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPromptCopied, setIsPromptCopied] = useState(false);

  // Derived state for sorting frameworks based on current platform
  const sortedFrameworkOptions = PLATFORM_FRAMEWORK_PRIORITY[formData.platform] || FRAMEWORK_OPTIONS;

  // Effects
  useEffect(() => {
    // Live update the prompt as user types
    const prompt = buildPrompt(formData);
    setGeneratedPrompt(prompt);
  }, [formData]);

  // Load Settings from LocalStorage
  useEffect(() => {
    const savedGeminiKey = localStorage.getItem('gemini_api_key');
    const savedOpenAIKey = localStorage.getItem('openai_api_key');
    const savedProvider = localStorage.getItem('selected_provider');

    setApiKeys({
      gemini: savedGeminiKey || '',
      openai: savedOpenAIKey || ''
    });

    if (savedProvider && Object.values(AiProvider).includes(savedProvider as AiProvider)) {
      setSelectedProvider(savedProvider as AiProvider);
    }
  }, []);

  // Handlers
  const handleInputChange = (field: keyof FormState, value: any) => {
    setFormData((prev) => {
      const newState = { ...prev, [field]: value };
      
      // If platform changes, auto-select the #1 ranked framework for that platform
      if (field === 'platform') {
        const newPlatform = value as Platform;
        const newFrameworks = PLATFORM_FRAMEWORK_PRIORITY[newPlatform];
        if (newFrameworks && newFrameworks.length > 0) {
          newState.framework = newFrameworks[0];
        }
      }
      return newState;
    });
  };

  const handleUspChange = (index: number, value: string) => {
    const newUsps = [...formData.usps];
    newUsps[index] = value;
    setFormData((prev) => ({ ...prev, usps: newUsps }));
  };

  const addUsp = () => {
    setFormData((prev) => ({ ...prev, usps: [...prev.usps, ''] }));
  };

  const removeUsp = (index: number) => {
    const newUsps = formData.usps.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, usps: newUsps.length ? newUsps : [''] }));
  };

  const saveSettings = () => {
    localStorage.setItem('gemini_api_key', apiKeys.gemini);
    localStorage.setItem('openai_api_key', apiKeys.openai);
    setShowSettings(false);
  };

  const handleProviderChange = (provider: AiProvider) => {
    setSelectedProvider(provider);
    localStorage.setItem('selected_provider', provider);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setAiOutput(null);

    try {
      let result = '';

      if (selectedProvider === AiProvider.GEMINI) {
        // Use local key if available, otherwise relies on env in service
        const keyToUse = apiKeys.gemini; 
        // Note: Service will throw if no key is found in either local state or process.env
        result = await generateMarketingCopy(generatedPrompt, keyToUse);
      } else if (selectedProvider === AiProvider.OPENAI) {
        if (!apiKeys.openai) {
          throw new Error("OpenAI API Key is missing. Please add it in Settings.");
        }
        result = await generateMarketingCopyOpenAI(generatedPrompt, apiKeys.openai);
      }

      setAiOutput(result);
    } catch (err: any) {
      setError(err.message || "Failed to generate copy");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setIsPromptCopied(true);
    setTimeout(() => setIsPromptCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-gaming-500 selection:text-white pb-20 relative">
      
      {/* Settings Modal Overlay */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings size={20} className="text-gaming-500" />
                API Settings
              </h2>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <Key size={16} className="text-blue-400" />
                  Google Gemini API Key
                </label>
                <input
                  type="password"
                  value={apiKeys.gemini}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, gemini: e.target.value }))}
                  placeholder="Paste your Gemini API Key..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
                />
                <p className="text-xs text-slate-500">
                  Required to use Gemini models. Stored locally in your browser.
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <Key size={16} className="text-green-400" />
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  value={apiKeys.openai}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, openai: e.target.value }))}
                  placeholder="sk-..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
                />
                <p className="text-xs text-slate-500">
                  Required to use ChatGPT (GPT-4o). Stored locally in your browser.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 flex justify-end">
              <button 
                onClick={saveSettings}
                className="flex items-center gap-2 bg-gaming-600 hover:bg-gaming-500 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-lg shadow-gaming-900/20"
              >
                <Save size={18} />
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gaming-600 p-2 rounded-lg">
              <Gamepad2 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                GameCopy Genius
              </h1>
              <p className="text-xs text-gaming-400 font-medium tracking-wide">AI MARKETING TOOLKIT</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
             <button 
               onClick={() => setShowSettings(true)}
               className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-lg transition-colors border border-slate-700"
             >
               <Settings size={16} />
               <span className="hidden sm:inline">Settings</span>
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* SECTION 1: Strategy & Format (Top Priority) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
            <Share2 size={20} className="text-gaming-500" />
            1. Strategy & Format
          </h2>

          <div className="space-y-6">
            <SelectInput 
              label="Copywriting Framework" 
              options={sortedFrameworkOptions}
              icon={BrainCircuit}
              value={formData.framework}
              onChange={(e) => handleInputChange('framework', e.target.value)}
            />
            
            <SelectInput 
              label="Platform / Output" 
              options={PLATFORM_OPTIONS}
              value={formData.platform}
              onChange={(e) => handleInputChange('platform', e.target.value)}
            />
          </div>

          <div className="pt-2">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                Custom Instructions (Optional)
              </label>
              <span className={`text-xs ${
                (formData.customPrompt?.length || 0) > 1000 ? 'text-red-400' : 'text-slate-500'
              }`}>
                {formData.customPrompt?.length || 0}/1024
              </span>
            </div>
            <textarea
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-gaming-500 focus:border-transparent outline-none transition-all placeholder-slate-500 min-h-[80px]"
              value={formData.customPrompt || ''}
              onChange={(e) => {
                if (e.target.value.length <= 1024) {
                  handleInputChange('customPrompt', e.target.value);
                }
              }}
              placeholder="Add specific rules, banned words, or extra context..."
              maxLength={1024}
            />
          </div>
        </div>

        {/* SECTION 2: Core Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
            <Target size={20} className="text-gaming-500" />
            2. Core Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput 
              label="Game Name" 
              value={formData.gameName} 
              onChange={(e) => handleInputChange('gameName', e.target.value)} 
              placeholder="e.g. Cyber Blades 2077"
            />
            <SelectInput 
              label="Target Language" 
              options={LANGUAGE_OPTIONS}
              icon={Globe}
              value={formData.language}
              onChange={(e) => handleInputChange('language', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectInput 
              label="Genre" 
              options={GENRE_OPTIONS}
              value={formData.genre}
              onChange={(e) => handleInputChange('genre', e.target.value)}
            />
            <SelectInput 
              label="Tone" 
              options={TONE_OPTIONS}
              icon={MessageSquare}
              value={formData.tone}
              onChange={(e) => handleInputChange('tone', e.target.value)}
            />
          </div>

          <div className="pb-2">
            <TextArea
              label="Keywords / SEO (Optional)" 
              value={formData.keywords || ''}
              onChange={(e) => handleInputChange('keywords', e.target.value)}
              placeholder="Enter keywords to include (one per line)..."
            />
            <p className="text-xs text-slate-500 mt-1">These keywords will be included with natural density in the copy.</p>
          </div>

          <TextArea 
            label="Raw Game Description / Fact Sheet"
            value={formData.rawDescription || ''}
            onChange={(e) => handleInputChange('rawDescription', e.target.value)}
            placeholder="Paste game mechanics, patch notes, or rough ideas here. The AI will extract facts from this text."
            className="h-72 font-mono text-sm" // Increased height
          />

           <TextInput 
            label="Competitor References (Vibe)" 
            value={formData.competitorReferences || ''} 
            onChange={(e) => handleInputChange('competitorReferences', e.target.value)} 
            placeholder="e.g. Stardew Valley meets Dark Souls"
          />

          <div className="pt-2">
            <label className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-2">
              <StarIcon /> Key Selling Points (USPs)
            </label>
            <div className="space-y-3">
              {formData.usps.map((usp, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-gaming-500 outline-none"
                    value={usp}
                    onChange={(e) => handleUspChange(idx, e.target.value)}
                    placeholder={`Feature #${idx + 1}`}
                  />
                  <button 
                    onClick={() => removeUsp(idx)}
                    className="text-slate-500 hover:text-red-400 p-2"
                    disabled={formData.usps.length === 1}
                  >
                    &times;
                  </button>
                </div>
              ))}
              <button 
                onClick={addUsp}
                className="text-xs text-gaming-400 hover:text-gaming-300 font-medium pl-1"
              >
                + Add another feature
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 3: Output & Actions */}
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <label className="text-sm font-medium text-slate-400 whitespace-nowrap">AI Provider:</label>
              <div className="flex gap-2 w-full md:w-auto">
                <button 
                  onClick={() => handleProviderChange(AiProvider.GEMINI)}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm transition-colors border ${
                    selectedProvider === AiProvider.GEMINI 
                    ? 'bg-blue-600/20 border-blue-500 text-blue-200' 
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  Gemini
                </button>
                <button 
                   onClick={() => handleProviderChange(AiProvider.OPENAI)}
                   className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm transition-colors border ${
                    selectedProvider === AiProvider.OPENAI 
                    ? 'bg-green-600/20 border-green-500 text-green-200' 
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  ChatGPT
                </button>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full md:w-auto md:min-w-[300px] flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-lg font-bold shadow-lg transition-all transform active:scale-95 ${
                isGenerating 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                : selectedProvider === AiProvider.GEMINI 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/20'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-green-900/20'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Sparkles className="text-yellow-300" /> 
                  Generate Copy
                </>
              )}
            </button>
          </div>

          {/* Prompt Display */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden flex flex-col shadow-xl">
            <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Wand2 size={16} className="text-purple-400" />
                <h3 className="text-sm font-semibold text-white">Generated System Prompt</h3>
              </div>
              <button 
                onClick={handleCopyPrompt}
                className={`text-xs flex items-center gap-1 px-2 py-1 rounded transition-colors border ${
                  isPromptCopied 
                  ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-600'
                }`}
              >
                {isPromptCopied ? <Check size={12} /> : <Copy size={12} />} 
                {isPromptCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="bg-slate-950 p-5 min-h-[300px] max-h-[800px] overflow-y-auto custom-scrollbar">
              <pre className="whitespace-pre-wrap font-mono text-sm text-slate-400 leading-relaxed">
                {generatedPrompt}
              </pre>
            </div>
          </div>

          {/* AI Output */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-start gap-3">
              <AlertCircle className="shrink-0 mt-1" size={18} />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {aiOutput && (
             <div className="bg-slate-900 border border-gaming-500/30 rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-gradient-to-r from-gaming-900/50 to-slate-900 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
                 <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <h3 className="text-sm font-semibold text-white">
                    {selectedProvider === AiProvider.GEMINI ? 'Gemini' : 'ChatGPT'} Output
                  </h3>
                </div>
                <button 
                  onClick={() => copyToClipboard(aiOutput)}
                  className="text-xs flex items-center gap-1 text-gaming-300 hover:text-white transition-colors"
                >
                  <Copy size={12} /> Copy Result
                </button>
              </div>
              <div className="p-8 bg-slate-950 min-h-[300px] prose prose-invert prose-p:text-slate-300 prose-headings:text-white max-w-none">
                <div className="whitespace-pre-wrap font-sans text-base leading-relaxed">
                  {aiOutput}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Small helper icon component
const StarIcon = () => (
  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default App;
