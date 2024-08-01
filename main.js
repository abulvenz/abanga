import m from "mithril";
import { pre, table, tr, td, a, button, h1, div, input } from "./tags";

import { pieces } from "./pieces";

const { min, pow, max, trunc } = Math;

const range = (n) => Array.from({ length: n }, (_, i) => i);

const cards = [
  {
    id: "A19",
    sets: [
      {
        coords: ["###", "###", "###"],
        combi: [
          {
            dice: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            pieces: [3, 8, 9, 10, 12, 15, 16],
          },
          {
            dice: [3, 4],
            pieces: [5, 16, 9],
          },
        ],
      },
    ],
  },
];

const dice = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const state = {
  card: cards[0],
  dice: 1,
  expl: 100,
  selected_solution_piece: 0,
  solutions: [],
};

const use = (v, f) => f(v);
const previous = (element, arr) =>
  use(arr.indexOf(element) - 1, (idx) =>
    idx < 0 ? arr[arr.length - 1] : arr[idx]
  );

const next = (element, arr) =>
  use(arr.indexOf(element) + 1, (idx) =>
    idx >= arr.length ? arr[0] : arr[idx]
  );

const contains = (arr, element) => arr.indexOf(element) >= 0;

const selectSet = (card, dice) =>
  card.sets.find((set) =>
    set.combi.some((combi) => contains(combi.dice, dice))
  );

const selectCombi = (set, dice) =>
  set.combi.find((combi) => contains(combi.dice, dice));

const findPiece = (num) => pieces.find((piece) => piece.id === num);

const flatMap = (arr) => arr.reduce((acc, v) => acc.concat(v), []);

console.log(flatMap([1, [2, 3]]));

const pieceToCoords = (piece) =>
  flatMap(
    flatMap(
      piece.coords.map((floor, z) =>
        floor.map((rowString, x) =>
          rowString
            .split("")
            .map((c, y) => ("#" === c ? { x, y, z } : undefined))
        )
      )
    )
  ).filter((e) => !!e);

const sort_coords = (coords) => {
  return coords.sort((a, b) => {
    if (a.x !== b.x) return a.x - b.x;
    if (a.y !== b.y) return a.y - b.y;
    return a.z - b.z;
  });
};

const rotate_X = (vec) => {
  return { x: vec.x, y: -vec.z, z: vec.y };
};
const rotate_Y = (vec) => {
  return { x: vec.z, y: vec.y, z: -vec.x };
};
const rotate_Z = (vec) => {
  return { x: -vec.y, y: vec.x, z: vec.z };
};

const normalize_coords = (coords) => {
  const min_x = min(...coords.map((c) => c.x));
  const min_y = min(...coords.map((c) => c.y));
  const min_z = min(...coords.map((c) => c.z));

  return coords.map((c) => ({
    x: c.x - min_x,
    y: c.y - min_y,
    z: c.z - min_z,
  }));
};

const shift_coords = (coords, shift, factor = 1) => {
  return coords.map((c) => ({
    x: c.x + shift.x * factor,
    y: c.y + shift.y * factor,
    z: c.z + shift.z * factor,
  }));
};

const mapToCoords = (map = ["###", "###", "###"]) =>
  flatMap(
    flatMap(
      map.map((r, ri) =>
        r.split("").map((c, ci) => (c === "#" ? { x: ri, y: ci } : undefined))
      )
    )
      .filter((e) => !!e)
      .map((c) => [0, 1, 2].map((z) => ({ ...c, z })))
  );

const containerC = (vnode) => ({
  view: (vnode) =>
    div.container(
      { style: `--size:${vnode.attrs.size};` },
      div.innerContainer(
        {
          style: `--transform:rotate3d(1, 1, 0, ${vnode.attrs.angle}deg);`,
        },
        vnode.children
      )
    ),
});

const cubicalC = (vnode) => ({
  view: (vnode) =>
    div.cube(
      {
        style: `--size:${vnode.attrs.size};--transform:${vnode.attrs.transform}`,
      },
      [
        div[vnode.attrs.color].face.top(vnode.attrs.title),
        div[vnode.attrs.color].face.bottom(vnode.attrs.title),
        div[vnode.attrs.color].face.left(vnode.attrs.title),
        div[vnode.attrs.color].face.right(vnode.attrs.title),
        div[vnode.attrs.color].face.front(vnode.attrs.title),
        div[vnode.attrs.color].face.back(vnode.attrs.title),
      ]
    ),
});

let angle = 330;

// For each piece rotate it in all directions, normalize it and only keep unique ones.

const rotations = [
  (v) => v,
  rotate_X,
  rotate_Y,
  rotate_Z,
  (v) => rotate_X(rotate_Y(v)),
  (v) => rotate_X(rotate_Z(v)),
  (v) => rotate_Y(rotate_Z(v)),
];

const idx_of_coords = (coords) => coords.x + coords.y * 3 + coords.z * 9;

const numberify = (coords) =>
  coords.reduce((acc, v) => acc + pow(2, idx_of_coords(v)), 0);

const number_to_binary_string = (n) => n.toString(2).padStart(27, "0");

const idx_to_coords = (idx) => ({
  x: idx % 3,
  y: trunc(idx / 9),
  z: trunc(idx / 3) % 3,
});

const number_to_coords = (num) =>
  range(27)
    .map((i) => (pow(2, i) & num ? i : undefined))
    .filter((e) => e !== undefined)
    .map(idx_to_coords);

console.log(`number_to_coords: ${JSON.stringify(number_to_coords(25))}`);

const boundingBox = (coords) =>
  coords.reduce(
    (acc, c) => {
      acc.min.x = min(acc.min.x, c.x);
      acc.min.y = min(acc.min.y, c.y);
      acc.min.z = min(acc.min.z, c.z);
      acc.max.x = max(acc.max.x, c.x);
      acc.max.y = max(acc.max.y, c.y);
      acc.max.z = max(acc.max.z, c.z);
      return acc;
    },
    { min: { x: 100, y: 100, z: 100 }, max: { x: 0, y: 0, z: 0 } }
  );

const piece_to_numbers = (coords) => {
  const unique_coords = new Set();

  rotations.forEach((rotation) => {
    const rotated_coords = normalize_coords(coords.map(rotation));
    const bounding_box = boundingBox(rotated_coords);

    for (x in range(3 - bounding_box.max.x)) {
      for (y in range(3 - bounding_box.max.y)) {
        for (z in range(3 - bounding_box.max.z)) {
          const shift = { x, y, z };
          const shifted_coords = shift_coords(rotated_coords, shift);
          const num = numberify(sort_coords(shifted_coords));
          if (num > pow(2, 27)) throw Error(`mömömö ${num}, ${pow(2, 27)}`);
          unique_coords.add(num);
        }
      }
    }
  });
  return Array.from(unique_coords).map((c) => c);
};

const create_unique_coords_by_piece_index = (combi) => {
  const pieces = combi.pieces.map((pn) => findPiece(pn));

  return pieces.map((piece) => {
    const coords = pieceToCoords(piece);

    return piece_to_numbers(coords);
  });
};
const solve = () => {
  console.log("Solve");

  const card = state.card;
  const set = selectSet(card, state.dice);
  const combi = selectCombi(set, state.dice);
  const pieces = combi.pieces.map((pn) => findPiece(pn));

  const target_coords = mapToCoords(set.coords);
  console.log("Solve", pieces, target_coords);

  const solutions = [];

  const coords_by_piece_index = create_unique_coords_by_piece_index(combi);

  const isValid = (solution, new_number) => {
    const current_fields = solution.reduce((acc, v) => acc + v, 0);
    if (current_fields & new_number) return false;
    return true;
  };

  const extend_solution = (solution) => {
    // Early return, we have found enough solutions
    // In total there are 14816 solutions.
    if (solutions.length === 400000) return;

    if (solution.length === coords_by_piece_index.length) {
      solutions.push(solution);
      return;
    }

    const piece_index = solution.length;
    const piece_coords = coords_by_piece_index[piece_index];

    for (let coords of piece_coords) {
      if (isValid(solution, coords)) {
        extend_solution([...solution, coords]);
      }
    }
  };

  extend_solution([]);

  console.log("Solutions", solutions);
  state.solutions = solutions;
};

solve();

state.solutions.forEach((solution) => {
  console.log(
    `${solution.length}, ${number_to_binary_string(
      solution.reduce((acc, v) => acc + v, 0)
    )}`
  );
});

m.mount(document.getElementById("controls"), {
  view: (vnode) => [
    h1("AB AN GA"),
    button({ onclick: (e) => (state.card = previous(state.card, cards)) }, "<"),
    state.card.id,
    button({ onclick: (e) => (state.card = next(state.card, cards)) }, ">"),
    button({ onclick: (e) => (state.dice = previous(state.dice, dice)) }, "-"),
    state.dice,
    button({ onclick: (e) => (state.dice = next(state.dice, dice)) }, "+"),
    use(state.card, (card) =>
      use(selectSet(card, state.dice), (set) => [
        use(selectCombi(set, state.dice), (combi) => [
          pre(
            "card:",
            JSON.stringify(card),
            "\n",
            JSON.stringify(combi, null, 2)
          ),

          combi.pieces.map((pn, i) =>
            use(findPiece(pn), (piece) => [
              pre("PEACE", JSON.stringify(piece)),
              m(
                containerC,
                { size: "300px", angle },
                pieceToCoords(piece).map((c) =>
                  m(cubicalC, {
                    color: piece.color.toLowerCase(),
                    title: JSON.stringify(piece.id),
                    angle,
                    size: "100px",
                    transform: `
                                        translateX(${c.x * 100 + 10}px)
                                        translateY(${c.y * 100 + 10}px)
                                        translateZ(${c.z * 100 + 10}px)
                                    `,
                  })
                )
              ),
            ])
          ),
        ]),

        state.solutions.map((solution) => {
          return m(
            containerC,
            { size: "300px", angle },

            use(state.card, (card) =>
              use(selectSet(card, state.dice), (set) => [
                use(selectCombi(set, state.dice), (combi) => {
                  return combi.pieces.map((pn, i) =>
                    i == state.selected_solution_piece ||
                    state.selected_solution_piece < 0
                      ? use(findPiece(pn), (piece) => [
                          number_to_coords(solution[i]).map((c) =>
                            m(cubicalC, {
                              color: piece.color.toLowerCase(),
                              title: JSON.stringify(piece.id),
                              angle,
                              size: "100px",
                              transform: `
                                              translateX(${c.x * 100 + 10}px)
                                              translateY(${c.y * 100 + 10}px)
                                              translateZ(${c.z * 100 + 10}px)
                                          `,
                            })
                          ),
                        ])
                      : null
                  );
                }),
              ])
            )
          );
        }),
        input({
          type: "range",
          value: state.expl,
          max: 360,
          min: 0,
          onchange: (e) => console.log("U", (state.expl = +e.target.value)),
        }),
      ])
    ),
    input({
      type: "range",
      value: angle,
      max: 360,
      min: 0,
      onchange: (e) => console.log("U", (angle = +e.target.value)),
    }),
    button({ onclick: (e) => solve() }, "Solve"),
    button({ onclick: (e) => state.selected_solution_piece-- }, "--"),
    button({ onclick: (e) => state.selected_solution_piece++ }, "++"),
  ],
});
