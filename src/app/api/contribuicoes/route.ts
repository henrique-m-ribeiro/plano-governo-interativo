/**
 * API Route para contribuições cidadãs
 * Placeholder — a integração real será com Supabase ou similar
 *
 * POST: recebe uma contribuição (por enquanto, loga no console e retorna sucesso)
 * GET: retorna array vazio (placeholder para quando houver backend)
 */

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const dados = await request.json();

    // Placeholder: loga a contribuição no console do servidor
    console.log('[Contribuição recebida]', {
      municipio: dados.municipio,
      eixoId: dados.eixoId,
      texto: dados.texto?.substring(0, 100),
      nome: dados.nome || '(anônimo)',
      dataRegistro: new Date().toISOString(),
    });

    // TODO: Integrar com Supabase ou banco de dados
    // TODO: Enviar para processamento por IA (classificação, extração de temas)

    return NextResponse.json(
      {
        sucesso: true,
        mensagem: 'Contribuição registrada com sucesso',
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao processar contribuição' },
      { status: 400 }
    );
  }
}

export async function GET() {
  // Placeholder: retorna array vazio até que haja backend real
  // TODO: Integrar com Supabase para retornar contribuições

  return NextResponse.json({
    contribuicoes: [],
    total: 0,
  });
}
