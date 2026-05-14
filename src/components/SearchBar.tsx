'use client'

import { useState } from 'react'
import { PokemonCard } from '@/types'
import { searchPokemonCards, type SearchType } from '@/lib/api'

interface SearchBarProps {
  onSearch: (cards: PokemonCard[], error?: string) => void
  isLoading: boolean
}

export default function SearchBar({ onSearch, isLoading: parentLoading }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState<SearchType>('name')
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      setIsLoading(true)
      try {
        // Simulate scanning delay for futuristic effect
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const result = await searchPokemonCards(searchTerm, searchType)
        onSearch(result.cards)
      } catch (error) {
        onSearch([], error instanceof Error ? error.message : 'Search failed')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const loading = isLoading || parentLoading

  return (
    <form onSubmit={handleSearch} className="w-full flex">
      <div className="flex gap-1 sm:gap-2 flex-col sm:flex-row w-full">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as SearchType)}
          disabled={loading}
          className="px-2 sm:px-3 py-2 sm:py-2.5 bg-black border border-purple-500 rounded-lg text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-mono text-xs uppercase tracking-wider disabled:opacity-50 glow-border appearance-none bg-no-repeat pr-8 whitespace-nowrap flex-shrink-0"
          style={{
            backgroundImage: 'url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23fcd34d%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e\")',
            backgroundPosition: 'right 0.5rem center',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem'
          }}
        >
          <option value="name" className="bg-black text-yellow-300">POKEMON NAME</option>
          <option value="illustrator" className="bg-black text-yellow-300">ARTIST</option>
        </select>
        <div className="flex gap-1 sm:gap-2 flex-1 glow-border p-0.5 rounded-lg bg-black/50 backdrop-blur-sm min-w-0">
          <input
            type="text"
            placeholder={searchType === 'name' ? 'Pokemon...' : 'Artist...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
            className="flex-1 px-2 sm:px-3 py-2 sm:py-2.5 bg-black border-0 text-yellow-300 placeholder-purple-500/50 focus:outline-none font-mono text-xs uppercase tracking-wider disabled:opacity-50 min-w-0"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 text-black font-black rounded-md hover:shadow-[0_0_20px_rgba(250,204,21,0.8)] transition-all duration-300 disabled:opacity-50 uppercase tracking-wider text-xs whitespace-nowrap flex-shrink-0"
          >
            {loading ? 'SCAN...' : 'SCAN'}
          </button>
        </div>
      </div>
    </form>
  )
}
