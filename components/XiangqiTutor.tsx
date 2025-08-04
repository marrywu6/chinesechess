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
                <div className="relative bg-amber-50" style={{ width: '360px', height: '400px', padding: '20px' }}>
                  {/* 棋盘背景 */}
                  <svg width="320" height="360" className="absolute" style={{ left: '20px', top: '20px' }}>
                    {/* 横线 - 10条 */}
                    {[...Array(10)].map((_, i) => (
                      <line
                        key={`h-${i}`}
                        x1="0"
                        y1={i * 40}
                        x2="320"
                        y2={i * 40}
                        stroke="#8c4a08"
                        strokeWidth="2"
                      />
                    ))}
                    {/* 竖线 - 边界两条完整，中间7条断开 */}
                    {[...Array(9)].map((_, i) => {
                      if (i === 0 || i === 8) {
                        // 边界竖线完整
                        return (
                          <line
                            key={`v-${i}`}
                            x1={i * 40}
                            y1="0"
                            x2={i * 40}
                            y2="360"
                            stroke="#8c4a08"
                            strokeWidth="2"
                          />
                        );
                      } else {
                        // 中间竖线断开
                        return (
                          <g key={`v-${i}`}>
                            <line
                              x1={i * 40}
                              y1="0"
                              x2={i * 40}
                              y2="160"
                              stroke="#8c4a08"
                              strokeWidth="2"
                            />
                            <line
                              x1={i * 40}
                              y1="200"
                              x2={i * 40}
                              y2="360"
                              stroke="#8c4a08"
                              strokeWidth="2"
                            />
                          </g>
                        );
                      }
                    })}
                    {/* 九宫格对角线 - 上方 */}
                    <line x1="120" y1="0" x2="200" y2="80" stroke="#8c4a08" strokeWidth="2"/>
                    <line x1="200" y1="0" x2="120" y2="80" stroke="#8c4a08" strokeWidth="2"/>
                    {/* 九宫格对角线 - 下方 */}
                    <line x1="120" y1="280" x2="200" y2="360" stroke="#8c4a08" strokeWidth="2"/>
                    <line x1="200" y1="280" x2="120" y2="360" stroke="#8c4a08" strokeWidth="2"/>
                  </svg>
                  
                  {/* 楚河汉界文字 */}
                  <div className="absolute left-0 right-0 flex items-center justify-center text-lg text-amber-800 font-serif font-bold" 
                       style={{ top: '170px', height: '40px', letterSpacing: '2rem', paddingLeft: '2rem' }}>
                    楚河 漢界
                  </div>

                  {displayBoard.flat().map((piece, index) => {
                    if (!piece) return null;
                    const row = Math.floor(index / 9);
                    const col = index % 9;
                    return (
                      <div
                        key={`${row}-${col}`}
                        className={`absolute flex items-center justify-center text-2xl font-bold transition-all duration-500 ease-in-out`}
                        style={{
                          top: `${20 + row * 40 - 20}px`, // 精确定位到交叉点
                          left: `${20 + col * 40 - 20}px`, // 精确定位到交叉点
                          width: '40px',
                          height: '40px',
                        }}
                      >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${getPieceColor(piece)} bg-amber-100 shadow-lg border-2 border-amber-600`}>
                          {piece}
                        </div>
                      </div>
                    );
                  })}
                  {/* 坐标标签 */}
                  <div className="absolute flex justify-between text-amber-800 font-bold text-sm" 
                       style={{ bottom: '-25px', left: '20px', width: '320px' }}>
                    {redLabels.map((label) => (
                      <span key={label} className="flex justify-center" style={{ width: '40px' }}>
                        {label}
                      </span>
                    ))}
                  </div>
                  <div className="absolute flex justify-between text-amber-800 font-bold text-sm" 
                       style={{ top: '-25px', left: '20px', width: '320px' }}>
                    {blackLabels.map((label) => (
                      <span key={label} className="flex justify-center" style={{ width: '40px' }}>
                        {label}
                      </span>
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
