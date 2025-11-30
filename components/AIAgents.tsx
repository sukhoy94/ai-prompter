'use client'

interface Agent {
  name: string
  url: string
  description: string
  emoji: string
  color: string
  darkColor: string
}

const agents: Agent[] = [
  {
    name: 'Claude',
    url: 'https://claude.ai',
    description: 'Anthropic\'s AI assistant - excellent for complex reasoning',
    emoji: '🤖',
    color: 'from-purple-500 to-purple-600',
    darkColor: 'dark:from-purple-600 dark:to-purple-700',
  },
  {
    name: 'ChatGPT',
    url: 'https://chatgpt.com',
    description: 'OpenAI\'s most popular AI assistant',
    emoji: '💬',
    color: 'from-green-500 to-green-600',
    darkColor: 'dark:from-green-600 dark:to-green-700',
  },
  {
    name: 'Gemini',
    url: 'https://gemini.google.com',
    description: 'Google\'s advanced multimodal AI',
    emoji: '✨',
    color: 'from-blue-500 to-blue-600',
    darkColor: 'dark:from-blue-600 dark:to-blue-700',
  },
  {
    name: 'Grok',
    url: 'https://grok.x.ai',
    description: 'xAI\'s AI with real-time knowledge',
    emoji: '⚡',
    color: 'from-yellow-500 to-yellow-600',
    darkColor: 'dark:from-yellow-600 dark:to-yellow-700',
  },
  {
    name: 'Copilot',
    url: 'https://copilot.microsoft.com',
    description: 'Microsoft\'s AI assistant - integrated with Windows',
    emoji: '🔮',
    color: 'from-blue-400 to-blue-500',
    darkColor: 'dark:from-blue-600 dark:to-blue-700',
  },
  {
    name: 'Perplexity',
    url: 'https://www.perplexity.ai',
    description: 'AI research assistant with web browsing',
    emoji: '🔍',
    color: 'from-indigo-500 to-indigo-600',
    darkColor: 'dark:from-indigo-600 dark:to-indigo-700',
  },
  {
    name: 'LLaMA',
    url: 'https://www.meta.com/llama/',
    description: 'Meta\'s open-source language model',
    emoji: '🦙',
    color: 'from-blue-600 to-blue-700',
    darkColor: 'dark:from-blue-700 dark:to-blue-800',
  },
  {
    name: 'Mistral',
    url: 'https://mistral.ai',
    description: 'Efficient open-source AI model',
    emoji: '🌪️',
    color: 'from-orange-500 to-orange-600',
    darkColor: 'dark:from-orange-600 dark:to-orange-700',
  },
]

export default function AIAgents() {
  return (
    <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Popular AI Agents
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Test your prompts with these AI platforms
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {agents.map((agent) => (
          <a
            key={agent.name}
            href={agent.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative overflow-hidden rounded-lg p-4 bg-gradient-to-br ${agent.color} ${agent.darkColor} text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer`}
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />

            <div className="relative z-10 flex flex-col h-full">
              <div className="text-3xl mb-2">{agent.emoji}</div>
              <h3 className="font-bold text-lg mb-1">{agent.name}</h3>
              <p className="text-sm text-white text-opacity-90 flex-grow">
                {agent.description}
              </p>
              <div className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                Open <span>→</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-900 dark:text-blue-200">
          <span className="font-semibold">💡 Tip:</span> Create and save your best prompts here, then copy them to use with any AI agent above!
        </p>
      </div>
    </section>
  )
}
