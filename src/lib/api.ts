import { PokemonCard, SearchResult } from '@/types'

export type SearchType = 'name' | 'illustrator'

// Cache for set information to avoid duplicate API calls
const setCache: { [key: string]: string } = {}

async function getCardDetails(cardId: string): Promise<any> {
  try {
    const response = await fetch(
      `https://api.tcgdex.net/v2/en/cards/${cardId}`,
      { cache: 'force-cache' }
    )

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching card details for ${cardId}:`, error)
    return null
  }
}

async function getSetName(cardId: string): Promise<string> {
  // Extract set ID from card ID (e.g., "swsh1-1" -> "swsh1")
  const setId = cardId.split('-')[0]

  // Check cache first
  if (setCache[setId]) {
    return setCache[setId]
  }

  try {
    const response = await fetch(
      `https://api.tcgdex.net/v2/en/sets/${setId}`,
      { cache: 'force-cache' } // Cache set requests for better performance
    )

    if (!response.ok) {
      return 'Unknown Set'
    }

    const setData = await response.json()
    const setName = setData.name || 'Unknown Set'

    // Store in cache
    setCache[setId] = setName

    return setName
  } catch (error) {
    console.error(`Error fetching set ${setId}:`, error)
    return 'Unknown Set'
  }
}

export async function searchPokemonCards(
  searchTerm: string,
  searchType: SearchType = 'name'
): Promise<SearchResult> {
  try {
    // Search for cards using TCGdex API
    const params = new URLSearchParams({
      [searchType]: searchTerm,
      'pagination:page': '1',
      'pagination:itemsPerPage': '500', // Get up to 500 results per page
    })

    const response = await fetch(
      `https://api.tcgdex.net/v2/en/cards?${params.toString()}`,
      { cache: 'no-store' }
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    // Transform the API response to match our PokemonCard interface
    // data is an array of cards directly
    const cards: PokemonCard[] = await Promise.all(
      (Array.isArray(data) ? data : []).map(async (card: any) => {
        // Fetch full card details to get variants
        const cardDetails = await getCardDetails(card.id)

        // Construct proper image URL - TCGdex provides base path, we need to append /high.png
        let imageUrl = ''
        if (card.image) {
          imageUrl = `${card.image}/high.png`
        }

        // Fetch set name from separate endpoint
        const setName = await getSetName(card.id)

        // Extract available variants from full card details
        const variants: string[] = []
        if (cardDetails && cardDetails.variants) {
          if (cardDetails.variants.holo) variants.push('Holo')
          if (cardDetails.variants.normal) variants.push('Normal')
          if (cardDetails.variants.reverse) variants.push('Reverse')
          if (cardDetails.variants.firstEdition) variants.push('1st Edition')
          if (cardDetails.variants.wPromo) variants.push('Promo')
        }

        return {
          id: card.id,
          name: card.name,
          image: imageUrl,
          setName: setName,
          hp: card.hp,
          types: card.types,
          rarity: card.rarity,
          retreatCost: card.retreatCost,
          variants: variants.length > 0 ? variants : undefined,
        }
      })
    )

    return {
      cards,
      total: cards.length,
    }
  } catch (error) {
    console.error('Error searching Pokemon cards:', error)
    throw error
  }
}
