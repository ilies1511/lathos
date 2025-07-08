# lathos
AI-Based Child-Safe Internet Filter

## Test moderation endpoint
Switch to "moderation branch"
```bash
git checkout moderation
```

Create and activate virtual environment
```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies
```bash
pip install -r requirements.txt
```

Create .env file
```
OPENAI_API_KEY=your_openai_key_here
```

Run
```bash
flask run
```

curl Test 
```bash
curl -X POST http://127.0.0.1:5000/check \
  -H "Content-Type: application/json" \
  -d '{"url": "http://porn.com"}'
  ```

Postman Test
Use: POST method <br/>
URL : 127.0.0.1:5000/check <br/>
JSON : {"url": "http://porn.com"} <br/>
