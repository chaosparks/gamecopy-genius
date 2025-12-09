import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Wand2, 
  Copy, 
  Sparkles, 
  Target, 
  Share2,
  RefreshCw,
  BrainCircuit,
  Globe,
  Settings,
  X,
  Check,
  MessageSquare,
  Trash2,
  LineChart 
} from 'lucide-react';
import { type FormState, Tone, Platform, GameGenre, Framework, Language, AiProvider, OutputFormat } from './types';
import { GENRE_OPTIONS, TONE_OPTIONS, PLATFORM_OPTIONS, FRAMEWORK_OPTIONS, LANGUAGE_OPTIONS, PLATFORM_FRAMEWORK_PRIORITY, GENRE_MARKET_DATA, OUTPUT_FORMAT_OPTIONS } from './constants';
import { TextInput, SelectInput, TextArea } from './components/InputFields';
import { buildPrompt } from './components/PromptBuilder';
import { generateMarketingCopy } from './services/geminiService';
import { generateMarketingCopyOpenAI } from './services/openaiService';
import { generateMarketingCopyClaude } from './services/claudeService';
import { generateMarketingCopyGrok } from './services/grokService';
import { analyzeGameMonetizeTrends } from './services/marketAnalysisService';

const App: React.FC = () => {
  const initialPlatform = PLATFORM_OPTIONS[0] as Platform;
  const initialSortedFrameworks = PLATFORM_FRAMEWORK_PRIORITY[initialPlatform] || FRAMEWORK_OPTIONS;

  const [showSettings, setShowSettings] = useState(false);
  const [apiKeys, setApiKeys] = useState<{ openai: string; claude: string; grok: string }>({ 
    openai: '', claude: '', grok: '' 
  });
  const [selectedProvider, setSelectedProvider] = useState<AiProvider>(AiProvider.GEMINI);

  const [formData, setFormData] = useState<FormState>({
    gameName: '',
    genre: GENRE_OPTIONS[0],
    tone: TONE_OPTIONS[0] as Tone,
    platform: initialPlatform,
    framework: initialSortedFrameworks[0] as Framework,
    language: LANGUAGE_OPTIONS[0] as Language,
    outputFormat: OutputFormat.MARKDOWN,
    usps: [''],
    competitorReferences: '',
    keywords: '',
    rawDescription: '',
    customPrompt: '',
    marketInsights: '', 
  });

  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  const [isPromptCopied, setIsPromptCopied] = useState(false);
  const [isResetSuccess, setIsResetSuccess] = useState(false);

  // Derived state for sorting frameworks based on current platform
  const sortedFrameworkOptions = PLATFORM_FRAMEWORK_PRIORITY[formData.platform] || FRAMEWORK_OPTIONS;

  useEffect(() => {
    const prompt = buildPrompt(formData, selectedProvider);
    setGeneratedPrompt(prompt);
  }, [formData, selectedProvider]);

  useEffect(() => {
    const savedOpenAIKey = localStorage.getItem('openai_api_key');
    const savedClaudeKey = localStorage.getItem('claude_api_key');
    const savedGrokKey = localStorage.getItem('grok_api_key');
    const savedProvider = localStorage.getItem('selected_provider');

    setApiKeys({
      openai: savedOpenAIKey || '',
      claude: savedClaudeKey || '',
      grok: savedGrokKey || ''
    });

    if (savedProvider && Object.values(AiProvider).includes(savedProvider as AiProvider)) {
      setSelectedProvider(savedProvider as AiProvider);
    }
  }, []);

  const handleInputChange = (field: keyof FormState, value: any) => {
    setFormData((prev) => {
      const newState = { ...prev, [field]: value };
      if (field === 'platform') {
        const newPlatform = value as Platform;
        const newFrameworks = PLATFORM_FRAMEWORK_PRIORITY[newPlatform];
        if (newFrameworks && newFrameworks.length > 0) newState.framework = newFrameworks[0];
      }
      if (field === 'genre') {
         const newGenre = value as GameGenre;
         const marketData = GENRE_MARKET_DATA[newGenre];
         if (marketData) {
            newState.tone = marketData.defaultTone;
            newState.usps = marketData.defaultUsps;
            newState.framework = marketData.defaultFramework;
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

  const addUsp = () => setFormData((prev) => ({ ...prev, usps: [...prev.usps, ''] }));
  
  const removeUsp = (index: number) => {
    const newUsps = formData.usps.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, usps: newUsps.length ? newUsps : [''] }));
  };

  const saveSettings = () => {
    localStorage.setItem('openai_api_key', apiKeys.openai);
    localStorage.setItem('claude_api_key', apiKeys.claude);
    localStorage.setItem('grok_api_key', apiKeys.grok);
    setShowSettings(false);
  };

  const handleProviderChange = (provider: AiProvider) => {
    setSelectedProvider(provider);
    localStorage.setItem('selected_provider', provider);
  };

  const handleReset = () => {
    // Determine the default genre and its associated smart defaults
    const defaultGenre = GENRE_OPTIONS[0];
    const defaultMarketData = GENRE_MARKET_DATA[defaultGenre as GameGenre];
    
    // Reset to "Smart Default" state rather than empty state
    setFormData({
      gameName: '',
      genre: defaultGenre,
      tone: defaultMarketData ? defaultMarketData.defaultTone : TONE_OPTIONS[0] as Tone,
      platform: initialPlatform,
      framework: initialSortedFrameworks[0] as Framework,
      language: LANGUAGE_OPTIONS[0] as Language,
      outputFormat: OutputFormat.MARKDOWN,
      usps: defaultMarketData ? defaultMarketData.defaultUsps : [''], // Restore default USPs
      competitorReferences: '',
      keywords: '',
      rawDescription: '',
      customPrompt: '',
      marketInsights: ''
    });
    setAiOutput(null);
    setError(null);
    setIsResetSuccess(true);
    setTimeout(() => setIsResetSuccess(false), 2000);
  };

  // NEW: Market Analysis Handler
  const handleMarketAnalysis = async () => {
    // Uses Gemini environment variable internally in the service
    setIsAnalyzing(true);
    try {
      const insights = await analyzeGameMonetizeTrends(formData.genre);
      handleInputChange('marketInsights', insights);
    } catch (e: any) {
      alert("Analysis failed: " + e.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setAiOutput(null);

    try {
      let result = '';
      switch (selectedProvider) {
        case AiProvider.GEMINI:
          result = await generateMarketingCopy(generatedPrompt);
          break;
        case AiProvider.OPENAI:
          if (!apiKeys.openai) throw new Error("OpenAI Key missing.");
          result = await generateMarketingCopyOpenAI(generatedPrompt, apiKeys.openai);
          break;
        case AiProvider.CLAUDE:
          if (!apiKeys.claude) throw new Error("Claude Key missing.");
          result = await generateMarketingCopyClaude(generatedPrompt, apiKeys.claude);
          break;
        case AiProvider.GROK:
          if (!apiKeys.grok) throw new Error("Grok Key missing.");
          result = await generateMarketingCopyGrok(generatedPrompt, apiKeys.grok);
          break;
      }
      setAiOutput(result);
    } catch (err: any) {
      setError(err.message || "Failed to generate copy");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);
  
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setIsPromptCopied(true);
    setTimeout(() => setIsPromptCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-gaming-500 selection:text-white pb-20 relative">
      
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <h2 className="text-xl font-bold">Settings</h2>
                <button onClick={() => setShowSettings(false)}><X/></button>
              </div>
              <TextInput label="OpenAI API Key" type="password" value={apiKeys.openai} onChange={(e) => setApiKeys({...apiKeys, openai: e.target.value})} />
              <TextInput label="Claude API Key" type="password" value={apiKeys.claude} onChange={(e) => setApiKeys({...apiKeys, claude: e.target.value})} />
              <TextInput label="Grok API Key" type="password" value={apiKeys.grok} onChange={(e) => setApiKeys({...apiKeys, grok: e.target.value})} />
              <button onClick={saveSettings} className="w-full bg-gaming-600 py-2 rounded">Save</button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gaming-600 p-2 rounded-lg"><Gamepad2 className="text-white" size={24} /></div>
            <h1 className="text-xl font-bold">GameCopy Genius</h1>
          </div>
          <div className="flex gap-4">
             <button 
               onClick={handleReset}
               className={`flex items-center gap-2 transition-colors px-3 py-2 rounded-lg cursor-pointer ${isResetSuccess ? 'text-green-400 bg-green-400/10' : 'hover:text-red-400'}`}
               title="Clear all inputs"
             >
               {isResetSuccess ? <Check size={16} /> : <Trash2 size={16} />}
               <span className="hidden sm:inline">{isResetSuccess ? 'Cleared!' : 'Reset'}</span>
             </button>
             <button onClick={() => setShowSettings(true)} className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors"><Settings size={16} /> Settings</button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        
        {/* Strategy Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
            <Share2 size={20} className="text-gaming-500" /> 1. Strategy & Format
          </h2>
          <SelectInput label="Copywriting Framework" options={sortedFrameworkOptions} icon={BrainCircuit} value={formData.framework} onChange={(e) => handleInputChange('framework', e.target.value)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectInput label="Platform / Output" options={PLATFORM_OPTIONS} value={formData.platform} onChange={(e) => handleInputChange('platform', e.target.value)} />
                <SelectInput label="Output Format" options={OUTPUT_FORMAT_OPTIONS} value={formData.outputFormat} onChange={(e) => handleInputChange('outputFormat', e.target.value)} />
          </div>
          <TextArea 
            label="Custom Instructions (Optional)" 
            value={formData.customPrompt || ''} 
            onChange={(e) => handleInputChange('customPrompt', e.target.value)} 
            className="min-h-[80px]" 
            maxLength={1024}
            placeholder="Add specific rules, banned words, or extra context..." 
          />
        </div>

        {/* Core Details Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
            <Target size={20} className="text-gaming-500" /> 2. Core Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput label="Game Name" value={formData.gameName} onChange={(e) => handleInputChange('gameName', e.target.value)} />
            <SelectInput label="Target Language" options={LANGUAGE_OPTIONS} icon={Globe} value={formData.language} onChange={(e) => handleInputChange('language', e.target.value)} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectInput label="Genre" options={GENRE_OPTIONS} value={formData.genre} onChange={(e) => handleInputChange('genre', e.target.value)} />
            <SelectInput label="Tone" options={TONE_OPTIONS} icon={MessageSquare} value={formData.tone} onChange={(e) => handleInputChange('tone', e.target.value)} />
          </div>

          <TextArea 
            label="Keywords / SEO (Optional)" 
            value={formData.keywords || ''} 
            onChange={(e) => handleInputChange('keywords', e.target.value)}
            placeholder="Enter keywords to include (one per line)..."
          />
          <TextArea 
            label="Raw Game Description / Fact Sheet" 
            value={formData.rawDescription || ''} 
            onChange={(e) => handleInputChange('rawDescription', e.target.value)} 
            className="h-48 font-mono text-sm"
            placeholder="Paste game mechanics, patch notes, or rough ideas here. The AI will extract facts from this text." 
          />

          {/* NEW: Market Insights Section */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg relative group">
             <div className="flex justify-between items-start mb-2">
               <label className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                 <LineChart size={16} /> Market Intelligence (Learned Style)
               </label>
               <button 
                 onClick={handleMarketAnalysis}
                 disabled={isAnalyzing}
                 className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
               >
                 {isAnalyzing ? <RefreshCw className="animate-spin" size={12}/> : <Sparkles size={12}/>}
                 {isAnalyzing ? "Analyzing..." : "Fetch GameMonetize Trends"}
               </button>
             </div>
             <textarea 
               className="w-full bg-transparent text-sm text-slate-400 focus:text-white outline-none min-h-[80px]"
               placeholder="Click 'Fetch GameMonetize Trends' to auto-populate this with real-world patterns from top games..."
               value={formData.marketInsights || ''}
               onChange={(e) => handleInputChange('marketInsights', e.target.value)}
             />
          </div>

          {/* USPs and Competitors */}
          <TextInput label="Competitor References" value={formData.competitorReferences || ''} onChange={(e) => handleInputChange('competitorReferences', e.target.value)} />
          <div className="pt-2">
            <label className="text-sm font-semibold text-gray-300 mb-2 block">Key Selling Points (USPs)</label>
            <div className="space-y-3">
              {formData.usps.map((usp, idx) => (
                <div key={idx} className="flex gap-2">
                  <input className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white" value={usp} onChange={(e) => handleUspChange(idx, e.target.value)} placeholder={`Feature #${idx + 1}`} />
                  <button onClick={() => removeUsp(idx)} className="text-slate-500 hover:text-red-400 p-2">&times;</button>
                </div>
              ))}
              <button onClick={addUsp} className="text-xs text-gaming-400 font-medium">+ Add another feature</button>
            </div>
          </div>
        </div>

        {/* Actions & Output */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
           <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2 w-full md:w-auto">
                 {/* Provider Buttons */}
                 {[AiProvider.GEMINI, AiProvider.OPENAI, AiProvider.CLAUDE, AiProvider.GROK].map(p => (
                   <button key={p} onClick={() => handleProviderChange(p)} className={`flex-1 md:flex-none px-4 py-2 rounded border text-sm ${selectedProvider === p ? 'bg-blue-600/20 border-blue-500 text-blue-200' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{p}</button>
                 ))}
              </div>
              <button onClick={handleGenerate} disabled={isGenerating} className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                {isGenerating ? <RefreshCw className="animate-spin"/> : <Sparkles className="text-yellow-300"/>} Generate Copy
              </button>
           </div>

           {/* Prompt Display */}
           <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
             <div className="flex justify-between items-center px-4 py-2 border-b border-slate-800 bg-slate-900/50">
               <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                 <Wand2 size={14} className="text-purple-400"/> System Prompt
               </label>
               <button 
                 onClick={handleCopyPrompt} 
                 className={`text-xs flex items-center gap-1 px-2 py-1 rounded transition-colors ${isPromptCopied ? 'text-green-400 bg-green-400/10' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
               >
                 {isPromptCopied ? <Check size={14} /> : <Copy size={14}/>}
                 {isPromptCopied ? 'Copied' : 'Copy'}
               </button>
             </div>
             <div className="p-4">
                <pre className="text-sm text-slate-400 whitespace-pre-wrap font-mono h-[200px] overflow-y-auto custom-scrollbar">{generatedPrompt}</pre>
             </div>
           </div>

           {/* AI Output */}
           {aiOutput && (
             <div className="bg-slate-950 p-6 rounded-xl border border-gaming-500/30">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="text-white font-bold">Generated Output</h3>
                 <button onClick={() => copyToClipboard(aiOutput)} className="text-xs text-gaming-300 flex items-center gap-1"><Copy size={12}/> Copy</button>
               </div>
               <div className="prose prose-invert max-w-none whitespace-pre-wrap">{aiOutput}</div>
             </div>
           )}
           {error && <div className="text-red-400 text-sm">{error}</div>}
        </div>
      </main>
    </div>
  );
};

export default App;