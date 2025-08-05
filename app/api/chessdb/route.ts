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
      // 验证 FEN 格式
      if (!isValidFen(fen)) {
        return NextResponse.json({ error: 'Invalid FEN format' }, { status: 400 });
      }
      chessDbUrl = `https://www.chessdb.cn/chessdb.php?action=queryall&board=${encodeURIComponent(fen)}`;
    } else if (gameId) {
      chessDbUrl = `https://www.chessdb.cn/chessdb.php?action=query&board=${encodeURIComponent(gameId)}`;
    } else {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const response = await fetch(chessDbUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: `ChessDB API error: ${response.status}` }, { status: 500 });
    }

    const data = await response.text();
    
    // 检查是否返回了错误信息
    if (data.includes('invalid') || data.includes('error')) {
      return NextResponse.json({ error: 'ChessDB reported invalid board or position' }, { status: 400 });
    }
    
    // Try to parse moves from ChessDB response if loading a game
    if (gameId && data) {
      try {
        const moves = parseChessDBResponse(data);
        return NextResponse.json({ data, moves });
      } catch (parseError) {
        return NextResponse.json({ data, moves: [] });
      }
    }
    
    return NextResponse.json({ data: data || 'No data returned from ChessDB' });
  } catch (error) {
    console.error('ChessDB API Error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch from ChessDB API. The service might be temporarily unavailable.' 
    }, { status: 500 });
  }
}

function isValidFen(fen: string): boolean {
  if (!fen || typeof fen !== 'string') return false;
  
  const parts = fen.trim().split(' ');
  if (parts.length < 2) return false;
  
  const board = parts[0];
  const rows = board.split('/');
  
  // 象棋棋盘是 10 行
  if (rows.length !== 10) return false;
  
  // 检查每行的格式
  for (const row of rows) {
    let colCount = 0;
    for (const char of row) {
      if (char >= '1' && char <= '9') {
        colCount += parseInt(char);
      } else if ('RNBAKCPrnbakcp'.includes(char)) {
        colCount += 1;
      } else {
        return false;
      }
    }
    // 每行应该有 9 列
    if (colCount !== 9) return false;
  }
  
  return true;
}

function parseChessDBResponse(data: string): any[] {
  try {
    // 如果响应是 JSON 格式
    const parsed = JSON.parse(data);
    return parsed.moves || [];
  } catch {
    // 如果不是 JSON，尝试从文本中提取信息
    // 这里可以根据实际的 ChessDB 响应格式来解析
    return [];
  }
}