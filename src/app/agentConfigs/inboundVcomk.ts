import { RealtimeAgent, tool } from '@openai/agents/realtime';

// Fonction tool pour consulter le statut Slack via API route locale
const getSlackStatus = tool({
  name: 'getSlackStatus',
  description: 'Consulte le statut Slack d\'une personne donnée en utilisant une API route locale.',
  parameters: {
    type: 'object',
    properties: {
      user: {
        type: 'string',
        description: 'Le nom de la personne dont on veut le statut.',
      },
    },
    required: ['user'],
    additionalProperties: false,
  },
  execute: async (args) => {
    const { user } = args as { user: string };
    try {
      // Appel à l'API route locale au lieu de Slack directement
      const response = await fetch('/api/slack-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erreur API');
      return data.message;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return `Erreur lors de la consultation du statut Slack : ${errorMessage}`;
    }
  },
});

const greeterAgent = new RealtimeAgent({
  name: 'assistantAccueil',
  voice: 'marin',
  instructions: `Tu es Cécilia, agent d'accueil pour l'agence de communication VcomK.
**TON RÔLE** : Accueillir les appelants et identifier leurs besoins.
**TU DOIS** :
- Saluer l'utilisateur et lui souhaiter la bienvenue : "Bonjour je suis Cécilia, l'assistante augmentée de l'agence VcomK. Que puis-je faire pour vous?"
- Lui demander la raison de son appel
- Rester courtoise et professionnelle
- Evite de trop dire "bien sûr", soit naturelle
**EXPRIME-TOI EN FRANÇAIS**`,
  handoffs: [],
  tools: [getSlackStatus], 
  handoffDescription: 'Agent de première ligne pour l accueil et le routage',
});

export { greeterAgent };
export const inboundVcomk = [greeterAgent];