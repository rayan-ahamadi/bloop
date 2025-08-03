# Configuration Socket.io pour le Chat

## Routes HTTP disponibles

Le système de chat est maintenant complètement fonctionnel côté Symfony avec les routes suivantes :

### 1. Récupérer les rooms d'un utilisateur

```
GET /api/message/rooms
Headers: Authorization: Bearer {jwt_token}
```

Retourne la liste des rooms avec le dernier message et le nombre de messages non lus.

### 2. Récupérer les messages d'une room

```
GET /api/message/rooms/{id}/messages?page=1&limit=50
Headers: Authorization: Bearer {jwt_token}
```

### 3. Créer une nouvelle room

```
POST /api/message/rooms
Headers:
  Authorization: Bearer {jwt_token}
  Content-Type: application/json

Body:
{
  "type": "DM" | "GROUP",
  "name": "Nom de la room" (optionnel pour DM),
  "participant_ids": [1, 2, 3]
}
```

### 4. Envoyer un message

```
POST /api/message/rooms/{roomId}/messages
Headers:
  Authorization: Bearer {jwt_token}
  Content-Type: application/json

Body:
{
  "content": "Message content",
  "image": "image_url" (optionnel)
}
```

### 5. Ajouter des participants (GROUP seulement)

```
POST /api/message/rooms/{roomId}/participants
Headers:
  Authorization: Bearer {jwt_token}
  Content-Type: application/json

Body:
{
  "user_ids": [4, 5, 6]
}
```

### 6. Marquer un message comme lu

```
POST /api/message/messages/{messageId}/read
Headers: Authorization: Bearer {jwt_token}
```

## Structure des entités

### ChatRoom

-   `id`: ID unique
-   `type`: 'DM' ou 'GROUP'
-   `identifier`: Identifiant unique généré
-   `name`: Nom de la room (optionnel pour DM)
-   `created_at`: Date de création
-   `participants`: Collection des participants
-   `messages`: Collection des messages

### RoomMessage

-   `id`: ID unique
-   `content`: Contenu du message
-   `image`: URL d'image (optionnel)
-   `sent_at`: Date d'envoi
-   `user`: Auteur du message
-   `room`: Room du message
-   `read_by`: Collection des utilisateurs ayant lu le message

### RoomParticipant

-   `room`: Référence vers la room
-   `user`: Référence vers l'utilisateur
-   `joined_at`: Date d'ajout

## Intégration Socket.io

Pour intégrer avec Socket.io, tu peux :

1. **Socket.io Server Express** : Créer un serveur Express avec Socket.io qui utilise ces APIs HTTP
2. **Événements en temps réel** :

    - `new_message`: Diffuser les nouveaux messages
    - `user_joined`: Utilisateur rejoint une room
    - `user_left`: Utilisateur quitte une room
    - `message_read`: Message marqué comme lu
    - `user_typing`: Utilisateur en train de taper

3. **Authentication Socket.io** : Utiliser le JWT token pour authentifier les connections WebSocket

Exemple de structure Socket.io :

```javascript
// Événements à écouter
socket.on("join_room", (roomId) => {
    // Rejoindre la room WebSocket
});

socket.on("send_message", async (data) => {
    // Faire l'appel HTTP POST /api/message/rooms/{roomId}/messages
    // Puis diffuser le message à tous les participants
});

socket.on("mark_read", async (messageId) => {
    // Faire l'appel HTTP POST /api/message/messages/{messageId}/read
    // Puis notifier les autres participants
});
```

## Groupes de sérialisation

Les entités utilisent les groupes suivants :

-   `room:read` : Données de base des rooms
-   `message:read` : Données des messages
-   `user:read` : Données utilisateur (pour les participants et auteurs)

Cette architecture permet une séparation claire entre la persistance (Symfony) et le temps réel (Socket.io).
