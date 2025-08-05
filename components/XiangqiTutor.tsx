'use client';

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, BookOpen, Upload, Download } from 'lucide-react';
import { manuals, Move } from '../lib/manuals';

const XiangqiTutor: React.FC = () => {
  const [selectedManualIndex, setSelectedManualIndex] = useState<number>(0);
  const [selectedVariationIndex, setSelectedVariationIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(0);
  const [moves, setMoves] = useState<Move[]>([]);
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialBoard: string[][] = useMemo(() => [
    ['車', '馬', '象', '士', '將', '士', '象', '馬', '車'],
    ['', '', '', '', '', '', '', '', ''],
    ['', '砲', '', '', '', '', '', '砲', ''],
    ['卒', '', '卒', '', '卒', '', '卒', '', '卒'],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['兵', '', '兵', '', '兵', '', '兵', '', '兵'],
    ['', '炮', '', '', '', '', '', '炮', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['车', '马', '相', '仕', '帅', '仕', '相', '马', '车']
  ], []);

  const getPieceColor = useCallback((piece: string) => {
    if (!piece) return '';
    if (['车', '马', '相', '仕', '帅', '炮', '兵'].includes(piece)) return 'text-red-600';
    if (['車', '馬', '象', '士', '將', '砲', '卒'].includes(piece)) return 'text-black';
    return '';
  }, []);

  const displayBoard = useMemo(() => {
    let newBoard = initialBoard.map(row => [...row]);
    for (let i = 0; i < currentMoveIndex; i++) {
      const move = moves[i];
      if (move && move.from && move.to) {
        const [fromRow, fromCol] = move.from;
        const [toRow, toCol] = move.to;
        if (newBoard[fromRow] && newBoard[toRow]) {
          const piece = newBoard[fromRow][fromCol];
          newBoard[fromRow][fromCol] = '';
          newBoard[toRow][toCol] = piece;
        }
      }
    }
    return newBoard;
  }, [currentMoveIndex, moves, initialBoard]);

  const boardToFen = (board: string[][], isRedTurn: boolean): string => {
    const pieceMap: { [key: string]: string } = {
        '车': 'r', '马': 'n', '相': 'b', '仕': 'a', '帅': 'k', '炮': 'c', '兵': 'p',
        '車': 'R', '馬': 'N', '象': 'B', '士': 'A', '將': 'K', '砲': 'C', '卒': 'P'
    };
    let fen = '';
    for (let i = 0; i < 10; i++) {
        let empty = 0;
        for (let j = 0; j < 9; j++) {
            const piece = board[i][j];
            if (piece) {
                if (empty > 0) {
                    fen += empty;
                    empty = 0;
                }
                fen += pieceMap[piece] || '';
            } else {
                empty++;
            }
        }
        if (empty > 0) fen += empty;
        if (i < 9) fen += '/';
    }
    fen += isRedTurn ? ' w' : ' b';
    fen += ' - - 0 1';
    return fen;
  };

  const analyzePosition = async () => {
    const fen = boardToFen(displayBoard, currentMoveIndex % 2 === 0);
    setAnalysisResult('分析中...');
    try {
      const response = await fetch(`/api/chessdb?fen=${encodeURIComponent(fen)}`);
      const result = await response.json();
      setAnalysisResult(result.data || '分析失败');
    } catch (error) {
      setAnalysisResult('API 请求失败');
    }
  };

  useEffect(() => {
    if (manuals[selectedManualIndex] && manuals[selectedManualIndex].variations[selectedVariationIndex]) {
      const newMoves = manuals[selectedManualIndex].variations[selectedVariationIndex].moves;
      setMoves(newMoves);
      setCurrentMoveIndex(0);
      setIsPlaying(false);
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
    }
  }, [selectedManualIndex, selectedVariationIndex]);

  const playAnimation = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
      return;
    }
    setIsPlaying(true);
    animationIntervalRef.current = setInterval(() => {
      setCurrentMoveIndex(prev => {
        if (prev >= moves.length) {
          setIsPlaying(false);
          if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  }, [isPlaying, moves.length]);

  const resetBoard = useCallback(() => {
    setCurrentMoveIndex(0);
    setIsPlaying(false);
    if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
  }, []);

  const nextMove = useCallback(() => {
    setCurrentMoveIndex(prev => Math.min(prev + 1, moves.length));
  }, [moves.length]);

  const prevMove = useCallback(() => {
    setCurrentMoveIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const jumpToMove = useCallback((moveIndex: number) => {
    setCurrentMoveIndex(moveIndex);
    setIsPlaying(false);
    if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
  }, []);

  const handleManualChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedManualIndex(Number(e.target.value));
    setSelectedVariationIndex(0);
  };

  const handleVariationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVariationIndex(Number(e.target.value));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          if (importedData.name && importedData.variations && importedData.variations.length > 0) {
            setMoves(importedData.variations.moves);
          }
        } catch (error) {
          alert('无效的棋谱文件');
        }
      };
      reader.readAsText(file);
    }
  };

  const exportToJson = () => {
    const currentManual = manuals[selectedManualIndex];
    if (!currentManual) return;
    const data = JSON.stringify(currentManual, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentManual.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const redLabels = ['九', '八', '七', '六', '五', '四', '三', '二', '一'];
  const blackLabels = ['１', '２', '３', '４', '５', '６', '７', '８', '９'];
  const currentManual = manuals[selectedManualIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-2 md:p-4 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-amber-800 mb-2 flex items-center justify-center gap-2">
            <BookOpen className="w-6 h-6 md:w-8 md:h-8" />
            象棋古谱学习应用
          </h1>
          <p className="text-amber-600 text-sm md:text-base">选择经典古谱，学习大师走法</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 md:gap-8">
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">选择棋谱</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="manual-select" className="block text-sm font-medium text-gray-700 mb-1">棋谱</label>
                  <select id="manual-select" value={selectedManualIndex} onChange={handleManualChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500">
                    {manuals.map((manual, index) => (
                      <option key={index} value={index}>{manual.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="variation-select" className="block text-sm font-medium text-gray-700 mb-1">变化</label>
                  <select id="variation-select" value={selectedVariationIndex} onChange={handleVariationChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500">
                    {currentManual?.variations.map((variation, index) => (
                      <option key={index} value={index}>{variation.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {moves.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">{currentManual?.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{currentManual?.description}</p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">总步数: {moves.length}</p>
                  <p className="text-sm text-gray-600">当前: 第 {currentMoveIndex} 步</p>
                  {currentMoveIndex > 0 && moves[currentMoveIndex - 1] && (
                    <p className="text-lg font-medium text-amber-700">
                      当前招法: {moves[currentMoveIndex - 1].move}
                    </p>
                  )}
                </div>
                <div className="mt-4 max-h-40 overflow-y-auto border rounded p-2">
                  {moves.map((move, index) => (
                    <div key={index} className={`p-2 rounded text-sm cursor-pointer transition-colors ${index === currentMoveIndex - 1 ? 'bg-amber-100 text-amber-800 font-medium' : 'hover:bg-gray-50'}`} onClick={() => jumpToMove(index + 1)}>
                      {index + 1}. {move.move}
                    </div>
                  ))}
                </div>
              </div>
            )}
             <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">云库分析</h3>
                <button onClick={analyzePosition} className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    分析当前局面
                </button>
                <div className="mt-4 p-2 border rounded bg-gray-50 min-h-[50px]">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{analysisResult}</p>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">导入/导出</h3>
                <div className="flex gap-4">
                    <button onClick={() => fileInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        <Upload className="w-5 h-5" /> 导入
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".json" className="hidden" />
                    <button onClick={exportToJson} className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                        <Download className="w-5 h-5" /> 导出
                    </button>
                </div>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">棋盘演示</h3>
              <div className="flex justify-center">
                <div className="relative bg-amber-50" style={{ width: '360px', height: '400px', padding: '20px' }}>
                  <svg width="320" height="360" className="absolute" style={{ left: '20px', top: '20px' }}>
                    {[...Array(10)].map((_, i) => (
                      <line key={`h-${i}`} x1="0" y1={i * 40} x2="320" y2={i * 40} stroke="#8c4a08" strokeWidth="2" />
                    ))}
                    {[...Array(9)].map((_, i) => {
                      if (i === 0 || i === 8) {
                        return <line key={`v-${i}`} x1={i * 40} y1="0" x2={i * 40} y2="360" stroke="#8c4a08" strokeWidth="2" />;
                      } else {
                        return (
                          <g key={`v-${i}`}>
                            <line x1={i * 40} y1="0" x2={i * 40} y2="160" stroke="#8c4a08" strokeWidth="2" />
                            <line x1={i * 40} y1="200" x2={i * 40} y2="360" stroke="#8c4a08" strokeWidth="2" />
                          </g>
                        );
                      }
                    })}
                    <line x1="120" y1="0" x2="200" y2="80" stroke="#8c4a08" strokeWidth="2"/>
                    <line x1="200" y1="0" x2="120" y2="80" stroke="#8c4a08" strokeWidth="2"/>
                    <line x1="120" y1="280" x2="200" y2="360" stroke="#8c4a08" strokeWidth="2"/>
                    <line x1="200" y1="280" x2="120" y2="360" stroke="#8c4a08" strokeWidth="2"/>
                  </svg>
                  
                  <div className="absolute left-0 right-0 flex items-center justify-center text-lg text-amber-800 font-serif font-bold" style={{ top: '170px', height: '40px', letterSpacing: '2rem', paddingLeft: '2rem' }}>
                    楚河 漢界
                  </div>

                  {displayBoard.flat().map((piece, index) => {
                    if (!piece) return null;
                    const row = Math.floor(index / 9);
                    const col = index % 9;
                    return (
                      <div key={`${row}-${col}`} className={`absolute flex items-center justify-center text-2xl font-bold transition-all duration-500 ease-in-out`} style={{ top: `${20 + row * 40 - 20}px`, left: `${20 + col * 40 - 20}px`, width: '40px', height: '40px' }}>
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${getPieceColor(piece)} bg-amber-100 shadow-lg border-2 border-amber-600`}>
                          {piece}
                        </div>
                      </div>
                    );
                  })}

                  <div className="absolute flex justify-between text-amber-800 font-bold text-sm" style={{ bottom: '-25px', left: '20px', width: '320px' }}>
                    {redLabels.map((label) => (
                      <span key={label} className="flex justify-center" style={{ width: '40px' }}>{label}</span>
                    ))}
                  </div>
                  <div className="absolute flex justify-between text-amber-800 font-bold text-sm" style={{ top: '-25px', left: '20px', width: '320px' }}>
                    {blackLabels.map((label) => (
                      <span key={label} className="flex justify-center" style={{ width: '40px' }}>{label}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-center text-xs md:text-sm text-gray-600 mt-12">
                上方：黑方 | 下方：红方
              </div>
            </div>

            {moves.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">播放控制</h3>
                <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
                  <button onClick={resetBoard} className="flex items-center gap-2 bg-gray-500 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm">
                    <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
                    重置
                  </button>
                  <button onClick={prevMove} disabled={currentMoveIndex === 0} className="flex items-center gap-2 bg-blue-500 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                    上一步
                  </button>
                  <button onClick={playAnimation} className="flex items-center gap-2 bg-green-500 text-white px-4 md:px-6 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm">
                    {isPlaying ? <Pause className="w-4 h-4 md:w-5 md:h-5" /> : <Play className="w-4 h-4 md:w-5 md:h-5" />}
                    {isPlaying ? '暂停' : '播放'}
                  </button>
                  <button onClick={nextMove} disabled={currentMoveIndex >= moves.length} className="flex items-center gap-2 bg-blue-500 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                    下一步
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-amber-600 h-2 rounded-full transition-all duration-300" style={{ width: `${moves.length > 0 ? (currentMoveIndex / moves.length) * 100 : 0}%` }}></div>
                  </div>
                  <div className="text-center text-sm text-gray-600 mt-2">
                    {currentMoveIndex} / {moves.length}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default XiangqiTutor;
