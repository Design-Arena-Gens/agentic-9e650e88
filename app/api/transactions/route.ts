import { NextRequest, NextResponse } from 'next/server';
import {
  ajouterMouvement,
  getMovements,
  getSeuilEncaissement,
  getSummary
} from '@/lib/dataStore';
import { TransactionType } from '@/lib/types';

const TYPES_AUTORISES: Record<TransactionType, { origine: string[]; destination: string[] }> = {
  depot: {
    origine: ['transport', 'client', 'externe'],
    destination: ['guichet', 'coffre']
  },
  retrait: {
    origine: ['guichet', 'dab'],
    destination: ['client']
  },
  atm_chargement: {
    origine: ['coffre'],
    destination: ['dab']
  },
  atm_dechargement: {
    origine: ['dab'],
    destination: ['coffre']
  },
  ajustement: {
    origine: ['dab', 'coffre', 'guichet'],
    destination: ['dab', 'coffre', 'guichet']
  }
};

function validerPayload(payload: any) {
  const erreurs: string[] = [];

  if (!payload) {
    return ['Payload manquant'];
  }

  const { type, montant, origine, destination, commentaire, operateur } = payload;

  if (!type || !Object.keys(TYPES_AUTORISES).includes(type)) {
    erreurs.push('Type de mouvement invalide');
  }

  if (typeof montant !== 'number' || Number.isNaN(montant) || montant <= 0) {
    erreurs.push('Montant invalide');
  }

  if (!origine || typeof origine !== 'string') {
    erreurs.push('Origine invalide');
  }

  if (!destination || typeof destination !== 'string') {
    erreurs.push('Destination invalide');
  }

  if (!operateur || typeof operateur !== 'string') {
    erreurs.push("Opérateur requis");
  }

  if (commentaire && typeof commentaire !== 'string') {
    erreurs.push('Commentaire doit être une chaîne');
  }

  if (type && TYPES_AUTORISES[type as TransactionType]) {
    const { origine: origines, destination: destinations } = TYPES_AUTORISES[type as TransactionType];
    if (!origines.includes(origine)) {
      erreurs.push(`Origine ${origine} non autorisée pour ${type}`);
    }
    if (!destinations.includes(destination)) {
      erreurs.push(`Destination ${destination} non autorisée pour ${type}`);
    }
  }

  return erreurs;
}

export async function GET() {
  const summary = getSummary();
  const movements = getMovements();
  return NextResponse.json({
    seuil: getSeuilEncaissement(),
    summary,
    movements
  });
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const erreurs = validerPayload(payload);

    if (erreurs.length > 0) {
      return NextResponse.json(
        { message: 'Validation échouée', erreurs },
        { status: 400 }
      );
    }

    const mouvement = ajouterMouvement({
      type: payload.type,
      montant: payload.montant,
      origine: payload.origine,
      destination: payload.destination,
      commentaire: payload.commentaire,
      operateur: payload.operateur,
      reference: payload.reference
    });

    return NextResponse.json({
      message: 'Mouvement enregistré',
      mouvement,
      summary: getSummary()
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur interne', detail: (error as Error).message },
      { status: 500 }
    );
  }
}
