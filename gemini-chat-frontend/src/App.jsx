import { useState } from 'react';
import { MessageCircle, Send, Bot, Loader2, ExternalLink } from 'lucide-react';
import React from 'react';
import { fetchChatResponse } from './service/api';

function App() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleQuestionSubmit = async (question) => {
    setLoading(true);
    setResponse(null);
    try {
      const apiResponse = await fetchChatResponse(question);
      setResponse(apiResponse);
    } catch (error) {
      alert("Failed to get response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100">
      <header className="glass-effect sticky top-0 z-10 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Bot className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            AI Assistant
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ChatInput onSubmit={handleQuestionSubmit} loading={loading} />
        
        {loading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}
        
        <ChatResponse response={response} />
      </main>
    </div>
  );
}

const ChatInput = ({ onSubmit, loading }) => {
  const [question, setQuestion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim() && !loading) {
      onSubmit(question);
      setQuestion("");
    }
  };

  return (
    <div className="glass-effect rounded-lg p-4 mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-start gap-3">
          <MessageCircle className="w-5 h-5 md:w-6 md:h-6 mt-2 text-blue-500" />
          <div className="flex-1">
            <textarea
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
              rows="3"
              placeholder="Ask me anything..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span className="text-sm md:text-base">Send</span>
          </button>
        </div>
      </form>
    </div>
  );
};

const ChatResponse = ({ response }) => {
  if (!response) return null;

  const { candidates, usageMetadata } = response;

  return (
    <div className="space-y-6 animate-fade-in">
      {candidates.map((candidate, index) => (
        <div key={index} className="glass-effect rounded-lg overflow-hidden">
          <div className="p-4 md:p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Bot className="w-5 h-5 md:w-6 md:h-6 text-blue-500 mt-1" />
              <div className="flex-1">
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                  {candidate.content.parts[0].text}
                </p>
              </div>
            </div>

            {candidate?.citationMetadata?.citationSources?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-800">
                <h6 className="text-sm font-semibold text-gray-400 mb-2">Sources:</h6>
                <ul className="space-y-2">
                  {candidate.citationMetadata.citationSources.map((source, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <ExternalLink className="w-4 h-4 text-blue-500" />
                      <a
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {source.uri}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-gray-800/50 px-4 py-2 md:px-6 md:py-3 text-xs md:text-sm text-gray-400">
            <div className="flex flex-wrap gap-2 md:gap-4">
              <span>Prompt Tokens: {usageMetadata.promptTokenCount}</span>
              <span>Response Tokens: {usageMetadata.candidatesTokenCount}</span>
              <span>Total: {usageMetadata.totalTokenCount}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;