# Backend SingPay Integration

Ce dossier contient le serveur backend Express pour gérer les paiements SingPay de manière sécurisée.

## Architecture

```
Frontend (Vite/React)
    ↓ Requête HTTP
localhost:5100 → Proxy (/api) → localhost:3000
    ↑ Réponse JSON
Backend (Express)
    ↓
SingPay API
gateway.singpay.ga/v1
```

## Installation

1. **Installer les dépendances du backend:**
```bash
cd backend
npm install
```

2. **Configurer les variables d'environnement:**
```bash
cp .env.example .env.local
```

3. **Remplir `.env.local` avec vos credentials SingPay:**
```env
SINGPAY_API_KEY=your_api_key_from_singpay
SINGPAY_MERCHANT_ID=your_merchant_id_from_singpay
PORT=3000
FRONTEND_URL=http://localhost:5100
NODE_ENV=development
```

## Démarrage

**Mode développement (avec rechargement automatique):**
```bash
npm run dev
```

**Mode production:**
```bash
npm run build
npm start
```

## Endpoints API

### 💳 Paiement par Carte
```
POST /api/singpay/card-payment
Content-Type: application/json

{
  "montant": 50000,
  "telephone": "+241061234567",
  "reference": "LD-ORDER001-1699564800000",
  "description": "Commande #001",
  "email": "client@example.com",
  "urlCallback": "https://yourapp.com/callback",
  "urlRetour": "https://yourapp.com/order-success"
}

Response:
{
  "success": true,
  "transactionId": "TXN12345",
  "message": "Lien de paiement par carte créé avec succès",
  "redirectUrl": "https://payment.singpay.ga/...",
  "data": { ... }
}
```

### 📱 Airtel Money
```
POST /api/singpay/airtel-payment
Content-Type: application/json

{
  "montant": 50000,
  "telephone": "+241061234567",
  "reference": "LD-ORDER001-1699564800000",
  "description": "Commande #001",
  "urlCallback": "https://yourapp.com/callback",
  "urlRetour": "https://yourapp.com/order-success"
}

Response:
{
  "success": true,
  "transactionId": "TXN12345",
  "message": "Paiement Airtel Money initié avec succès",
  "data": { ... }
}
```

### 💰 Moov Money
```
POST /api/singpay/moov-payment
Content-Type: application/json

{
  "montant": 50000,
  "telephone": "+241061234567",
  "reference": "LD-ORDER001-1699564800000",
  "description": "Commande #001",
  "urlCallback": "https://yourapp.com/callback",
  "urlRetour": "https://yourapp.com/order-success"
}

Response:
{
  "success": true,
  "transactionId": "TXN12345",
  "message": "Paiement Moov Money initié avec succès",
  "data": { ... }
}
```

### 🛒 Paiement en Espèces
```
POST /api/singpay/cash-payment
Content-Type: application/json

{
  "orderId": "ORDER001",
  "fullName": "Jean Dupont",
  "phoneNumber": "+241061234567",
  "address": "123 Rue de l'Indépendance, Libreville",
  "amount": 50000,
  "currency": "XAF"
}

Response:
{
  "success": true,
  "orderId": "ORDER001",
  "message": "Commande pour paiement en espèces créée avec succès",
  "data": { ... }
}
```

### ✅ Vérifier le Statut d'une Transaction
```
GET /api/singpay/transaction-status/{transactionId}

Response:
{
  "success": true,
  "message": "Statut récupéré avec succès",
  "data": {
    "status": "completed",
    "amount": 50000,
    "reference": "LD-ORDER001-1699564800000",
    ...
  }
}
```

### 🔍 Récupérer une Transaction par Référence
```
GET /api/singpay/transaction-by-reference/{reference}

Response:
{
  "success": true,
  "message": "Transaction trouvée",
  "data": { ... }
}
```

### 📨 Webhook Callback (SingPay → Backend)
```
POST /api/singpay/callback

Body:
{
  "reference": "LD-ORDER001-1699564800000",
  "status": "completed",
  "amount": 50000,
  "transaction_id": "TXN12345",
  "message": "Paiement réussi"
}

Response:
{
  "success": true,
  "message": "Callback reçue et traitée"
}
```

## Configuration des Callbacks SingPay

Vous devez configurer les URLs de callback dans votre tableau de bord SingPay:

1. **URL Callback (asynchrone):**
   - Production: `https://yourapp.com/api/singpay/callback`
   - Développement: `http://localhost:5100/api/singpay/callback` (si exposé)

2. **URL de Retour (après paiement):**
   - Production: `https://yourapp.com/order-success`
   - Développement: `http://localhost:5100/order-success`

## Structure du Backend

```
backend/
├── server.ts              # Serveur Express principal
├── package.json           # Dépendances Node.js
├── tsconfig.json          # Configuration TypeScript
├── .env.example           # Variables d'environnement (exemple)
├── .env.local             # Variables d'environnement (réel, à créer)
└── routes/
    └── singpay.routes.ts  # Routes API SingPay
```

## Points de Sécurité Importants

1. ✅ **Clés API côté serveur:** Les credentials SingPay ne sont jamais exposés au frontend
2. ✅ **CORS activé:** Limite l'accès au frontend autorisé
3. ✅ **Validation des paramètres:** Tous les paramètres sont validés avant d'être envoyés à SingPay
4. ✅ **Gestion des erreurs:** Les erreurs sensibles ne sont pas exposées au client
5. ⚠️ **À implémenter:** Signature des webhooks, validation des requêtes, authentification API

## Troubleshooting

### Le backend ne démarre pas
- Vérifiez que le port 3000 est disponible
- Vérifiez les variables d'environnement dans `.env.local`
- Vérifiez les logs pour les erreurs TypeScript

### Les requêtes API retournent 404
- Assurez-vous que le backend est en cours d'exécution
- Vérifiez que le proxy est configuré dans `vite.config.ts`
- Vérifiez l'URL de la requête côté frontend

### "CORS error"
- Vérifiez que `FRONTEND_URL` correspond à votre URL locale
- Vérifiez les logs du backend pour le détail de l'erreur

## Support

Pour des questions sur l'API SingPay, consultez la documentation officielle:
- https://client.singpay.ga/doc/reference/index.html

Pour des problèmes techniques spécifiques à La Délicieuse, consultez le README principal.
