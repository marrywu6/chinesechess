'use client';

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Camera, Upload, Play, Pause, RotateCcw, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface Move {
  move: string;
  from: [number, number];
  to: [number, number];
  piece: string;
}

const XiangqiTutor: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(0);
  const [moves, setMoves] = useState<Move[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    const mockMoves: Move[] = [
        { move: '炮二平五', from: [7, 1], to: [7, 4], piece: '炮' },
        { move: '馬8進7', from: [0, 7], to: [2, 6], piece: '馬' },
        { move: '马二进三', from: [9, 7], to: [7, 6], piece: '马' },
        { move: '車9平8', from: [0, 8], to: [0, 7], piece: '車' },
        { move: '车一平二', from: [9, 8], to: [9, 7], piece: '车' },
        { move: '砲8平5', from: [2, 7], to: [2, 4], piece: '砲' }
    ];
    setMoves(mockMoves);
    return () => {
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
    };
  }, []);

  const analyzeImage = useCallback(async (imageFile: File) => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const mockMoves: Move[] = [
        { move: '炮二平五', from: [7, 1], to: [7, 4], piece: '炮' },
        { move: '馬8進7', from: [0, 7], to: [2, 6], piece: '馬' },
        { move: '马二进三', from: [9, 7], to: [7, 6], piece: '马' },
        { move: '車9平8', from: [0, 8], to: [0, 7], piece: '車' },
        { move: '车一平二', from: [9, 8], to: [9, 7], piece: '车' },
        { move: '砲8平5', from: [2, 7], to: [2, 4], piece: '砲' }
    ];
    setMoves(mockMoves);
    setCurrentMoveIndex(0);
    setIsAnalyzing(false);
  }, []);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCurrentImage(result);
        analyzeImage(file);
      };
      reader.readAsDataURL(file);
    }
  }, [analyzeImage]);

  const playAnimation = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
      return;
    }
    setIsPlaying(true);
    animationIntervalRef.current = setInterval(() => {
      setCurrentMoveIndex(prev => {
        if (prev >= moves.length - 1) {
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
    if (currentMoveIndex < moves.length - 1) setCurrentMoveIndex(currentMoveIndex + 1);
  }, [currentMoveIndex, moves.length]);

  const prevMove = useCallback(() => {
    if (currentMoveIndex > 0) setCurrentMoveIndex(currentMoveIndex - 1);
  }, [currentMoveIndex]);

  const jumpToMove = useCallback((moveIndex: number) => {
    setCurrentMoveIndex(moveIndex);
    setIsPlaying(false);
    if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
  }, []);

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

  const redLabels = ['九', '八', '七', '六', '五', '四', '三', '二', '一'];
  const blackLabels = ['９', '８', '７', '６', '５', '４', '３', '２', '１'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-2 md:p-4 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-amber-800 mb-2 flex items-center justify-center gap-2">
            <BookOpen className="w-6 h-6 md:w-8 md:h-8" />
            象棋古谱学习应用
          </h1>
          <p className="text-amber-600 text-sm md:text-base">拍照上传棋谱，智能生成动画演示</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 md:gap-8">
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">上传棋谱</h2>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <button onClick={() => cameraInputRef.current?.click()} className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  <Camera className="w-5 h-5" />
                  拍照上传
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                  <Upload className="w-5 h-5" />
                  选择文件
                </button>
              </div>
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="hidden" />
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              {currentImage && (
                <div className="mt-4">
                  <img src={currentImage} alt="上传的棋谱" className="w-full max-w-md mx-auto rounded-lg shadow-md" />
                </div>
              )}
              {isAnalyzing && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 text-blue-600">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    正在分析棋谱...
                  </div>
                </div>
              )}
            </div>

            {moves.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">棋谱信息</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">总步数: {moves.length}</p>
                  <p className="text-sm text-gray-600">当前: 第 {currentMoveIndex + 1} 步</p>
                  {moves[currentMoveIndex] && (
                    <p className="text-lg font-medium text-amber-700">
                      当前招法: {moves[currentMoveIndex].move}
                    </p>
                  )}
                </div>
                <div className="mt-4 max-h-40 overflow-y-auto border rounded p-2">
                  {moves.map((move, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded text-sm cursor-pointer transition-colors ${
                        index === currentMoveIndex
                          ? 'bg-amber-100 text-amber-800 font-medium'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => jumpToMove(index)}
                    >
                      {index + 1}. {move.move}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 md:space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">棋盘演示</h3>
              <div className="flex justify-center">
                <div className="relative" style={{ width: 'calc(8 * 4rem)', height: 'calc(9 * 4rem)', padding: '2rem' }}>
                  <div className="absolute top-0 left-0 w-full h-full bg-amber-200" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100%\' height=\'100%\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'grid\' width=\'64\' height=\'64\' patternUnits=\'userSpaceOnUse\'%3E%3Cpath d=\'M 64 0 L 0 0 0 64\' fill=\'none\' stroke=\'%238c4a08\' stroke-width=\'1\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%\' height=\'100%\' fill=\'%23fdeec9\'/%3E%3Crect width=\'100%\' height=\'100%\' fill=\'url(%23grid)\'/%3E%3C/svg%3E")'}}>
                  </div>
                  
                  <div className="absolute top-1/2 left-0 w-full h-16 -translate-y-1/2 flex items-center justify-center text-2xl text-amber-800 font-serif" style={{letterSpacing: '1rem'}}>
                    楚河 漢界
                  </div>

                  <svg width="100%" height="100%" className="absolute top-0 left-0 overflow-visible">
                    <line x1="calc(3 * 4rem + 2rem)" y1="calc(0 * 4rem + 2rem)" x2="calc(5 * 4rem + 2rem)" y2="calc(2 * 4rem + 2rem)" stroke="#8c4a08" strokeWidth="1"/>
                    <line x1="calc(5 * 4rem + 2rem)" y1="calc(0 * 4rem + 2rem)" x2="calc(3 * 4rem + 2rem)" y2="calc(2 * 4rem + 2rem)" stroke="#8c4a08" strokeWidth="1"/>
                    <line x1="calc(3 * 4rem + 2rem)" y1="calc(7 * 4rem + 2rem)" x2="calc(5 * 4rem + 2rem)" y2="calc(9 * 4rem + 2rem)" stroke="#8c4a08" strokeWidth="1"/>
                    <line x1="calc(5 * 4rem + 2rem)" y1="calc(7 * 4rem + 2rem)" x2="calc(3 * 4rem + 2rem)" y2="calc(9 * 4rem + 2rem)" stroke="#8c4a08" strokeWidth="1"/>
                  </svg>

                  {displayBoard.flat().map((piece, index) => {
                    if (!piece) return null;
                    const row = Math.floor(index / 9);
                    const col = index % 9;
                    return (
                      <div
                        key={`${row}-${col}`}
                        className={`absolute w-16 h-16 flex items-center justify-center text-3xl font-bold transition-all duration-500 ease-in-out transform -translate-x-1/2 -translate-y-1/2`}
                        style={{
                          top: `calc(${row} * 4rem + 2rem)`,
                          left: `calc(${col} * 4rem + 2rem)`,
                        }}
                      >
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${getPieceColor(piece)} bg-amber-100 shadow-md border-2 border-amber-400`}>
                          {piece}
                        </div>
                      </div>
                    );
                  })}
                  
                  <div className="absolute -bottom-8 w-full flex justify-around text-amber-800 font-bold">
                    {redLabels.map((label, i) => <span key={label} style={{width: '4rem', textAlign: 'center'}}>{label}</span>)}
                  </div>
                   <div className="absolute -top-8 w-full flex justify-around text-amber-800 font-bold">
                    {blackLabels.map(label => <span key={label} style={{width: '4rem', textAlign: 'center'}}>{label}</span>)}
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
                  <button onClick={nextMove} disabled={currentMoveIndex >= moves.length - 1} className="flex items-center gap-2 bg-blue-500 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                    下一步
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${moves.length > 0 ? ((currentMoveIndex + 1) / moves.length) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                  <div className="text-center text-sm text-gray-600 mt-2">
                    {currentMoveIndex + 1} / {moves.length}
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
