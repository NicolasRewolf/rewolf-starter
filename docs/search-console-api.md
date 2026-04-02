# Connecter l’API Google Search Console (OAuth 2.0)

Ce guide décrit une intégration **production‑safe** : le **secret OAuth** et les **refresh tokens** restent **côté serveur**. Le front (Vite) ne fait qu’appeler ton API.

---

## 1. Pourquoi un backend ?

| Approche | Verdict |
|----------|---------|
| **Clé API seule** | L’API Search Console **ne s’utilise pas** avec une simple clé API publique pour les données de performance ; il faut **OAuth** (accès aux propriétés du compte Google). |
| **OAuth dans le navigateur + `client_secret` dans le front** | **À proscrire** : le secret serait exposé dans le bundle. |
| **Backend (Node, etc.) + OAuth** | **Recommandé** : échange `code` → tokens sur le serveur, stockage du refresh token de façon sécurisée. |

---

## 2. Google Cloud — projet et API

1. Ouvre [Google Cloud Console](https://console.cloud.google.com/).
2. Crée un **projet** (menu déroulant en haut → **Nouveau projet**), ou sélectionne un projet existant.
3. Menu **APIs et services** → **Bibliothèque**.
4. Cherche **Google Search Console API** → **Activer**.

---

## 3. Écran de consentement OAuth

1. **APIs et services** → **Écran de consentement OAuth**.
2. Type d’utilisateur : en général **Externe** (pour un compte Google perso / tests).
3. Renseigne au minimum :
   - **Nom de l’application**
   - **E-mail d’assistance utilisateur**
   - **Domaines autorisés** (pour la prod, quand tu auras un domaine ; en local tu peux laisser vide au début ou utiliser `localhost` selon les champs proposés).
4. **Scopes** → **Ajouter ou supprimer des champs d’application** → **Ajouter des champs d’application manuellement** et ajoute :

   ```text
   https://www.googleapis.com/auth/webmasters.readonly
   ```

   (Lecture seule des données Search Console ; suffisant pour un dashboard SEO.)

5. **Utilisateurs test** (tant que l’app n’est pas validée par Google) : ajoute **l’adresse Gmail** qui doit pouvoir se connecter.

6. Enregistre.

---

## 4. Identifiants OAuth 2.0 (client Web)

1. **APIs et services** → **Identifiants** → **Créer des identifiants** → **ID client OAuth**.
2. Type d’application : **Application Web**.
3. **Nom** : ex. `REWOLF SEO local`.
4. **URI de redirection autorisés** — selon où ton backend reçoit le callback OAuth, par exemple :

   ```text
   http://localhost:8787/auth/google/callback
   ```

   Remplace par l’URL exacte de **ta** route de callback (port + chemin). Elle doit **correspondre au caractère près** à celle utilisée dans le flux OAuth.

5. Crée → récupère :
   - **ID client** (`xxx.apps.googleusercontent.com`)
   - **Secret client** (garde-le **uniquement** sur le serveur / dans des secrets, jamais dans le dépôt public).

Variables d’environnement côté **serveur** (exemples de noms) :

```env
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxx
GOOGLE_REDIRECT_URI=http://localhost:8787/auth/google/callback
```

### Fichier JSON « client_secret_….apps.googleusercontent.com.json »

Google propose souvent un fichier JSON contenant `client_id`, `client_secret`, etc. Tu peux le **garder en local** dans le dossier du projet pour le développement, mais :

- il est **listé dans `.gitignore`** (ne doit **jamais** être poussé sur GitHub) ;
- en prod, préfère des **variables d’environnement** ou un **gestionnaire de secrets** plutôt que ce fichier sur le disque.

Si le secret a déjà fuité (commit public, capture d’écran), **régénère le secret** dans Google Cloud → Identifiants → ton ID client OAuth → Réinitialiser le secret.

---

## 5. Flux OAuth (résumé)

1. L’utilisateur clique « Se connecter avec Google » sur le front.
2. Le front redirige vers une URL d’autorisation Google (ou ouvre une popup) avec :
   - `client_id`
   - `redirect_uri` (identique à celui enregistré)
   - `response_type=code`
   - `scope=https://www.googleapis.com/auth/webmasters.readonly`
   - `access_type=offline` (pour obtenir un **refresh token** la première fois)
   - `prompt=consent` (utile en dev pour forcer le retour d’un refresh token)
3. Google redirige vers ton **backend** avec un `code` dans l’URL.
4. Le **backend** échange `code` + `client_secret` contre `access_token` et `refresh_token` (requête POST vers `https://oauth2.googleapis.com/token`).
5. Tu stockes le **refresh token** de façon sécurisée (base de données chiffrée, secret manager, etc.).
6. Les appels à l’API Search Console utilisent un `access_token` valide ; quand il expire, tu le renouvelles avec le `refresh_token`.

Documentation Google : [Using OAuth 2.0 to Access Google APIs](https://developers.google.com/identity/protocols/oauth2).

---

## 6. Appels utiles à l’API Search Console

- **Lister les propriétés accessibles**  
  `GET https://searchconsole.googleapis.com/v1/sites`  
  (avec en-tête `Authorization: Bearer <access_token>`)

- **Rapport de performance (requêtes, pages, pays, etc.)**  
  `POST https://searchconsole.googleapis.com/v1/sites/{siteUrl}/searchAnalytics/query`  

  `{siteUrl}` doit être **encodé en URL** (ex. `https%3A%2F%2Fwww.example.com%2F`).

Référence : [Search Console API](https://developers.google.com/webmaster-tools/v1/api_reference_index).

En Node, le package officiel **`googleapis`** simplifie tout ça (client OAuth2 + appels typés).

---

## 7. Côté front (Vite)

- **Ne mets pas** `GOOGLE_CLIENT_SECRET` dans Vite.
- Tu peux exposer uniquement **`VITE_GOOGLE_CLIENT_ID`** si tu construis l’URL d’autorisation côté client (le secret reste serveur).
- Les données du dashboard viennent de **ton** backend, par ex. :

  ```env
  VITE_SEO_API_BASE=http://localhost:8787
  ```

---

## 8. Checklist avant prod

- [ ] Domaines / écran de consentement à jour si tu changes de domaine.
- [ ] Passer l’app en **production** dans l’écran de consentement si tu sors des « utilisateurs test ».
- [ ] HTTPS partout (origine front + redirect URI).
- [ ] Rotation des secrets et stockage chiffré des refresh tokens.
- [ ] Respect des [quotas](https://developers.google.com/webmaster-tools/limits) Search Console.

---

## 9. Ressources

- [Search Console API — Vue d’ensemble](https://developers.google.com/webmaster-tools)
- [Search Analytics — méthode `query`](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)
- [Bibliothèque OAuth Google](https://github.com/googleapis/google-auth-library-nodejs) (Node)

Une fois le backend en place, remplace le snapshot dans `src/data/gsc-seo-dashboard.ts` par des appels `fetch` vers tes routes API.

---

## Mode développement (ce repo)

1. **URI de redirection** dans Google Cloud : doit correspondre exactement à celle utilisée par le serveur, par ex.  
   `http://localhost:8787/auth/google/callback`  
   (voir `OAUTH_REDIRECT_URI` dans `.env.example`.)

2. **Deux processus** : API Express (port `8787`) + Vite (port `5173`). À la racine :

   ```bash
   npm run dev:full
   ```

   Ou deux terminaux : `npm run dev:api` puis `npm run dev`.

3. **Proxy Vite** : les chemins `/api/*` et `/auth/*` sont proxifiés vers `http://localhost:8787` (voir `vite.config.ts`).

4. **Flux** : bouton « Google » → `/auth/google` → consentement Google → callback sur le serveur → enregistrement de `gsc-oauth-tokens.json` → redirection vers le front avec `?gsc_connected=1`.

5. **Variables** : copier `.env.example` vers `.env` si tu changes port ou URL du front.
