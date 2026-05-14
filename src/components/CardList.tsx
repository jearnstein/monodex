'use client'

import { PokemonCard } from '@/types'
import { useState, useEffect } from 'react'

interface CardListProps {
  cards: PokemonCard[]
  isLoading: boolean
  error?: string | null
  hasSearched?: boolean
}

export default function CardList({ cards, isLoading, error, hasSearched = false }: CardListProps) {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleImageError = (cardId: string) => {
    setFailedImages((prev) => new Set(prev).add(cardId))
  }

  const handleCardClick = (cardId: string) => {
    if (isMobile) {
      setExpandedCardId(expandedCardId === cardId ? null : cardId)
    }
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
    <div className="w-full mt-8 sm:mt-12 px-2 sm:px-0">
      <h2 className="text-lg sm:text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text mb-6 sm:mb-8 font-mono tracking-wider text-center">
        ╔══ {cards.length} CARD{cards.length !== 1 ? 'S' : ''} FOUND ══╗
      </h2>
      {/* Mobile-first responsive grid: 1 col on mobile, 2 on sm, 3 on md, 4 on lg, 5 on xl */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`bg-black rounded-lg overflow-hidden shadow-xl transition-all duration-300 z-10 glow-border group cursor-pointer
              ${isMobile && expandedCardId === card.id
                ? 'fixed top-1/2 left-1/2 z-50 w-11/12 max-h-[90vh] -translate-x-1/2 -translate-y-1/2 shadow-[inset_0_0_10px_rgba(253,211,77,0.6),0_0_50px_rgba(253,211,77,0.8),0_0_30px_rgba(168,85,247,0.6)] border-2 border-yellow-300 overflow-y-auto'
                : 'relative origin-center hover:shadow-[inset_0_0_10px_rgba(253,211,77,0.6),0_0_50px_rgba(253,211,77,0.8),0_0_30px_rgba(168,85,247,0.6)] hover:scale-100 hover:z-50 hover:border-2 hover:border-yellow-300 hover:overflow-visible'
              }
            `}
          >
            {card.image && !failedImages.has(card.id) ? (
              <div className="w-full flex justify-center py-2 sm:py-3">
                <div className={`bg-gradient-to-br from-purple-900 to-black flex items-center justify-center overflow-hidden relative ${isMobile && expandedCardId === card.id ? 'overflow-visible w-full' : 'hover:overflow-visible w-4/5'}`} style={{ aspectRatio: '2.5 / 3.5' }}>
                  <img
                    src={card.image}
                    alt={card.name}
                    className={`h-full w-full object-contain transition-transform duration-300 ${isMobile && expandedCardId === card.id ? 'scale-100' : 'group-hover:scale-110'}`}
                    loading="lazy"
                    onError={() => handleImageError(card.id)}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent transition-opacity duration-300 ${isMobile && expandedCardId === card.id ? 'opacity-20' : 'opacity-40 group-hover:opacity-20'}`}></div>
                </div>
              </div>
            ) : (
              <div className="w-full flex justify-center py-2 sm:py-3">
                <div className={`bg-gradient-to-br from-purple-950 via-black to-purple-950 flex items-center justify-center relative overflow-hidden ${isMobile && expandedCardId === card.id ? 'overflow-visible w-full' : 'hover:overflow-visible w-4/5'}`} style={{ aspectRatio: '2.5 / 3.5' }}>
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'radial-gradient(circle at 20% 50%, purple 0%, transparent 50%), radial-gradient(circle at 80% 80%, pink 0%, transparent 50%)'
                  }}></div>
                  <span className="text-purple-400 text-center px-2 text-xs font-mono tracking-wider relative z-10">NO IMAGE DATA</span>
                </div>
              </div>
            )}
            <div className="p-3 sm:p-4 border-t border-purple-500/30">
              <h3 className="font-bold text-gray-100 truncate text-xs sm:text-sm mb-1 sm:mb-2 tracking-wider">{card.name}</h3>
              <div className="space-y-0.5 sm:space-y-1 text-xs">
                {card.setName && (
                  <p className="text-cyan-300 font-mono truncate text-xs">◆ SET: {card.setName}</p>
                )}
                {card.hp && (
                  <p className="text-yellow-300 font-mono text-xs">◆ HP: <span className="font-bold">{card.hp}</span></p>
                )}
                {card.types && card.types.length > 0 && (
                  <p className="text-purple-300 font-mono truncate text-xs">▲ TYPE: {card.types.join(' / ')}</p>
                )}
                {card.rarity && (
                  <p className="text-pink-300 font-mono truncate text-xs">★ {card.rarity}</p>
                )}
                {card.variants && card.variants.length > 0 && (
                  <p className="text-green-300 font-mono truncate text-xs">◊ VAR: {card.variants.join(', ')}</p>
                )}
              </div>
            </div>

            {/* Mobile overlay backdrop */}
            {isMobile && expandedCardId === card.id && (
              <div 
                className="fixed inset-0 bg-black/70 z-40"
                onClick={() => setExpandedCardId(null)}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
