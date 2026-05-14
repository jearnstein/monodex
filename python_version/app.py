from flask import Flask, render_template, request, jsonify
import requests
from urllib.parse import urlencode
import time

app = Flask(__name__)

# Cache for set information
set_cache = {}


def get_set_name(card_id: str) -> str:
    """Fetch and cache the set name for a card."""
    set_id = card_id.split('-')[0]
    
    if set_id in set_cache:
        return set_cache[set_id]
    
    try:
        response = requests.get(f"https://api.tcgdex.net/v2/en/sets/{set_id}")
        if response.status_code == 200:
            set_data = response.json()
            set_name = set_data.get('name', 'Unknown Set')
            set_cache[set_id] = set_name
            return set_name
    except Exception as e:
        print(f"Error fetching set {set_id}: {e}")
    
    return 'Unknown Set'


def get_card_details(card_id: str) -> dict:
    """Fetch full card details including variants."""
    try:
        response = requests.get(f"https://api.tcgdex.net/v2/en/cards/{card_id}")
        if response.status_code == 200:
            return response.json()
    except Exception as e:
        print(f"Error fetching card details for {card_id}: {e}")
    
    return {}


def search_pokemon_cards(search_term: str, search_type: str = 'name'):
    """Search for Pokemon cards using TCGdex API."""
    try:
        params = {
            search_type: search_term,
            'pagination:page': '1',
            'pagination:itemsPerPage': '500',
        }
        
        response = requests.get(
            f"https://api.tcgdex.net/v2/en/cards?{urlencode(params)}"
        )
        
        if response.status_code != 200:
            raise Exception(f"API error: {response.status_code}")
        
        data = response.json()
        cards = []
        
        for card in (data if isinstance(data, list) else []):
            # Get full card details for variants
            card_details = get_card_details(card.get('id', ''))
            
            # Build image URL
            image_url = ''
            if card.get('image'):
                image_url = f"{card['image']}/high.png"
            
            # Get set name
            set_name = get_set_name(card.get('id', ''))
            
            # Extract variants
            variants = []
            if card_details and card_details.get('variants'):
                vars_data = card_details['variants']
                if vars_data.get('holo'):
                    variants.append('Holo')
                if vars_data.get('normal'):
                    variants.append('Normal')
                if vars_data.get('reverse'):
                    variants.append('Reverse')
                if vars_data.get('firstEdition'):
                    variants.append('1st Edition')
                if vars_data.get('wPromo'):
                    variants.append('Promo')
            
            cards.append({
                'id': card.get('id'),
                'name': card.get('name'),
                'image': image_url,
                'setName': set_name,
                'hp': card.get('hp'),
                'types': card.get('types', []),
                'rarity': card.get('rarity'),
                'retreatCost': card.get('retreatCost'),
                'variants': variants if variants else None,
            })
        
        return {'cards': cards, 'total': len(cards)}
    
    except Exception as e:
        print(f"Error searching Pokemon cards: {e}")
        raise


@app.route('/')
def index():
    """Render the main page."""
    return render_template('index.html')


@app.route('/api/search', methods=['POST'])
def search():
    """API endpoint for card search."""
    try:
        data = request.get_json()
        search_term = data.get('searchTerm', '').strip()
        search_type = data.get('searchType', 'name')
        
        if not search_term:
            return jsonify({'error': 'Search term required'}), 400
        
        result = search_pokemon_cards(search_term, search_type)
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
