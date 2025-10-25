# FinanceTracker

Applicazione full-stack per la gestione delle finanze personali con autenticazione multiutente su area protetta.

---

## Linguaggi

**Frontend:**
- `tsx`
- `tailwindCSS`
- `lucide-react`

**Backend:**
- `ts`
- `SQL (MariaDB)`

---

## Suddivisione in Componenti

- **Card**: componenti riutilizzabili per mostrare dati
- **Modal**: finestre modali per interazione utente
- **Hook**: custom hook React per logica condivisa
- **Middleware**: autenticazione, validazione, sicurezza backend
- **Routes**: definizione delle API/backend

---

## Style

- UI/UX moderna
- Ottimizzazione delle performance
- **DRY** (Don't Repeat Yourself)
- **KISS** (Keep It Simple, Stupid)
- **YAGNI** (You Aren't Gonna Need It)

---

## Autenticazione

- Login multiutente con JWT
- Password hashate con bcrypt
- Area protetta accessibile solo da utenti autenticati

---

## Configurazione Ambiente

### my-app/.env.local

```env
# Server Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### my-app-backend/.env

```env
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
```

---

## Installazione

### Prerequisiti

- Node.js (v18+) recomended: v24.10.0
- MariaDB
- npm o yarn

### Setup

```bash
# Clona il repository
git clone <repository-url>
cd finance-tracker

# Installazione dipendenze frontend
cd my-app
npm install

# Installazione dipendenze backend
cd ../my-app-backend
npm install

# Crea il database
mysql -u root -p
CREATE DATABASE financetracker;
```

### Avvio Applicazione

**Terminal 1 - Backend:**
```bash
cd my-app-backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd my-app
npm run dev
```

Accedi all'applicazione su `http://localhost:3000`

---

## API Endpoints

| Metodo | Endpoint              | Descrizione          |
|--------|----------------------|----------------------|
| POST   | /api/auth/login      | Login utente         |
| POST   | /api/auth/register   | Registrazione utente |
| GET    | /api/auth/verify     | Verifica token JWT   |
| POST   | /api/auth/logout     | Logout               |

---

## Sicurezza

- Password hashate con bcrypt (10 rounds)
- Autenticazione basata su JWT
- Route protette con middleware
- Prevenzione SQL injection
- Variabili d'ambiente per dati sensibili

---

## Comandi Sviluppo

```bash
# Avvio in modalità sviluppo
npm run dev

# Build per produzione
npm run build

# Type checking
npm run type-check
```

## 📄 Licenza

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)**.

For more information, see the LICENSE file or visit <https://www.gnu.org/licenses/gpl-3.0.html>
