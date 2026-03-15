#!/bin/bash
set -e

echo "🚀 FluentFusion Startup"
echo "========================"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 1. Backend
echo ""
echo "📦 Starting Backend..."
cd "$SCRIPT_DIR/backend"

if [ ! -d "venv" ]; then
  python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt -q

echo "🔥 Starting FastAPI on http://localhost:8000"
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!

# 2. Unified Frontend
echo ""
echo "🖥️  Starting FluentFusion on http://localhost:5173"
cd "$SCRIPT_DIR/frontend/app"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ All services started!"
echo ""
echo "  🌐 App:      http://localhost:5173"
echo "  📖 API Docs: http://localhost:8000/docs"
echo ""
echo "  User flow: / → /signup → /verify-email → /onboard/... → /dashboard"
echo "  Admin:      /admin  (role: admin / super_admin)"
echo "  Instructor: /instructor  (role: instructor)"
echo ""
echo "  Demo credentials:"
echo "    Admin:      c.okafor@fluentfusion.com / admin123"
echo "    Instructor: a.ndiaye@ff.com / instructor123"
echo "    Student:    k.larbi@gmail.com / student123"
echo ""
echo "Press Ctrl+C to stop all services"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait $BACKEND_PID $FRONTEND_PID
