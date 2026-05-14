'use client'

import { PokemonCard } from '@/types'
import { useState } from 'react'

interface CardListProps {
  cards: PokemonCard[]
  isLoading: boolean
  error?: string | null
  hasSearched?: boolean
}

export default function CardList({ cards, isLoading, error, hasSearched = false }: CardListProps) {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())

  const handleImageError = (cardId: string) => {
    setFailedImages((prev) => new Set(prev).add(cardId))
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-purple-400 font-mono text-sm tracking-widest">▓▒░ SCANNING DATABASE ░▒▓</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-pink-400 font-mono text-sm tracking-wider">⚠ ERROR: {error}</div>
      </div>
    )
  }

  if (cards.length === 0 && hasSearched) {
    return (
      <div className="w-full mt-12 flex justify-center items-center py-12">
        <style>{`
          @keyframes scanlines {
            0% { transform: translateY(0); }
            100% { transform: translateY(10px); }
          }
          @keyframes flicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          .scanlines {
            animation: scanlines 2s linear infinite;
          }
          .flicker-text {
            animation: flicker 0.3s infinite;
          }
        `}</style>
        <div className="text-center space-y-4">
          <div className="text-pink-400 font-mono text-lg tracking-widest uppercase font-black scanlines">
            ⟨ POKEMON NOT RECOGNISED ⟩
          </div>
          <div className="text-purple-400 font-mono text-xs tracking-wider opacity-60">
            [ERROR 404: DATABASE QUERY RETURNED ZERO RESULTS]
          </div>
          <div className="text-yellow-300 font-mono text-2xl flicker-text">
            ▮
          </div>
        </div>
      </div>
    )
  }

  if (cards.length === 0) {
    return null
  }

  return (
    <div className="w-full mt-12">
      <h2 className="text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text mb-8 font-mono tracking-wider">
        ╔══ {cards.length} CARD{cards.length !== 1 ? 'S' : ''} FOUND ══╗
      </h2>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 auto-rows-max">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-black rounded-lg overflow-hidden shadow-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] glow-border group"
          >
            {card.image && !failedImages.has(card.id) ? (
              <div className="h-72 bg-gradient-to-br from-purple-900 to-black flex items-center justify-center overflow-hidden relative">
                <img
                  src={card.image}
                  alt={card.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={() => handleImageError(card.id)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40"></div>
              </div>
            ) : (
              <div className="h-72 bg-gradient-to-br from-purple-950 via-black to-purple-950 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: 'radial-gradient(circle at 20% 50%, purple 0%, transparent 50%), radial-gradient(circle at 80% 80%, pink 0%, transparent 50%)'
                }}></div>
                <span className="text-purple-400 text-center px-2 text-xs font-mono tracking-wider relative z-10">NO IMAGE DATA</span>
              </div>
            )}
            <div className="p-4 border-t border-purple-500/30">
              <h3 className="font-bold text-gray-100 truncate text-sm mb-2 tracking-wider">{card.name}</h3>
              <div className="space-y-1 text-xs">
                {card.setName && (
                  <p className="text-cyan-300 font-mono truncate">◆ SET: {card.setName}</p>
                )}
                {card.hp && (
                  <p className="text-yellow-300 font-mono">◆ HP: <span className="font-bold">{card.hp}</span></p>
                )}
                {card.types && card.types.length > 0 && (
                  <p className="text-purple-300 font-mono truncate">▲ TYPE: {card.types.join(' / ')}</p>
                )}
                {card.rarity && (
                  <p className="text-pink-300 font-mono truncate">★ {card.rarity}</p>
                )}
                {card.variants && card.variants.length > 0 && (
                  <p className="text-green-300 font-mono truncate">◊ VAR: {card.variants.join(', ')}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
