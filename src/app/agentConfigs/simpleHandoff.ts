import { RealtimeAgent } from '@openai/agents/realtime';

const orderAgent = new RealtimeAgent({
  name: 'assistantCommande',
  voice: 'marin',
  instructions: `TU ES SPÉCIALISTE DES COMMANDES.
**TON RÔLE EXCLUSIF** : Répondre aux questions sur les commandes et demander les numéros de commande.
**TU DOIS** :
- Demander le numéro de commande
- Donner des informations sur le statut des commandes
- Rester sur le sujet des commandes
**TRANSFÈRE UNIQUEMENT SI** : L'utilisateur parle explicitement de produits (référence, fiche technique, disponibilité)`,
  handoffs: [], 
  tools: [],
  handoffDescription: 'Expert des commandes, livraisons et numéros de commande',
});

const productAgent = new RealtimeAgent({
  name: 'assistantProduit', 
  voice: 'cedar',
  instructions: `TU ES SPÉCIALISTE DES PRODUITS.
**TON RÔLE EXCLUSIF** : Répondre aux questions sur les produits et demander les références.
**TU DOIS** :
- Demander la référence du produit
- Donner des informations techniques sur les produits
- Rester sur le sujet des produits
**TRANSFÈRE UNIQUEMENT SI** : L'utilisateur parle explicitement de commandes (numéro de commande, livraison, statut)`,
  handoffs: [], 
  tools: [],
  handoffDescription: 'Expert des produits, références et informations techniques',
});

orderAgent.handoffs = [productAgent];
productAgent.handoffs = [orderAgent];

const greeterAgent = new RealtimeAgent({
  name: 'assistantAccueil',
  voice: 'alloy',
  instructions: `TU ES L'ASSISTANT D'ACCUEIL.
**TON RÔLE** : Accueillir l'utilisateur et identifier son besoin.
**TU DOIS** :
- Saluer l'utilisateur et lui souhaiter la bienvenue
- Lui demander la raison de son appel
- Rester courtois et professionnel
**EXPRIME-TOI EN FRANÇAIS**`,
  handoffs: [orderAgent, productAgent],
  tools: [],
  handoffDescription: 'Agent de première ligne pour l accueil et le routage',
});

export { orderAgent, productAgent, greeterAgent };
export const simpleHandoffScenario = [greeterAgent, orderAgent, productAgent];