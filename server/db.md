# 🧠 Base de données – Twitter-like (Structure harmonisée)

## 📋 Tables Principales

### 👤 `users`

```sql
id              INT          PK, AUTO_INCREMENT
username        VARCHAR(50)  UNIQUE, NOT NULL
email           VARCHAR(100) UNIQUE, NOT NULL
password        VARCHAR(255) NOT NULL
bio             TEXT         NULLABLE
avatar_url      VARCHAR(255) NULLABLE
banner_url      VARCHAR(255) NULLABLE
location        VARCHAR(100) NULLABLE
website         VARCHAR(255) NULLABLE
birth_date      DATE         NULLABLE
is_verified     BOOLEAN      DEFAULT FALSE
email_verified_at DATETIME   NULLABLE
last_login_at   DATETIME     NULLABLE
status          ENUM('active', 'suspended', 'banned') DEFAULT 'active'
language        VARCHAR(10)  DEFAULT 'fr'
timezone        VARCHAR(50)  DEFAULT 'Europe/Paris'
created_at      DATETIME     DEFAULT CURRENT_TIMESTAMP
updated_at      DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
deleted_at      DATETIME     NULLABLE
```

**Utilité** : Table centrale qui stocke toutes les informations des utilisateurs. Elle gère les profils, l'authentification et les préférences utilisateur. Le champ `status` permet de gérer les comptes (actif, suspendu, banni) et le `deleted_at` permet de faire du "soft delete" (suppression logique sans perdre les données).

### 📝 `posts`

```sql
id               INT          PK, AUTO_INCREMENT
user_id          INT          FK → users.id, NOT NULL
content          TEXT         NOT NULL
type             ENUM('original', 'retweet', 'reply') DEFAULT 'original'
parent_post_id   INT          FK → posts.id NULLABLE
language         VARCHAR(10)  DEFAULT 'fr'
likes_count      INT          DEFAULT 0
retweets_count   INT          DEFAULT 0
views_count      INT          DEFAULT 0
impressions_count INT         DEFAULT 0
clicks_count     INT          DEFAULT 0
engagement_score FLOAT        DEFAULT 0
is_pinned        BOOLEAN      DEFAULT FALSE
status           ENUM('active', 'hidden', 'deleted') DEFAULT 'active'
created_at       DATETIME     DEFAULT CURRENT_TIMESTAMP
updated_at       DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
deleted_at       DATETIME     NULLABLE
```

**Utilité** : Table principale pour le contenu. Elle stocke tous les posts, retweets et réponses. Les compteurs (`likes_count`, `retweets_count`, etc.) permettent d'avoir rapidement les statistiques sans faire de jointures. Le champ `type` différencie les posts originaux des retweets et réponses.

### 📎 `media`

```sql
id              INT          PK, AUTO_INCREMENT
post_id         INT          FK → posts.id, NOT NULL
type            ENUM('image', 'video', 'audio') NOT NULL
url             VARCHAR(255) NOT NULL
mime_type       VARCHAR(100) NOT NULL
file_size       INT          NULLABLE
duration        INT          NULLABLE
width           INT          NULLABLE
height          INT          NULLABLE
status          ENUM('uploading', 'processing', 'ready', 'error') DEFAULT 'uploading'
created_at      DATETIME     DEFAULT CURRENT_TIMESTAMP
updated_at      DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
deleted_at      DATETIME     NULLABLE
```

**Utilité** : Gère tous les médias (images, vidéos, audio) attachés aux posts. Le champ `status` permet de suivre le traitement des fichiers (upload, traitement, prêt, erreur). Les métadonnées (`width`, `height`, `duration`) sont utiles pour l'affichage et l'optimisation.

### 💬 `comments`

```sql
id         INT      PK, AUTO_INCREMENT
user_id    INT      FK → users.id, NOT NULL
post_id    INT      FK → posts.id, NOT NULL
content    TEXT     NOT NULL
status     ENUM('active', 'hidden', 'deleted') DEFAULT 'active'
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
deleted_at DATETIME NULLABLE
```

**Utilité** : Permet aux utilisateurs de commenter les posts. Le champ `status` permet de gérer la modération des commentaires. Simple mais essentielle pour l'interaction sociale.

## ➕ Interactions

### ❤️ `post_likes`

```sql
id         INT      PK, AUTO_INCREMENT
user_id    INT      FK → users.id, NOT NULL
post_id    INT      FK → posts.id, NOT NULL
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

**Utilité** : Enregistre les "j'aime" sur les posts. Table simple mais cruciale pour l'engagement. Permet de savoir qui a aimé quoi et quand.

### 🔁 `post_retweets`

```sql
id         INT      PK, AUTO_INCREMENT
user_id    INT      FK → users.id, NOT NULL
post_id    INT      FK → posts.id, NOT NULL
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

**Utilité** : Gère les retweets (partages) de posts. Permet de suivre la viralité du contenu et de construire le feed des utilisateurs.

### 👁️ `post_views`

```sql
id         INT      PK, AUTO_INCREMENT
user_id    INT      FK → users.id, NOT NULL
post_id    INT      FK → posts.id, NOT NULL
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

**Utilité** : Suit les vues des posts. Important pour les analytics et la monétisation. Permet de mesurer la portée réelle du contenu.

### 📌 `post_bookmarks`

```sql
id         INT      PK, AUTO_INCREMENT
user_id    INT      FK → users.id, NOT NULL
post_id    INT      FK → posts.id, NOT NULL
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

**Utilité** : Permet aux utilisateurs de sauvegarder des posts pour les consulter plus tard. Fonctionnalité essentielle pour l'expérience utilisateur.

### 📤 `post_shares`

```sql
id         INT      PK, AUTO_INCREMENT
user_id    INT      FK → users.id, NOT NULL
post_id    INT      FK → posts.id, NOT NULL
shared_to  ENUM('external', 'dm', 'copy_link')
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

**Utilité** : Suit les partages de posts vers l'extérieur (autres plateformes, messages privés, etc.). Important pour l'analytics et la viralité.

## 🔖 Hashtags et Tendances

### 🔖 `hashtags`

```sql
id         INT          PK, AUTO_INCREMENT
name       VARCHAR(50)  UNIQUE, NOT NULL
created_at DATETIME     DEFAULT CURRENT_TIMESTAMP
```

**Utilité** : Stocke les hashtags utilisés dans l'application. Le champ `name` est unique pour éviter les doublons. Base pour la découverte de contenu.

### 🔗 `post_hashtags`

```sql
id         INT      PK, AUTO_INCREMENT
post_id    INT      FK → posts.id, NOT NULL
hashtag_id INT      FK → hashtags.id, NOT NULL
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

**Utilité** : Table de liaison entre posts et hashtags. Permet d'associer plusieurs hashtags à un post et de faire des recherches efficaces.

### 📈 `trending_topics`

```sql
id             INT          PK, AUTO_INCREMENT
hashtag_id     INT          FK → hashtags.id, NOT NULL
region         VARCHAR(50)  NULLABLE
trending_score FLOAT        DEFAULT 0
created_at     DATETIME     DEFAULT CURRENT_TIMESTAMP
```

**Utilité** : Suit les tendances des hashtags par région. Le `trending_score` est calculé en fonction de l'activité récente. Permet de montrer les sujets populaires.

## 👥 Relations Sociales

### 👥 `follows`

```sql
id          INT      PK, AUTO_INCREMENT
follower_id INT      FK → users.id, NOT NULL
followed_id INT      FK → users.id, NOT NULL
created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
```

**Utilité** : Gère les relations de suivi entre utilisateurs. Permet de construire le graphe social et de personnaliser le feed de chaque utilisateur.

## 💌 Messagerie

### 🧵 `conversations`

```sql
id         INT      PK, AUTO_INCREMENT
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

**Utilité** : Gère les conversations de messagerie privée. Peut être une conversation 1-1 ou de groupe. Le `updated_at` permet de trier les conversations par activité.

### 👥 `conversation_participants`

```sql
id              INT PK, AUTO_INCREMENT
conversation_id INT FK → conversations.id
user_id         INT FK → users.id
joined_at       DATETIME DEFAULT CURRENT_TIMESTAMP
```

**Utilité** : Gère les participants aux conversations. Permet les conversations de groupe et le suivi de qui a rejoint quand.

### 💬 `messages`

```sql
id              INT      PK, AUTO_INCREMENT
conversation_id INT      FK → conversations.id
sender_id       INT      FK → users.id
content         TEXT     NOT NULL
type            ENUM('text', 'media', 'link') DEFAULT 'text'
is_edited       BOOLEAN  DEFAULT FALSE
edited_at       DATETIME NULLABLE
status          ENUM('sent', 'delivered', 'read', 'error') DEFAULT 'sent'
created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
deleted_at      DATETIME NULLABLE
```

**Utilité** : Stocke les messages privés. Le champ `status` permet de suivre l'état du message (envoyé, livré, lu). Supporte différents types de contenu.

### ✅ `message_read`

```sql
id         INT      PK, AUTO_INCREMENT
message_id INT      FK → messages.id
reader_id  INT      FK → users.id
read_at    DATETIME DEFAULT CURRENT_TIMESTAMP
```

**Utilité** : Suit qui a lu quels messages. Important pour les indicateurs de lecture et les notifications.

## 📊 Analytics

### 📈 `post_analytics`

```sql
id              INT      PK, AUTO_INCREMENT
post_id         INT      FK → posts.id
date            DATE     NOT NULL
impressions     INT      DEFAULT 0
clicks          INT      DEFAULT 0
engagement_rate FLOAT    DEFAULT 0
created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
```

**Utilité** : Stocke les statistiques quotidiennes des posts. Permet de suivre la performance du contenu dans le temps.

## 🛡️ Modération

### ⚠️ `reports`

```sql
id              INT      PK, AUTO_INCREMENT
reporter_id     INT      FK → users.id
reported_id     INT      FK → users.id
post_id         INT      FK → posts.id NULLABLE
type            ENUM('spam', 'harassment', 'inappropriate', 'other')
description     TEXT     NULLABLE
status          ENUM('pending', 'reviewed', 'resolved') DEFAULT 'pending'
created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

**Utilité** : Système de signalement de contenu inapproprié. Permet aux utilisateurs de signaler les abus et aux modérateurs de les traiter.

## 📋 Lists

### 📑 `lists`

```sql
id          INT      PK, AUTO_INCREMENT
creator_id  INT      FK → users.id
name        VARCHAR(100) NOT NULL
description TEXT     NULLABLE
is_private  BOOLEAN  DEFAULT FALSE
created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

**Utilité** : Permet aux utilisateurs de créer des listes personnalisées d'autres utilisateurs. Utile pour organiser son feed et ses abonnements.

### 👥 `list_members`

```sql
id         INT      PK, AUTO_INCREMENT
list_id    INT      FK → lists.id
user_id    INT      FK → users.id
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

**Utilité** : Gère les membres des listes. Permet d'ajouter/retirer des utilisateurs des listes.

## 📊 Polls

### 📊 `polls`

```sql
id          INT      PK, AUTO_INCREMENT
post_id     INT      FK → posts.id
question    TEXT     NOT NULL
end_date    DATETIME NULLABLE
created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
```

**Utilité** : Permet de créer des sondages attachés aux posts. Le `end_date` permet de limiter la durée du sondage.

### 📝 `poll_options`

```sql
id         INT      PK, AUTO_INCREMENT
poll_id    INT      FK → polls.id
option     TEXT     NOT NULL
votes      INT      DEFAULT 0
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

**Utilité** : Stocke les options de réponse pour chaque sondage. Le champ `votes` permet de compter rapidement les votes.

### ✅ `poll_votes`

```sql
id         INT      PK, AUTO_INCREMENT
poll_id    INT      FK → polls.id
option_id  INT      FK → poll_options.id
user_id    INT      FK → users.id
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

**Utilité** : Enregistre les votes des utilisateurs. Permet de vérifier qu'un utilisateur ne vote qu'une fois.

## 🔍 Recherche et Recommandations

### 📊 `post_embeddings`

```sql
id              INT          PK, AUTO_INCREMENT
post_id         INT          FK → posts.id, NOT NULL
embedding       VECTOR(1536) NOT NULL
created_at      DATETIME     DEFAULT CURRENT_TIMESTAMP
updated_at      DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

**Utilité** : Stocke les représentations vectorielles des posts pour la recherche sémantique. Permet de trouver des posts similaires en sens, pas juste en mots-clés.

### 👤 `user_embeddings`

```sql
id              INT          PK, AUTO_INCREMENT
user_id         INT          FK → users.id, NOT NULL
embedding       VECTOR(1536) NOT NULL
created_at      DATETIME     DEFAULT CURRENT_TIMESTAMP
updated_at      DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

**Utilité** : Stocke les profils vectoriels des utilisateurs. Utilisé pour les recommandations personnalisées basées sur les intérêts.

### 🔄 `user_interests`

```sql
id              INT          PK, AUTO_INCREMENT
user_id         INT          FK → users.id, NOT NULL
interest        VARCHAR(100) NOT NULL
weight          FLOAT        DEFAULT 1.0
created_at      DATETIME     DEFAULT CURRENT_TIMESTAMP
updated_at      DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

**Utilité** : Stocke les intérêts des utilisateurs avec un poids. Utilisé pour améliorer les recommandations de contenu.

### 📈 `content_recommendations`

```sql
id              INT          PK, AUTO_INCREMENT
user_id         INT          FK → users.id, NOT NULL
post_id         INT          FK → posts.id, NOT NULL
score           FLOAT        NOT NULL
reason          VARCHAR(255) NULLABLE
created_at      DATETIME     DEFAULT CURRENT_TIMESTAMP
```

**Utilité** : Stocke les recommandations de contenu générées par le système. Le `score` indique la pertinence et le `reason` explique pourquoi le contenu est recommandé.

## 🎯 Analytics Avancés

### 📊 `user_behavior`

```sql
id              INT          PK, AUTO_INCREMENT
user_id         INT          FK → users.id, NOT NULL
action_type     ENUM('view', 'like', 'retweet', 'comment', 'share', 'bookmark')
post_id         INT          FK → posts.id, NULLABLE
duration        INT          NULLABLE
device_type     VARCHAR(50)  NULLABLE
created_at      DATETIME     DEFAULT CURRENT_TIMESTAMP
```

**Utilité** : Analyse détaillée du comportement des utilisateurs. Permet de comprendre comment les utilisateurs interagissent avec le contenu.

### 📈 `content_performance`

```sql
id              INT          PK, AUTO_INCREMENT
post_id         INT          FK → posts.id, NOT NULL
metric_type     ENUM('engagement', 'reach', 'virality', 'sentiment')
value           FLOAT        NOT NULL
period          ENUM('hourly', 'daily', 'weekly', 'monthly')
created_at      DATETIME     DEFAULT CURRENT_TIMESTAMP
```

**Utilité** : Métriques détaillées de performance du contenu. Permet de mesurer le succès des posts sur différentes périodes.

## 🛡️ Modération Avancée

### 🤖 `content_moderation`

```sql
id              INT          PK, AUTO_INCREMENT
post_id         INT          FK → posts.id, NOT NULL
moderation_type ENUM('text', 'image', 'video')
status          ENUM('pending', 'approved', 'rejected', 'flagged')
confidence      FLOAT        NULLABLE
ai_model        VARCHAR(100) NULLABLE
created_at      DATETIME     DEFAULT CURRENT_TIMESTAMP
updated_at      DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

**Utilité** : Système de modération automatisée du contenu. Utilise l'IA pour détecter le contenu inapproprié.

### 📝 `moderation_logs`

```sql
id              INT          PK, AUTO_INCREMENT
moderator_id    INT          FK → users.id, NULLABLE
content_id      INT          NOT NULL
content_type    ENUM('post', 'comment', 'user')
action          ENUM('approve', 'reject', 'flag', 'delete')
reason          TEXT         NULLABLE
created_at      DATETIME     DEFAULT CURRENT_TIMESTAMP
```

**Utilité** : Journalisation des actions de modération. Permet de suivre qui a fait quoi et pourquoi.

## 🔄 Cache et Performance

### 💾 `cache_metadata`

```sql
id              INT          PK, AUTO_INCREMENT
cache_key       VARCHAR(255) NOT NULL
entity_type     VARCHAR(50)  NOT NULL
entity_id       INT          NOT NULL
ttl             INT          NOT NULL
last_updated    DATETIME     DEFAULT CURRENT_TIMESTAMP
```

**Utilité** : Gestion des métadonnées de cache. Permet d'optimiser les performances en évitant de recalculer les données fréquemment utilisées.
