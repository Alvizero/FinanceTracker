# FinanceTracker

Linguaggi:
- tsx + taildwildCss + lucide-react (frontend)
- ts + sql mariadb (backend)

Suddivisa in components
- Card
- Modal
- Hook
- Middleware
- Routes

trattata UI UX moderna + ottimizzazione + DRY + KISS + YAGNI

sistema di login con autenticazione multiutente su area protetta

--

MY-APP -> .env.local
'''
# Server Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
'''

MY-APP-BACKEND -> .env
'''
# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-jwt
JWT_EXPIRES_IN="30m"

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=financetracker
DB_CONNECTION_LIMIT=10

# Security
BCRYPT_ROUNDS=10
'''
