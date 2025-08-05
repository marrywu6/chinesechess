import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fen = searchParams.get('fen');

  if (!fen) {
    return NextResponse.json({ error: 'FEN string is required' }, { status: 400 });
  }

  const chessDbUrl = `https://www.chessdb.cn/chessdb.php?action=queryall&board=${fen}`;

  try {
    const response = await fetch(chessDbUrl);
    const data = await response.text();
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch from ChessDB API' }, { status: 500 });
  }
}