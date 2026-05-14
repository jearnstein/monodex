export interface PokemonCard {
  id: string
  name: string
  image: string
  setName?: string
  hp?: number
  types?: string[]
  rarity?: string
  retreatCost?: number
  variants?: string[]
}

export interface SearchResult {
  cards: PokemonCard[]
  total: number
}
