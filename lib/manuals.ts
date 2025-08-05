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
          { move: '炮二平五', from: [7, 1], to: [7, 4], piece: '炮' },
          { move: '炮８平５', from: [2, 7], to: [2, 4], piece: '砲' },
          { move: '马二进三', from: [9, 1], to: [7, 2], piece: '马' },
          { move: '马８进７', from: [0, 7], to: [2, 6], piece: '馬' },
          { move: '车一平二', from: [9, 0], to: [9, 1], piece: '车' },
          { move: '车９平８', from: [0, 8], to: [0, 7], piece: '車' },
          { move: '兵七进一', from: [6, 6], to: [5, 6], piece: '兵' },
          { move: '卒７进１', from: [3, 2], to: [4, 2], piece: '卒' },
        ],
      },
    ],
  },
  {
    name: '梅花谱',
    description: '清代王再越所著，被誉为"象棋四大古谱"之一。',
    variations: [
      {
        name: '顺炮局 (当头炮对顺手炮)',
        moves: [
            { move: '炮二平五', from: [7, 1], to: [7, 4], piece: '炮' },
            { move: '炮８平５', from: [2, 7], to: [2, 4], piece: '砲' },
            { move: '马二进三', from: [9, 1], to: [7, 2], piece: '马' },
            { move: '马８进７', from: [0, 7], to: [2, 6], piece: '馬' },
            { move: '兵三进一', from: [6, 2], to: [5, 2], piece: '兵' },
            { move: '卒３进１', from: [3, 6], to: [4, 6], piece: '卒' },
            { move: '马八进七', from: [9, 7], to: [7, 6], piece: '马' },
            { move: '马２进３', from: [0, 1], to: [2, 2], piece: '馬' },
        ],
      },
    ],
  },
  {
    name: '百变象棋谱',
    description: '经典象棋残局谱，包含多种杀法练习。',
    variations: [
      {
        name: '双车错杀',
        moves: [
          { move: '车一进一', from: [9, 0], to: [8, 0], piece: '车' },
          { move: '将５平４', from: [0, 4], to: [0, 3], piece: '將' },
          { move: '车二平一', from: [9, 1], to: [9, 0], piece: '车' },
          { move: '将４平５', from: [0, 3], to: [0, 4], piece: '將' },
          { move: '车一平二', from: [9, 0], to: [9, 1], piece: '车' },
          { move: '将５平６', from: [0, 4], to: [0, 5], piece: '將' },
          { move: '车二进一', from: [9, 1], to: [8, 1], piece: '车' },
        ],
      },
      {
        name: '马后炮杀',
        moves: [
          { move: '马三进五', from: [7, 2], to: [5, 4], piece: '马' },
          { move: '将５平４', from: [0, 4], to: [0, 3], piece: '將' },
          { move: '炮五进三', from: [7, 4], to: [4, 4], piece: '炮' },
          { move: '将４平５', from: [0, 3], to: [0, 4], piece: '將' },
          { move: '马五进三', from: [5, 4], to: [3, 2], piece: '马' },
        ],
      },
    ],
  },
];