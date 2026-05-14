'use client'

import { useState } from 'react'
import SearchBar from '@/components/SearchBar'
import CardList from '@/components/CardList'
import { PokemonCard } from '@/types'

export default function Home() {
  const [cards, setCards] = useState<PokemonCard[]>([])
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = (searchCards: PokemonCard[], searchError?: string) => {
    setCards(searchCards)
    setError(searchError || null)
    setHasSearched(true)
  }

  return (
    <main className="relative min-h-screen cyber-bg overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>

      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen p-4 sm:p-8 md:p-12 lg:p-24">
        <div className="text-center w-full max-w-4xl flex flex-col items-center gap-4 sm:gap-6 md:gap-8">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-clip-text text-transparent neon-glow tracking-wider">MonoDex</h1>
          </div>
          <p className="text-xs sm:text-sm md:text-base text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-mono tracking-widest uppercase">━━ Pokemon Card Search Engine ━━</p>
          <div className="w-full flex justify-center">
            <SearchBar onSearch={handleSearch} isLoading={false} />
          </div>
          <CardList cards={cards} isLoading={false} error={error} hasSearched={hasSearched} />
        </div>
      </div>
    </main>
  )
}
