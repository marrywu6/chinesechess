import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fen = searchParams.get('fen');
  const gameId = searchParams.get('gameId');

  if (!fen && !gameId) {
    return NextResponse.json({ error: 'FEN string or gameId is required' }, { status: 400 });
  }

  try {
    let chessDbUrl: string;
    
    if (fen) {
      chessDbUrl = `https://www.chessdb.cn/chessdb.php?action=queryall&board=${encodeURIComponent(fen)}`;
    } else if (gameId) {
      chessDbUrl = `https://www.chessdb.cn/chessdb.php?action=query&board=${encodeURIComponent(gameId)}`;
    } else {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const response = await fetch(chessDbUrl);
    const data = await response.text();
    
    // Try to parse moves from ChessDB response if loading a game
    if (gameId && data) {
      try {
        // Parse the ChessDB response to extract moves
        // This is a simplified parser - you might need to adjust based on actual API response format
        const moves = parseChessDBResponse(data);
        return NextResponse.json({ data, moves });
      } catch (parseError) {
        return NextResponse.json({ data, moves: [] });
      }
    }
    
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch from ChessDB API' }, { status: 500 });
  }
}

function parseChessDBResponse(data: string): any[] {
  // This is a placeholder function - you'll need to implement actual parsing
  // based on the ChessDB API response format
  try {
    // If the response is JSON, try to parse it
    const parsed = JSON.parse(data);
    return parsed.moves || [];
  } catch {
    // If not JSON, try to extract moves from text response
    // This would need to be customized based on actual ChessDB format
    return [];
  }
}