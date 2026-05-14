# MonoDex Python Flask Version

A simple Python Flask app for searching Pokemon Trading Card Game cards by name or illustrator.

## Setup

### Local Development

1. **Install Python** (3.8+)

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Run the app:**
```bash
python app.py
```

4. **Visit:** `http://localhost:5000`

## Deployment to Fasthosts Shared Hosting

### Prerequisites
- Fasthosts shared hosting account with Python support
- cPanel access

### Steps

1. **Prepare the app:**
   - Create a `public_html/monodex` directory (or your preferred location)
   - Upload all files there via SFTP

2. **Set up in cPanel:**
   - Go to **Setup Python App**
   - **Create Application** with these settings:
     - **Python version:** 3.10+
     - **Application root:** `/monodex`
     - **Application URL:** `https://yourdomain.com/monodex`
     - **Passenger app startup file:** `app.py`
     - **Application startup file:** `app.py`

3. **Install dependencies:**
   - In cPanel, go to your Python App's **Console**
   - Run: `pip install -r requirements.txt`

4. **Set environment (if needed):**
   - In cPanel Python App settings, add env vars if required

5. **Restart the application:**
   - Click **Restart** in the Python App panel

6. **Access your app:**
   - `https://yourdomain.com/monodex`

## Project Structure

```
monodex/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── templates/
│   ├── base.html      # Base template with styling
│   └── index.html     # Main page template
└── static/            # Optional static files
```

## API Endpoints

- `GET /` - Main page
- `POST /api/search` - Search for cards
  - Body: `{ "searchTerm": "pikachu", "searchType": "name" }`
  - Returns: `{ "cards": [...], "total": count }`

## Features

- Search Pokemon cards by name or illustrator
- Display card details (HP, types, rarity, variants)
- Responsive design
- Cyberpunk-themed UI with animations
- Caching for set information (improves performance)

## Performance Notes

- Set names are cached to reduce API calls
- Search results limited to 500 cards per query
- Images loaded from TCGdex CDN
