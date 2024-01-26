import m from "mithril";
import { pre, table, tr, td, a, button, h1, div, input } from "./tags";

import { pieces } from "./pieces";

const cards = [
  // {
  //     id: "",
  //     sets: [
  //       {
  //         coords: [],
  //         combi: [
  //           {
  //             dice: [],
  //             pieces: [],
  //           },
  //         ],
  //       },
  //     ],
  //   },

  {
    id: "A19",
    sets: [
      {
        coords: ["  ##", "####", "#   "],
        combi: [
          {
            dice: [1, 2],
            pieces: [10, 13, 9],
          },
          {
            dice: [3, 4],
            pieces: [5, 16, 9],
          },
        ],
      },
      {
        coords: ["####", " ## ", "  # "],
        combi: [
          {
            dice: [5, 6, 7],
            pieces: [9, 16, 2],
          },
          {
            dice: [8, 9, 10],
            pieces: [13, 10, 9],
          },
        ],
      },
    ],
  },
  {
    id: "B19",
    sets: [
      {
        coords: ["## #", " ###", "### "],
        combi: [
          {
            dice: [1],
            pieces: [9, 14, 3, 10],
          },
          {
            dice: [2],
            pieces: [8, 13, 9, 5],
          },
          {
            dice: [3],
            pieces: [1, 9, 14, 8],
          },
          {
            dice: [4],
            pieces: [9, 5, 16, 10],
          },
          {
            dice: [5],
            pieces: [10, 6, 9, 12],
          },
        ],
      },
      {
        coords: ["### ", "####", "#  #"],
        combi: [
          {
            dice: [6],
            pieces: [16, 5, 13, 15],
          },
          {
            dice: [7],
            pieces: [16, 1, 7, 10],
          },
          {
            dice: [8],
            pieces: [7, 14, 10, 3],
          },
          {
            dice: [9],
            pieces: [5, 7, 16, 10],
          },
          {
            dice: [10],
            pieces: [5, 9, 14, 8],
          },
        ],
      },
    ],
  },
  {
    id: "A8",
    sets: [
      {
        coords: ["####", "  ##", "  # "],
        combi: [
          {
            dice: [1, 2],
            pieces: [7, 10, 5],
          },
          {
            dice: [3, 4],
            pieces: [14, 7, 3],
          },
        ],
      },
      {
        coords: [" #  ", "### ", " ###"],
        combi: [
          {
            dice: [5, 6, 7],
            pieces: [2, 16, 4],
          },
          {
            dice: [8, 9, 10],
            pieces: [4, 14, 3],
          },
        ],
      },
    ],
  },
  {
    id: "B8",
    sets: [
      {
        coords: ["####", "  ##", "  # "],
        combi: [
          {
            dice: [1],
            pieces: [9, 16, 3, 8],
          },
          {
            dice: [2],
            pieces: [16, 3, 8, 6],
          },
          {
            dice: [3],
            pieces: [10, 12, 8, 14],
          },
          {
            dice: [4],
            pieces: [10, 9, 8, 12],
          },
          {
            dice: [5],
            pieces: [14, 8, 16, 10],
          },
        ],
      },
      {
        coords: ["  # ", " ###", "####"],
        combi: [
          {
            dice: [6],
            pieces: [8, 15, 10, 2],
          },
          {
            dice: [7],
            pieces: [11, 3, 16, 8],
          },
          {
            dice: [8],
            pieces: [16, 10, 1, 8],
          },
          {
            dice: [9],
            pieces: [16, 10, 2, 8],
          },
          {
            dice: [10],
            pieces: [5, 16, 8, 3],
          },
        ],
      },
    ],
  },
  {
    id: "A15",
    sets: [
      {
        coords: [" ## ", "####", "  # "],
        combi: [
          {
            dice: [1, 2],
            pieces: [3, 9, 14],
          },
          {
            dice: [3, 4],
            pieces: [13, 10, 7],
          },
        ],
      },
      {
        coords: [" ##", "###", "# #"],
        combi: [
          {
            dice: [5, 6, 7],
            pieces: [16, 9, 13],
          },
          {
            dice: [8, 9, 10],
            pieces: [14, 16, 6],
          },
        ],
      },
    ],
  },
  {
    id: "B15",
    sets: [
      {
        coords: ["  ###", " ### ", "###  "],
        combi: [
          {
            dice: [1],
            pieces: [1, 14, 7, 8],
          },
          {
            dice: [2],
            pieces: [3, 7, 10, 1],
          },
          {
            dice: [3],
            pieces: [16, 10, 4, 6],
          },
          {
            dice: [4],
            pieces: [7, 16, 15, 5],
          },
          {
            dice: [5],
            pieces: [10, 14, 3, 9],
          },
        ],
      },
      {
        coords: ["### ", "####", "  ##"],
        combi: [
          {
            dice: [6],
            pieces: [14, 10, 9, 16],
          },
          {
            dice: [7],
            pieces: [16, 9, 7, 10],
          },
          {
            dice: [8],
            pieces: [6, 12, 16, 9],
          },
          {
            dice: [9],
            pieces: [11, 14, 16, 10],
          },
          {
            dice: [10],
            pieces: [16, 13, 14, 10],
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

const mapToCoords = (map = ["##", "##"]) =>
  flatMap(
    flatMap(
      map.map((r, ri) =>
        r.split("").map((c, ci) => (c === "#" ? { x: ri, y: ci } : undefined))
      )
    )
      .filter((e) => !!e)
      .map((c) => [0, 1].map((z) => ({ ...c, z })))
  );

console.log(mapToCoords());

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

        m(
          containerC,
          { size: "300px", angle },
          //  m(cubicalC, { angle, size: '10px' }),
          mapToCoords(set.coords)
            .map((e) => console.log(e) || e)
            .map((c) =>
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
        ),

        div.field(
          set.coords
            ? set.coords.map((row) => [
                div.row(
                  row
                    .split("")
                    .map((c) => (c === "#" ? div.box.filled() : div.box()))
                ),
              ])
            : "NoCoords"
        ),
      ])
    ),
    input({
      type: "range",
      value: angle,
      max: 360,
      min: 0,
      onchange: (e) => console.log("U", (angle = +e.target.value)),
    }),
  ],
});
