import m from 'mithril';
import { table, tr, td, a, button, h1 } from './tags';
import { pre } from 'tagl-mithril';

const colors = Object.freeze({
    RED: 'RED',
    YELLOW: 'YELLOW',
    BLUE: 'BLUE',
    GREEN: 'GREEN'
});

const pieces = [
    {
        id: 1,
        num: 1,
        color: colors.YELLOW,
        coords: [
            [
                ' #',
                '##',
                ' #'
            ],
            [
                ' #',
                '  ',
                '  '
            ]
        ]
    },
    {
        id: 2,
        num: 2,
        color: colors.YELLOW,
        coords: [
            [
                '##',
                ' #',
                ' #'
            ],
            [
                '  ',
                '  ',
                ' #'
            ]
        ]
    },
    {
        id: 3,
        num: 3,
        color: colors.YELLOW,
        coords: [
            [
                '##',
                '# ',
            ],
            [
                ' #',
                '  ',
            ]
        ]
    },
    {
        id: 4,
        num: 4,
        color: colors.YELLOW,
        coords: [
            [
                '##',
                ' #',
                '##'
            ],
        ]
    },


    {
        id: 5,
        num: 1,
        color: colors.BLUE,
        coords: [
            [
                ' #',
                ' #',
                '##'
            ],
            [
                '  ',
                '  ',
                '# '
            ]
        ]
    },
    {
        id: 6,
        num: 2,
        color: colors.BLUE,
        coords: [
            [
                '# ',
                '##',
                ' #'
            ],
            [
                '# ',
                '  ',
                '  '
            ]
        ]
    },
    {
        id: 7,
        num: 3,
        color: colors.BLUE,
        coords: [
            [
                ' #',
                '##',
                '##'
            ],
        ]
    },
    {
        id: 8,
        num: 4,
        color: colors.BLUE,
        coords: [
            [
                ' #',
                '##'
            ],
        ]
    },


    {
        id: 9,
        num: 1,
        color: colors.RED,
        coords: [
            [
                '##',
                '##',
            ],
            [
                ' #',
                '  ',
            ]
        ]
    },
    {
        id: 10,
        num: 2,
        color: colors.RED,
        coords: [
            [
                '##',
                ' #',
            ],
            [
                '# ',
                '  ',
            ]
        ]
    },
    {
        id: 11,
        num: 3,
        color: colors.RED,
        coords: [
            [
                ' #',
                ' #',
                '##',
            ],
            [
                ' #',
                '  ',
                '  ',
            ]
        ]
    },
    {
        id: 12,
        num: 4,
        color: colors.RED,
        coords: [
            [
                '# ',
                '##',
                ' #'
            ],
        ]
    },

    {
        id: 13,
        num: 1,
        color: colors.GREEN,
        coords: [
            [
                ' #',
                '##',
                '# '
            ],
            [
                ' #',
                '  ',
                '  '
            ]
        ]
    },
    {
        id: 14,
        num: 2,
        color: colors.GREEN,
        coords: [
            [
                '##',
                ' #',
                ' #'
            ],
            [
                '# ',
                '  ',
                '  '
            ]
        ]
    },
    {
        id: 15,
        num: 3,
        color: colors.GREEN,
        coords: [
            [
                ' #',
                '##',
                ' #',
            ],
        ]
    },
    {
        id: 16,
        num: 4,
        color: colors.GREEN,
        coords: [
            [
                ' #',
                ' #',
                '##'
            ],
        ]
    },

];


const cards = [
    {
        id: 'A19',
        1: {
            coords: [
                '  ##',
                '####',
                '#   '
            ],
            combi: [
                {
                    dice: [1, 2],
                    pieces: [10, 13, 9]
                },
                {
                    dice: [3, 4],
                    pieces: [5, 16, 9]
                }
            ]
        },
        2: {
            coords: [
                '####',
                ' ## ',
                '  # '
            ],
            combi: [
                {
                    dice: [5, 6, 7],
                    pieces: [9, 16, 2]
                },
                {
                    dice: [8, 9, 10],
                    pieces: [13, 10, 9]
                }
            ]
        }
    },
    {
        id: 'B19',
        1: {
            coords: [
                '## #',
                ' ###',
                '### '
            ],
            combi: [
                {
                    dice: [1],
                    pieces: [
                        9, 14, 3, 10
                    ]
                },
                {
                    dice: [2],
                    pieces: [
                        8, 13, 9, 5
                    ]
                },
                {
                    dice: [3],
                    pieces: [
                        1, 9, 14, 8
                    ]
                },
                {
                    dice: [4],
                    pieces: [9, 5, 16, 10]
                },
                {
                    dice: [5],
                    pieces: [10, 6, 9, 12]
                }
            ]
        },
        2: {
            coords: [
                '### ',
                '####',
                '#  #'
            ],
            combi: [
                {
                    dice: [6],
                    pieces: [
                        16, 5, 13, 15
                    ]
                },
                {
                    dice: [7],
                    pieces: [
                        16, 1, 7, 10
                    ]
                },
                {
                    dice: [8],
                    pieces: [
                        7, 14, 10, 3
                    ]
                },
                {
                    dice: [9],
                    pieces: [5, 7, 16, 10]
                },
                {
                    dice: [10],
                    pieces: [5, 9, 14, 8]
                }

            ]
        }
    }
]

const state = {
    card: cards[0]
};

const use = (v, f) => f(v);
const previous = (element, arr) => use(arr.indexOf(element) - 1, idx =>
    idx < 0 ? arr[arr.length - 1] : arr[idx]
);

const next = (element, arr) => use(arr.indexOf(element) + 1, idx => idx >= arr.length ? arr[0] : arr[idx])

m.mount(document.getElementById("controls"), {
    view: vnode => [
        h1('AB AN GA'),
        button({ onclick: e => state.card = previous(state.card, cards) }, '<'),
        cards.indexOf(state.card),
        button({ onclick: e => state.card = next(state.card, cards) }, '>'),
        table()
    ]
})


