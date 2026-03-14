#!/usr/bin/env bash
# FluentFusion — dev start (backend + frontend in parallel)
set -e
echo "Starting FluentFusion..."
cd backend
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
sleep 3
python3 -c "
from database import SessionLocal
from models import User
db = SessionLocal()
count = db.query(User).count()
db.close()
if count == 0:
    import seed; seed.seed()
else:
    print(f'DB has {count} users, skipping seed.')
" 2>/dev/null || true
cd ../frontend
npm run dev &
FRONTEND_PID=$!
echo ""
echo "  Frontend  → http://localhost:5173"
echo "  API       → http://localhost:8000"
echo "  API Docs  → http://localhost:8000/docs"
echo ""
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
