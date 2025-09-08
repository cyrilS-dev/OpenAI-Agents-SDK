import { RealtimeAgent, tool } from '@openai/agents/realtime';

// Remplacez par votre token Slack (nécessite un token avec les scopes appropriés : users:read)
const SLACK_TOKEN = process.env.SLACK_TOKEN;

if (!SLACK_TOKEN) {
  throw new Error('SLACK_TOKEN non défini dans les variables d’environnement.');
}


const userIdMap: Record<string, string> = {
  'Katia': 'U013FR96YDB',
  'Cyril': 'U057VV2EBD3',
  'Valérie': 'U013FCQBY5D'

};

// Fonction tool pour consulter le statut Slack via API
const getSlackStatus = tool({
  name: 'getSlackStatus',
  description: 'Consulte le statut Slack d\'une personne donnée en utilisant l\'API Slack.',
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
      const userId = userIdMap[user];
      if (!userId) {
        return `Utilisateur "${user}" non trouvé dans le mapping.`;
      }

      // Récupérer la présence utilisateur via users.getPresence
      const presenceResponse = await fetch(`https://slack.com/api/users.getPresence?user=${userId}`, {
        headers: { 'Authorization': `Bearer ${SLACK_TOKEN}` },
      });
      const presenceData = await presenceResponse.json();
      if (!presenceData.ok) throw new Error(`Erreur présence: ${presenceData.error}`);

      const presence = presenceData.presence;  // "active" ou "away"

      return `Le statut Slack de ${user} est : ${presence === 'active' ? 'Actif' : 'Absent'}`;
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