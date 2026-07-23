import { HiSparkles } from 'react-icons/hi2'

export default function ChatBubble({ message, user }) {
  const isAI = message.sender === 'ai'
  return (
    <div className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}>
      {isAI ? (
        <span className="w-8 h-8 rounded-full bg-forest-600 flex items-center justify-center shrink-0">
          <HiSparkles className="text-white text-sm" />
        </span>
      ) : (
        <img src={user?.avatar} alt="you" className="w-8 h-8 rounded-full object-cover shrink-0" />
      )}
      <div className={`max-w-md ${isAI ? 'items-start' : 'items-end'} flex flex-col`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isAI ? 'bg-white border border-border text-ink rounded-tl-sm' : 'bg-forest-600 text-white rounded-tr-sm'
          }`}
        >
          <p>{message.text}</p>
          {message.list && (
            <ul className="mt-2 space-y-1 list-disc list-inside">
              {message.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {message.followUp && <p className="mt-2">{message.followUp}</p>}
        </div>
      </div>
    </div>
  )
}
