import { RealtimeAgent } from '@openai/agents/realtime';

const orderAgent = new RealtimeAgent({
  name: 'assistantCommande',
  voice: 'marin',
  instructions: 'Ask the user for the order number.',
  handoffs: [],
  tools: [],
  handoffDescription: 'Agent that gives information about orders',
});

const produtAgent = new RealtimeAgent({
  name: 'assistantProduit', 
  voice: 'cedar',
  instructions: 'Ask the user for the product reference.',
  handoffs: [], 
  tools: [],
  handoffDescription: 'Agent that gives information about products',
});

orderAgent.handoffs = [produtAgent];
produtAgent.handoffs = [orderAgent];

const greeterAgent = new RealtimeAgent({
  name: 'assistantAccueil',
  voice: 'alloy',
  instructions: "Please greet the user and ask the purpose of the call. Express yourself in french.",
  handoffs: [orderAgent, produtAgent], 
  tools: [],
  handoffDescription: 'Agent that greets the user',
});

export { orderAgent, produtAgent, greeterAgent };
export const simpleHandoffScenario = [greeterAgent, orderAgent, produtAgent];