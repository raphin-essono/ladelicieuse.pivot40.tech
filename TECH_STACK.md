# Stack Technique - La Délicieuse

## Frontend

### Framework & Langage
| Technologie | Rôle |
|---|---|
| **React 18** | Framework UI - Gère les composants et l'interface utilisateur |
| **TypeScript** | Langage typé - Apporte la sécurité des types et meilleure maintenabilité |
| **Vite** | Bundler & dev server - Compilation rapide et rechargement en direct (HMR) |

### Styling
| Technologie | Rôle |
|---|---|
| **Tailwind CSS** | Framework CSS - Utility-first pour les styles (via config `tailwind.config.ts`) |

### Composants UI & Design
| Technologie | Rôle |
|---|---|
| **shadcn/ui** | Composants React accessibles basés sur Radix UI (boutons, modaux, cartes, etc.) |
| **Radix UI** | Base primitive des composants (`@radix-ui/*`) - Accessibilité et comportement |
| **Lucide React** | Icônes SVG - Icônes cohérentes et légères |
| **Framer Motion** | Animation - Animations fluides (`FlyingIngredient.tsx`) |

### Gestion d'État & Formulaires
| Technologie | Rôle |
|---|---|
| **React Hook Form** | Gestion efficace des formulaires avec validation |
| **React Query (TanStack)** | Gestion du cache de données côté client |
| **Zod** | Validation de schémas TypeScript |

### Routing & Navigation
| Technologie | Rôle |
|---|---|
| **React Router v6** | Routage client-side (CartPage, AdminPages, etc.) |

### Paiements & Transactions
| Technologie | Rôle |
|---|---|
| **SingPay API** | Plateforme paiement pan-africaine - Cartes bancaires, Airtel Money, Moov Money |

### Notifications & Thème
| Technologie | Rôle |
|---|---|
| **Sonner** | Toast notifications (notifications temporaires) |
| **next-themes** | Gestion du thème (light/dark mode) |

## Backend

### Framework & Langage
| Technologie | Rôle |
|---|---|
| **Express.js** | Framework web - Serveur API REST |
| **Node.js** | Runtime JavaScript serveur - Exécute le serveur |
| **TypeScript** | Langage typé - Sécurité des types pour le backend |

### API & Réseau
| Technologie | Rôle |
|---|---|
| **Axios** | Client HTTP - Appels sécurisés à SingPay API |
| **CORS** | Cross-Origin Resource Sharing - Sécurise les requêtes frontend |

### Configuration & Environnement
| Technologie | Rôle |
|---|---|
| **dotenv** | Gestion des variables d'environnement (.env files) |

### Développement
| Technologie | Rôle |
|---|---|
| **tsx** | Exécution TypeScript en développement avec rechargement automatique |

## Intégration SingPay

### Flux Paiement
- **Carte Bancaire:** Visa/MasterCard → Frontend → Backend Proxy → SingPay /ext → Interface Paiement SingPay
- **Airtel Money:** USSD Push → Frontend → Backend → SingPay /74/paiement → Confirmation Client
- **Moov Money:** USSD Push → Frontend → Backend → SingPay /62/paiement → Confirmation Client
- **Espèces:** Commande Locale → Frontend → Backend → Base Données → Appel de Confirmation

### Endpoints Implémentés
- `POST /api/singpay/airtel-payment` - Paiement Airtel Money
- `POST /api/singpay/moov-payment` - Paiement Moov Money
- `POST /api/singpay/card-payment` - Paiement Carte (externe)
- `GET /api/singpay/transaction-status/{id}` - Vérifier statut
- `GET /api/singpay/transaction-by-reference/{ref}` - Chercher transaction
- `POST /api/singpay/callback` - Webhook SingPay
- `POST /api/singpay/cash-payment` - Commande espèces

### Utilitaires
| Technologie | Rôle |
|---|---|
| **date-fns** | Utilitaires pour dates et calendriers |
| **Recharts** | Graphiques pour dashboard admin |
| **Embla Carousel** | Carrousel d'images |

## Testing

| Technologie | Rôle |
|---|---|
| **Vitest** | Test unitaire rapide (remplace Jest) avec environnement jsdom |
| **Playwright** | Tests E2E (End-to-End) |
| **@testing-library/react** | Utilities pour tester les composants React |

## Qualité du Code

| Technologie | Rôle |
|---|---|
| **ESLint** | Linter avec config TypeScript et règles React Hooks |
| **TypeScript ESLint** | Support TypeScript dans ESLint |

## Infrastructure & Déploiement

| Technologie | Rôle |
|---|---|
| **Docker** | Containerisation (Node 20 Alpine, build optimisé) |
| **Docker Compose** | Orchestration - Lance l'app sur port 5101 (conteneur) |
| **Bun** | Package manager alternatif (fichiers `bun.lockb` présents) |

## Plateforme

| Technologie | Rôle |
|---|---|
| **Lovable** | Plateforme low-code avec intégration IDE et éditeur visuel |

---

**Dernière mise à jour:** 5 mai 2026
