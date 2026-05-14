'use client'

import { useState, useEffect } from 'react'
import SearchBar from '@/components/SearchBar'
import CardList from '@/components/CardList'
import { PokemonCard } from '@/types'
import { searchPokemonCards } from '@/lib/api'

export default function Home() {
  const [cards, setCards] = useState<PokemonCard[]>([])
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [viewMode, setViewMode] = useState<'full' | 'compact'>('full')
  const [showDetails, setShowDetails] = useState(true)
  const [randomCard, setRandomCard] = useState<PokemonCard | null>(null)

  useEffect(() => {
    // Fetch a random Pokemon card on mount
    const fetchRandomCard = async () => {
      try {
        const pokemons = ['pikachu', 'charizard', 'blastoise', 'venusaur', 'dragonite', 'alakazam', 'machamp', 'golem', 'arcanine', 'lapras', 'snorlax', 'articuno', 'zapdos', 'moltres', 'mewtwo', 'mew']
        const randomPokemon = pokemons[Math.floor(Math.random() * pokemons.length)]
        
        const result = await searchPokemonCards(randomPokemon, 'name')
        if (result.cards && result.cards.length > 0) {
          const selectedCard = result.cards[Math.floor(Math.random() * result.cards.length)]
          setRandomCard(selectedCard)
        }
      } catch (err) {
        console.error('Failed to fetch random card:', err)
      }
    }
    
    fetchRandomCard()
  }, [])

  const handleSearch = (searchCards: PokemonCard[], searchError?: string) => {
    setCards(searchCards)
    setError(searchError || null)
    setHasSearched(true)
  }

  const handleCardClick = async (pokemonName: string) => {
    try {
      const result = await searchPokemonCards(pokemonName, 'name')
      handleSearch(result.cards)
    } catch (err) {
      handleSearch([], err instanceof Error ? err.message : 'Search failed')
    }
  }

  return (
    <main className="relative min-h-screen cyber-bg overflow-x-hidden">
      {/* Animated background elements - reduced/hidden on mobile */}
      <div className="hidden sm:block absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="hidden sm:block absolute top-1/2 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
      <div className="hidden sm:block absolute bottom-0 left-1/3 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>

      {/* Fixed Header with Search and Toggles */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-purple-500/30 p-2 sm:p-3">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 max-w-full px-2">
          {/* Compact Title */}
          <div className="text-center flex-shrink-0 whitespace-nowrap">
            <h1 className="text-lg sm:text-xl md:text-2xl font-black bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent tracking-wider">MonoDex</h1>
          </div>

          {/* Search Bar - constrained size, centered */}
          <div className="w-full sm:w-80 md:w-96 flex-shrink min-w-0">
            <SearchBar onSearch={handleSearch} isLoading={false} />
          </div>

          {/* Toggle Controls - Compact */}
          {hasSearched && (
            <div className="flex gap-1 sm:gap-1 flex-shrink-0">
              {/* Grid View Toggle */}
              <div className="flex gap-0.5 bg-black/50 rounded-lg border border-purple-500/50 p-1">
                <button
                  onClick={() => setViewMode('compact')}
                  className={`p-1.5 sm:p-2 rounded transition-all duration-200 ${
                    viewMode === 'compact'
                      ? 'bg-yellow-400 shadow-lg'
                      : 'bg-transparent hover:bg-purple-500/30'
                  }`}
                  title="Compact Grid"
                >
                  <svg className={`w-4 h-4 ${viewMode === 'compact' ? 'text-black' : 'text-yellow-300'}`} fill="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="4" height="4" />
                    <rect x="8" y="2" width="4" height="4" />
                    <rect x="14" y="2" width="4" height="4" />
                    <rect x="20" y="2" width="2" height="4" />
                    <rect x="2" y="8" width="4" height="4" />
                    <rect x="8" y="8" width="4" height="4" />
                    <rect x="14" y="8" width="4" height="4" />
                    <rect x="20" y="8" width="2" height="4" />
                    <rect x="2" y="14" width="4" height="4" />
                    <rect x="8" y="14" width="4" height="4" />
                    <rect x="14" y="14" width="4" height="4" />
                    <rect x="20" y="14" width="2" height="4" />
                    <rect x="2" y="20" width="4" height="2" />
                    <rect x="8" y="20" width="4" height="2" />
                    <rect x="14" y="20" width="4" height="2" />
                    <rect x="20" y="20" width="2" height="2" />
                  </svg>
                </button>

                <button
                  onClick={() => setViewMode('full')}
                  className={`p-1.5 sm:p-2 rounded transition-all duration-200 ${
                    viewMode === 'full'
                      ? 'bg-yellow-400 shadow-lg'
                      : 'bg-transparent hover:bg-purple-500/30'
                  }`}
                  title="Full Size Grid"
                >
                  <svg className={`w-4 h-4 ${viewMode === 'full' ? 'text-black' : 'text-yellow-300'}`} fill="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="5.5" height="5.5" />
                    <rect x="9.5" y="2" width="5.5" height="5.5" />
                    <rect x="17" y="2" width="5" height="5.5" />
                    <rect x="2" y="9.5" width="5.5" height="5.5" />
                    <rect x="9.5" y="9.5" width="5.5" height="5.5" />
                    <rect x="17" y="9.5" width="5" height="5.5" />
                    <rect x="2" y="17" width="5.5" height="5" />
                    <rect x="9.5" y="17" width="5.5" height="5" />
                    <rect x="17" y="17" width="5" height="5" />
                  </svg>
                </button>
              </div>

              {/* Card Details Toggle */}
              <button
                onClick={() => setShowDetails(!showDetails)}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded font-mono text-xs uppercase tracking-wider transition-all duration-200 bg-black/50 border border-purple-500/50 whitespace-nowrap ${
                  showDetails
                    ? 'bg-yellow-400 text-black font-bold shadow-lg border-yellow-400'
                    : 'text-yellow-300 hover:bg-purple-500/30'
                }`}
                title="Toggle Card Details"
              >
                <span className="hidden sm:inline">{showDetails ? '✓ Details' : '✗ Details'}</span>
                <span className="sm:hidden">{showDetails ? '✓' : '✗'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content with padding for fixed header */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen pt-20 sm:pt-24 md:pt-28 p-3 sm:p-6">
        {/* Hero Section - Show when no search */}
        {!hasSearched && (
          <div className="w-full flex flex-col items-center justify-center gap-8 sm:gap-12 min-h-[calc(100vh-100px)] sm:min-h-[calc(100vh-120px)] md:min-h-[calc(100vh-140px)]">
            <div className="text-center">
              <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-clip-text text-transparent neon-glow tracking-wider mb-4">
                MonoDex
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-mono tracking-widest uppercase">
                ━━ Pokemon Card Search ━━
              </p>
            </div>

            {/* Random Card Display */}
            <div className="flex flex-col items-center gap-4 min-h-[320px] sm:min-h-[360px] md:min-h-[420px] justify-center">
              {randomCard && (
                <>
                  <button
                    onClick={() => handleCardClick(randomCard.name)}
                    className="relative group cursor-pointer hover:scale-105 transition-transform duration-300 active:scale-95"
                    title={`Search for ${randomCard.name}`}
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-yellow-400 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
                    <img
                      src={randomCard.image}
                      alt={randomCard.name}
                      className="relative w-32 sm:w-40 md:w-48 rounded-xl shadow-2xl object-contain"
                      loading="lazy"
                    />
                  </button>
                  <div className="text-center">
                    <p className="text-yellow-300 font-mono font-bold text-sm sm:text-base">{randomCard.name}</p>
                    <p className="text-purple-300 font-mono text-xs sm:text-sm">{randomCard.setName}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Results Section - Show when searched */}
        {hasSearched && (
          <div className="text-center w-full max-w-6xl flex flex-col items-center gap-3 sm:gap-4 md:gap-6">
            <CardList cards={cards} isLoading={false} error={error} hasSearched={hasSearched} viewMode={viewMode} showDetails={showDetails} />
          </div>
        )}
      </div>
    </main>
  )
}
