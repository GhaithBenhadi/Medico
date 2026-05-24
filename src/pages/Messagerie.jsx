import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Send, Search, Circle } from 'lucide-react'

const CONVERSATIONS = [
  {
    id: 'conv-01',
    contact: 'Sophie Lambert',
    org: 'Groupement Sud-Ouest',
    avatar: 'SL', color: 'from-purple-500 to-purple-600',
    lastMsg: 'Merci pour les informations. Nous confirmons la commande.',
    time: 'Il y a 2h', unread: 2,
    messages: [
      { id: 1, from: 'them', text: 'Bonjour, avez-vous des nouvelles concernant la demande DEM-2024 ?', time: '09:15' },
      { id: 2, from: 'me', text: 'Bonjour Sophie, nous avons reçu 3 devis. Je vous les transmets.', time: '09:32' },
      { id: 3, from: 'them', text: 'Parfait, merci beaucoup. Le devis de MediPro France semble intéressant.', time: '10:01' },
      { id: 4, from: 'me', text: 'Effectivement, c\'est l\'offre la plus complète avec les services inclus.', time: '10:15' },
      { id: 5, from: 'them', text: 'Merci pour les informations. Nous confirmons la commande.', time: '14:32' },
    ],
  },
  {
    id: 'conv-02',
    contact: 'Pierre Martin',
    org: 'MediPro France',
    avatar: 'PM', color: 'from-blue-500 to-blue-600',
    lastMsg: 'Notre devis DEV-881 inclut l\'installation et la formation.',
    time: 'Hier', unread: 0,
    messages: [
      { id: 1, from: 'them', text: 'Bonjour, je vous transmets notre devis pour les 20 lits médicalisés.', time: '08:45' },
      { id: 2, from: 'me', text: 'Bien reçu. Pouvez-vous détailler les services inclus ?', time: '09:10' },
      { id: 3, from: 'them', text: 'Notre devis DEV-881 inclut l\'installation et la formation.', time: '09:28' },
    ],
  },
  {
    id: 'conv-03',
    contact: 'Isabelle Morin',
    org: 'EHPAD Les Jardins',
    avatar: 'IM', color: 'from-emerald-500 to-emerald-600',
    lastMsg: 'Nous avons besoin des lits pour le 25 avril au plus tard.',
    time: 'Lun', unread: 1,
    messages: [
      { id: 1, from: 'them', text: 'Bonjour, j\'ai soumis une nouvelle demande pour 20 lits médicalisés.', time: '14:00' },
      { id: 2, from: 'me', text: 'Bonjour Isabelle, nous avons bien reçu votre demande et allons la traiter.', time: '14:45' },
      { id: 3, from: 'them', text: 'Nous avons besoin des lits pour le 25 avril au plus tard.', time: '15:12' },
    ],
  },
]

export default function Messagerie() {
  const [activeId, setActiveId] = useState('conv-01')
  const [newMsg, setNewMsg] = useState('')
  const [messages, setMessages] = useState(
    Object.fromEntries(CONVERSATIONS.map(c => [c.id, c.messages]))
  )
  const [search, setSearch] = useState('')

  const active = CONVERSATIONS.find(c => c.id === activeId)
  const activeMessages = messages[activeId] || []

  const filteredConvs = CONVERSATIONS.filter(c =>
    c.contact.toLowerCase().includes(search.toLowerCase()) ||
    c.org.toLowerCase().includes(search.toLowerCase())
  )

  const handleSend = () => {
    if (!newMsg.trim()) return
    const msg = { id: Date.now(), from: 'me', text: newMsg, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
    setMessages(prev => ({ ...prev, [activeId]: [...(prev[activeId] || []), msg] }))
    setNewMsg('')
  }

  return (
    <div className="flex h-[calc(100vh-140px)] surface rounded-xl shadow-card overflow-hidden">

      {/* Sidebar conversations */}
      <div className="w-72 border-r border-white/10 flex flex-col shrink-0">
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher…"
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-sm text-white placeholder-gray-500 focus:border-brand-500 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConvs.map(c => (
            <button key={c.id} onClick={() => setActiveId(c.id)}
              className={`w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/3 transition-colors ${activeId === c.id ? 'bg-brand-500/10 border-l-2 border-l-brand-500' : ''}`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                  {c.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white truncate">{c.contact}</span>
                    <span className="text-xs text-gray-500 shrink-0 ml-2">{c.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{c.org}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{c.lastMsg}</p>
                </div>
                {c.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center shrink-0">
                    {c.unread}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        {active && (
          <div className="flex items-center gap-3 p-4 border-b border-white/10">
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${active.color} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
              {active.avatar}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{active.contact}</p>
              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                <Circle size={7} className="fill-emerald-400 text-emerald-400" /> En ligne · {active.org}
              </p>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeMessages.map(m => (
            <motion.div key={m.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                m.from === 'me'
                  ? 'bg-brand-500 text-white rounded-br-sm'
                  : 'bg-white/8 text-gray-200 rounded-bl-sm'
              }`}>
                <p>{m.text}</p>
                <p className={`text-xs mt-1 ${m.from === 'me' ? 'text-white/60' : 'text-gray-500'}`}>{m.time}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <input
              value={newMsg} onChange={e => setNewMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Écrire un message…"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-brand-500 outline-none"
            />
            <button onClick={handleSend}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white hover:opacity-90 transition-opacity shadow-glow shrink-0">
              <Send size={15}/>
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
