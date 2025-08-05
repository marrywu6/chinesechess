export interface Move {
  move: string;
  from: [number, number];
  to: [number, number];
  piece: string;
}

export interface Variation {
  name: string;
  moves: Move[];
}

export interface Manual {
  name: string;
  description: string;
  variations: Variation[];
}

export const manuals: Manual[] = [
  {
    name: '橘中秘',
    description: '明代棋谱，中国象棋史上影响最大、流传最广的棋谱。',
    variations: [
      {
        name: '顺炮局',
        moves: [
          { move: '炮二平五', from:, to:, piece: '炮' },
          { move: '炮８平５', from:, to:, piece: '砲' },
          { move: '马二进三', from:, to:, piece: '马' },
          { move: '马８进７', from:, to:, piece: '馬' },
          { move: '车一平二', from:, to:, piece: '车' },
          { move: '车９平８', from:, to:, piece: '車' },
          { move: '兵七进一', from:, to:, piece: '兵' },
          { move: '卒７进１', from:, to:, piece: '卒' },
        ],
      },
    ],
  },
  {
    name: '梅花谱',
    description: '清代王再越所著，被誉为“象棋四大古谱”之一。',
    variations: [
      {
        name: '顺炮局 (当头炮对顺手炮)',
        moves: [
            { move: '炮二平五', from:, to:, piece: '炮' },
            { move: '炮８平５', from:, to:, piece: '砲' },
            { move: '马二进三', from:, to:, piece: '马' },
            { move: '马８进７', from:, to:, piece: '馬' },
            { move: '兵三进一', from:, to:, piece: '兵' },
            { move: '卒３进１', from:, to:, piece: '卒' },
            { move: '马八进七', from:, to:, piece: '马' },
            { move: '马２进３', from:, to:, piece: '馬' },
        ],
      },
    ],
  },
];