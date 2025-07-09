# lathos
AI-Based Child-Safe Internet Filter

your-folder/
├── Dockerfile
├── requirements.txt
├── moderation_check.py
├── docker-compose.yml
├── .env


docker compose up --build -d (-d in the beckground)

docker exec -it <container id> bash

inside docker  run :
uvicorn app:app --host 0.0.0.0 --port 5000 --reload


TODO separate dev mode and production what runs the api autoaticly with docker compose up