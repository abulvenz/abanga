import m from "mithril";
import { pre, table, tr, td, a, button, h1, div, input } from "./tags";

import { pieces } from "./pieces";

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
  const min_x = Math.min(...coords.map((c) => c.x));
  const min_y = Math.min(...coords.map((c) => c.y));
  const min_z = Math.min(...coords.map((c) => c.z));

  return coords.map((c) => ({
    x: c.x - min_x,
    y: c.y - min_y,
    z: c.z - min_z,
  }));
};

const shift_coords = (coords, shift, factor = 1) => {
  return coords.map((c) => ({
    x: c.x + shift.x * factor,
    y: c.y + shift.y* factor,
    z: c.z + shift.z* factor,
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

console.log(sort_coords(mapToCoords()));

console.log(pieceToCoords(pieces[0]));

const cubeC = (vnode) => ({
  view: (vnode) =>
    div.cube(
      div.group(
        {
          style: `
            --transform:rotate3d(1,1,1,${vnode.attrs.angle || 0}deg);
        `,
        },
        div[vnode.attrs.color || "gray"].face.front(
          { style: `--size:${vnode.attrs.size}` },
          1
        ),
        div[vnode.attrs.color || "gray"].face.back(
          { style: `--size:${vnode.attrs.size}` },
          2
        ),
        div[vnode.attrs.color || "gray"].face.left(
          { style: `--size:${vnode.attrs.size}` },
          3
        ),
        div[vnode.attrs.color || "gray"].face.right(
          { style: `--size:${vnode.attrs.size}` },
          4
        ),
        div[vnode.attrs.color || "gray"].face.top(
          { style: `--size:${vnode.attrs.size}` },
          5
        ),
        div[vnode.attrs.color || "gray"].face.bottom(
          { style: `--size:${vnode.attrs.size}` },
          6
        )
      )
    ),
});

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
  //
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

const create_unique_coords_by_piece_index = (combi) => {
  const pieces = combi.pieces.map((pn) => findPiece(pn));

  return pieces.map((piece, piece_index) => {
    const coords = pieceToCoords(piece);
    const unique_coords = new Set();

    rotations.forEach((rotation) => {
      const rotated_coords = normalize_coords(coords.map(rotation));
      unique_coords.add(JSON.stringify(sort_coords(rotated_coords)));
    });

    return Array.from(unique_coords).map((c) => JSON.parse(c));
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

  const unique_coords_by_piece_index =
    create_unique_coords_by_piece_index(combi);

  // Now we have all unique coordinates for each piece. We can now try to place
  // them such that the target_coords are exactly covered.
  const target_coords_sorted = sort_coords(target_coords);

  // One solution is an array with the same length as pieces, where each element
  // gives us the current place position of the piece in that solution and an index of
  // the unique_coords_by_piece_index array.

  // I.e. a solution is an array of objects { rot_idx, coords } where rot_idx is the index of the
  // unique_coords_by_piece_index array and coords is the shift of the piece.

  // The algorithm is recursive and tries to place the pieces in the solution array.
  // If the solution is valid, it is added to the solutions array.
  // A solution is not valid, when the place cannot be added such that it does not collide with
  // another piece that has already been placed.

  const target_coords_set = new Set();
  target_coords_sorted.forEach((c) => target_coords_set.add(JSON.stringify(c)));

  const isValid = (solution) => {
    const solution_coords = sort_coords(
      flatMap(
        solution.map(({ coords, rot_idx }, idx) => {
          const unique_coords = unique_coords_by_piece_index[idx][rot_idx];
          return shift_coords(unique_coords, coords);
        })
      )
    );

    const solution_coords_set = new Set();
    //    console.log("isValid", solution, solution_coords);

    // Check if all coordinates are unique in the solution
    // and if they are within the target_coords. If not return false as quickly as possible.
    for (let i = 0; i < solution_coords.length; i++) {
      const c = solution_coords[i];

      if (!target_coords_set.has(JSON.stringify(c))) {
        return false;
      }

      if (solution_coords_set.has(JSON.stringify(c))) {
        return false;
      }
      solution_coords_set.add(JSON.stringify(c));
    }

    //    console.log("Solution", solution_coords, target_coords_set, solution_coords_set);

    return true;
  };

  const extend_solution = (solution) => {
    if (solutions.length === 4) return;

    if (!isValid(solution)) {
      return;
    }

    if (solution.length === pieces.length) {
      solutions.push(solution);
      return;
    }

    const piece_index = solution.length;
    const unique_coords = unique_coords_by_piece_index[piece_index];

    // We need to shift the piece to all possible positions

    target_coords_sorted.forEach((target) => {
      const shift = {
        x: target.x,
        y: target.y,
        z: target.z,
      };

      unique_coords.forEach((coords, rot_idx) => {
        extend_solution([...solution, { rot_idx, coords: shift }]);
      });
    });
  };

  extend_solution([]);

  console.log("Solutions", solutions);
  state.solutions = solutions;
};

solve();

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
              //    pre(JSON.stringify(pieceToCoords(findPiece(pn)))),
              m(
                containerC,
                { size: "300px", angle },
                //  m(cubicalC, { angle, size: '10px' }),
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

        false
          ? m(
              containerC,
              { size: "300px", angle },
              //  m(cubicalC, { angle, size: '10px' }),
              mapToCoords(set.coords).map((c) =>
                m(cubicalC, {
                  color: "gray",
                  title: "?",
                  angle,
                  size: "100px",
                  transform: `
                        translateX(${c.x * 100 + 10}px)
                        translateY(${c.y * 100 + 10}px)
                        translateZ(${c.z * 100 + 10}px)
                    `,
                })
              )
            )
          : null,

        state.solutions.map((solution) => {
          return m(
            containerC,
            { size: "300px", angle },

            use(state.card, (card) =>
              use(selectSet(card, state.dice), (set) => [
                use(selectCombi(set, state.dice), (combi) => {
                  const unique_coords_by_piece_index =
                    create_unique_coords_by_piece_index(combi);
                  return combi.pieces.map((pn, i) =>
                    i == state.selected_solution_piece ||
                    state.selected_solution_piece < 0
                      ? use(findPiece(pn), (piece) => [
                          //                        pre("PEACE", JSON.stringify(piece)),
                          //    pre(JSON.stringify(pieceToCoords(findPiece(pn)))),

                          //  m(cubicalC, { angle, size: '10px' }),
                          shift_coords(
                            unique_coords_by_piece_index[i][
                              solution[i].rot_idx
                            ],
                            solution[i].coords, state.expl / 100
                          ).map((c) =>
                            m(cubicalC, {
                              color: piece.color.toLowerCase(),
                              title: JSON.stringify(piece.id),
                              angle,
                              size: "100px",
                              transform: `
                                              translateX(${c.x * 100  + 10}px)
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
        // div.field(
        //   set.coords
        //     ? set.coords.map((row) => [
        //         div.row(
        //           row
        //             .split("")
        //             .map((c) => (c === "#" ? div.box.filled() : div.box()))
        //         ),
        //       ])
        //     : "NoCoords"
        // ),
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
