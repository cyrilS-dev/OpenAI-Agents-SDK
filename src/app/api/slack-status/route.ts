import { NextRequest, NextResponse } from 'next/server';

const SLACK_TOKEN = process.env.SLACK_TOKEN; // Déplacer dans .env côté serveur

if (!SLACK_TOKEN) {
  throw new Error('SLACK_TOKEN non défini dans les variables d’environnement.');
}

const userIdMap: Record<string, string> = {
  'Katia': 'U013FR96YDB',
  'Cyril': 'U057VV2EBD3',
  'Valérie': 'U013FCQBY5D'
};

export async function POST(request: NextRequest) {
  try {
    const { user } = await request.json();
    if (!user) {
      return NextResponse.json({ error: 'Paramètre "user" requis.' }, { status: 400 });
    }

    const userId = userIdMap[user];
    if (!userId) {
      return NextResponse.json({ message: `Utilisateur "${user}" non trouvé dans le mapping.` });
    }

    // Appel à Slack côté serveur
    const presenceResponse = await fetch(`https://slack.com/api/users.getPresence?user=${userId}`, {
      headers: { 'Authorization': `Bearer ${SLACK_TOKEN}` },
    });
    const presenceData = await presenceResponse.json();
    if (!presenceData.ok) {
      return NextResponse.json({ error: `Erreur Slack: ${presenceData.error}` }, { status: 500 });
    }

    const presence = presenceData.presence; // "active" ou "away"
    const message = `Le statut Slack de ${user} est : ${presence === 'active' ? 'Actif' : 'Absent'}`;

    return NextResponse.json({ message });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `Erreur serveur: ${errorMessage}` }, { status: 500 });
  }
}