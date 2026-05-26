# SingPay OAuth 2.0 - Commandes Rapides

Rapidement lancer et tester l'intégration SingPay OAuth 2.0

## 🚀 Démarrage du Serveur

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Le serveur démarre sur http://localhost:3000
```

## 🧪 Tester l'Intégration

### Option 1 : Script TypeScript (Recommandé)
```bash
# Terminal 2 - Tests automatisés (depuis la racine)
npx ts-node test-singpay-oauth.ts
```

### Option 2 : Vérifier la configuration
```bash
# Vérifier que l'authentification fonctionne
curl http://localhost:3000/api/singpay/auth-status | jq .
```

### Option 3 : Tester un paiement
```bash
# Test Airtel Money
curl -X POST http://localhost:3000/api/singpay/airtel-payment \
  -H "Content-Type: application/json" \
  -d '{
    "montant": 10000,
    "telephone": "+24107123456",
    "reference": "TEST-001",
    "description": "Test Airtel",
    "urlCallback": "http://localhost:3000/api/singpay/callback",
    "urlRetour": "http://localhost:5101/cart"
  }' | jq .

# Test Moov Money
curl -X POST http://localhost:3000/api/singpay/moov-payment \
  -H "Content-Type: application/json" \
  -d '{
    "montant": 5000,
    "telephone": "+24107654321",
    "reference": "TEST-002",
    "description": "Test Moov"
  }' | jq .

# Test Carte
curl -X POST http://localhost:3000/api/singpay/card-payment \
  -H "Content-Type: application/json" \
  -d '{
    "montant": 25000,
    "telephone": "+24107999999",
    "email": "test@example.com",
    "reference": "TEST-003",
    "description": "Test Card"
  }' | jq .
```

## 📊 Vérifier les Logs

Regardez le terminal du backend pour voir :
```
🔐 Demande d'un nouveau token SingPay...
✓ Token SingPay obtenu avec succès (expire dans 3600s)
✓ Token SingPay valide en cache
```

## 📋 Checklist Avant la Présentation

- [ ] Backend lancé (`npm run dev` dans le dossier backend)
- [ ] Endpoint d'authentification répond (`/api/singpay/auth-status`)
- [ ] Tests passent (`npx ts-node test-singpay-oauth.ts`)
- [ ] Variables d'environnement configurées (`.env.local`)
- [ ] Logs OAuth visibles dans le terminal backend

## 🔑 Credentials OAuth (Déjà configurés)

```
Client ID: 4ffde10f-c351-45e0-b2cc-a51b6bc4fb6c
Client Secret: 7dde76d29d737b31f1108d135a7fca3555df437748d29aaea8deaeb93f837a9d
```

## 📚 Ressources Utiles

- `SINGPAY_OAUTH_GUIDE.md` - Documentation complète
- `IMPLEMENTATION_REPORT.md` - Rapport d'implémentation
- `backend/services/singpay-oauth.ts` - Code OAuth
- `backend/routes/singpay.routes.ts` - Routes SingPay

## 🎯 Points à Montrer Demain

1. **Authentification active** - Montrer `/api/singpay/auth-status`
2. **Token management** - Expliquer le caching et renouvellement
3. **Paiements fonctionnels** - Créer un paiement test
4. **Logs clairs** - Montrer les logs OAuth dans le terminal
5. **Documentation** - Consulter SINGPAY_OAUTH_GUIDE.md

## ⚡ Troubleshooting

### "Cannot find module 'singpay-oauth'"
```bash
# Vérifier que le fichier existe
ls backend/services/singpay-oauth.ts

# Vérifier la compilation TypeScript
cd backend && npm run build
```

### "Token request failed"
```bash
# Vérifier les variables d'environnement
echo $SINGPAY_OAUTH_CLIENT_ID
echo $SINGPAY_OAUTH_CLIENT_SECRET

# Vérifier la connexion Internet
ping gateway.singpay.ga
```

### "Port 3000 already in use"
```bash
# Lancer sur un port différent
NODE_PORT=3001 npm run dev
```

---

**Prêt pour la présentation !** 🎉
