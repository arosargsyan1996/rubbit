const selectNode = document.getElementById("select");
const startButtonNode = document.getElementById("start");
const deskNode = document.getElementById("desk");
const WOLF = "wolf";
const RABBIT = "rabbit";
const HOUSE = "house";
const BARRIER = "barrier";

const initialCharacters = [RABBIT, HOUSE];
const rules = {
    "5": {
        txt: "5x5",
        wolfs: 3,
        barriers: 2,
    },
    "7": {
        txt: "7x7",
        wolfs: 4,
        barriers: 3,
    },
    "10": {
        txt: "10x10",
        wolfs: 5,
        barriers: 4,
    }
}

let selectedValue = selectNode.value;

selectNode.addEventListener("change", e => {
    selectedValue = e.target.value;
});

startButtonNode.addEventListener("click", e => {
    console.log("START", selectedValue);
    startGame();
});

function startGame() {
    const currentCharacters = [
        ...initialCharacters,
        ...Array.from({length: rules[selectedValue].wolfs}, (_, i) => WOLF + (i + 1)),
        ...Array.from({length: rules[selectedValue].barriers}, (_, i) => BARRIER+ (i + 1))
    ];

    const charactersPositions = generateCharactersPositions(currentCharacters);
    generateDesc();
    const {rabbitNode, wolfsNodes} = generateCharacters(charactersPositions);
    const barriersPositions = Object.keys(charactersPositions)
        .filter(character => character.replace(/[0-9]/g, '') === BARRIER)
        .map(character => charactersPositions[character])

    //? {"b1":{t,l}} === [{t, l},{}]

    document.addEventListener("keydown", (e) => {
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
            const rubbitPosition = changeRubbitPosition(charactersPositions[RABBIT], barriersPositions, e.key)

            if (rubbitPosition) {
                //const wolfsPositions = getWolfsPositions(charactersPositions)

                charactersPositions[RABBIT] = rubbitPosition;
                rabbitNode.style.top = rubbitPosition.top + "px";
                rabbitNode.style.left = rubbitPosition.left + "px";

                // const newWolfPositions = regenerateWolfsPositions(rubbitPosition, wolfsPositions, [...barriersPositions, changeRubbitPosition[HOUSE]], wolfsNodes)

                // for (const wolf of Object.keys(newWolfPositions)) {
                //     charactersPositions[wolf] = newWolfPositions[wolf]
                // }

            }


        }

    })

}

// function getWolfsPositions(charactersPositions) {
//     const wolfsPositions = {}
//     Object.keys(charactersPositions).forEach(character => {
//         if (character.replace(/[0-9]/g, '') === WOLF) {
//             wolfsPositions[character] = charactersPositions[character]
//         }
//     });
//
//     return wolfsPositions;
//
// }

// function regenerateWolfsPositions(rubbitPosition, wolfsPositions, unpossiblePositions, wolfsNodes) {
//     try {
//         let previusWolfPositions = {}
//         for (const wolf of Object.keys(wolfsNodes)) {
//             const wolfPosition = wolfsPositions[wolf];

//             if (rubbitPosition.left === wolfPosition.left && rubbitPosition.top === wolfPosition.top) {
//                 throw new Error("onSamePosition")
//             } else if (rubbitPosition.left === wolfPosition.left) {
//                 wolfsPositions[wolf].top = changeTopPosition(rubbitPosition.top, wolfPosition.top);
//             } else if (rubbitPosition.top === wolfPosition.top) {
//                 wolfsPositions[wolf].left = changeLeftPosition(rubbitPosition.left, wolfPosition.left);
//             } else {
//                 let unpossibleDirection = null;
//                 let nextWolfPosition = {
//                     top: changeTopPosition(rubbitPosition.top, wolfPosition.top),
//                     left: changeLeftPosition(rubbitPosition.left, wolfPosition.left)
//                 }

//                 for (const previusWolf of Object.keys(previusWolfPositions)) {
//                     const previusWolfPosition = previusWolfPositions[previusWolf]

//                     if (previusWolfPosition.top === nextWolfPosition.top) {
//                         unpossibleDirection = "TOP"
//                         delete nextWolfPosition.top;
//                         break
//                     }


//                     if (previusWolfPosition.left === nextWolfPosition.left) {
//                         unpossibleDirection = "LEFT"
//                         delete nextWolfPosition.left;
//                         break
//                     }
//                 }


//                 if (unpossibleDirection === null) {
//                     unpossibleDirection = ["LEFT", "TOP"][getRandumNumber(2)]
//                 }

//                 if (unpossibleDirection === "LEFT") {
//                     wolfsPositions[wolf].top = nextWolfPosition.top;
//                 } else if (unpossibleDirection === "TOP") {
//                     wolfsPositions[wolf].left = nextWolfPosition.left;
//                 }


//                 wolfsNodes[wolf].style.top = wolfsPositions[wolf].top + "px"
//                 wolfsNodes[wolf].style.left = wolfsPositions[wolf].left + "px"



//                 // if (rubbitPosition.left === wolfsPositions[wolf].left && rubbitPosition.top === wolfsPositions[wolf].top) {
//                 //     throw new Error("onSamePosition")
//                 // }

//             }
//             previusWolfPositions[wolf] = wolfPosition;

//         }

//         return wolfsPositions;
//     } catch (error) {
//         if (error.message = "onSamePosition") {
//             return null
//         }
//     }


//     function changeTopPosition (rubbitPositionTop, wolfPositionTop) {
//         if (rubbitPositionTop > wolfPositionTop) {
//             return wolfPositionTop + 50
//         } else {
//             return wolfPositionTop - 50
//         }
//     }

//     function changeLeftPosition (rubbitPositionLeft, wolfPositionLeft) {
//         if (rubbitPositionLeft > wolfPositionLeft) {
//             return wolfPositionLeft + 50
//         } else {
//             return wolfPositionLeft - 50
//         }
//     }
// }

function changeRubbitPosition(rubbitPosition, barrierPositions, direction) {
    const nextRubbitPosition = {...rubbitPosition}
    let canChangePosition = true;

    if (direction === "ArrowLeft") {
        nextRubbitPosition.left = (rubbitPosition.left - 50 < 0) ? (selectedValue - 1) * 50 : rubbitPosition.left - 50
    } else if (direction === "ArrowRight") {
        nextRubbitPosition.left = (rubbitPosition.left + 50 > (selectedValue - 1) * 50) ? 0 : rubbitPosition.left + 50
    } else if (direction === "ArrowUp") {
        nextRubbitPosition.top = (rubbitPosition.top - 50 < 0) ? (selectedValue - 1) * 50 : rubbitPosition.top - 50
    } else if (direction === "ArrowDown") {
        nextRubbitPosition.top = (rubbitPosition.top + 50 > (selectedValue - 1) * 50) ? 0 : rubbitPosition.top + 50
    }


    for (const barrierPosition of barrierPositions) {
        if (nextRubbitPosition.left === barrierPosition.left && nextRubbitPosition.top === barrierPosition.top) {
            canChangePosition = false;
            break
        }
    }


    return canChangePosition ? nextRubbitPosition : null;
}

function generateCharactersPositions(currentCharacters) {
    //?  currentCharacters = ["a", "b"]
    //?  charactersPositions = {"a": {}, "b": {}}
    //? [charactersPositions.value || {t , l}, {}]

    const charactersPositions = {}

    let i = 0;
    do {
        let isUnique = true;
        let currentCharacter = {};
        currentCharacter.left = getRandumNumber(selectedValue) * 50
        currentCharacter.top = getRandumNumber(selectedValue) * 50
        for (let character of Object.values(charactersPositions)) { // if first time its empty
            if (character.top === currentCharacter.top && character.left === currentCharacter.left) {
                console.log("REGENERATE")
                isUnique = false;
                break;
            }
        }
        if (isUnique) {
            charactersPositions[currentCharacters[i]] = currentCharacter; //? pushing
            ++i;
        }
    } while (Object.keys(charactersPositions).length < currentCharacters.length)

    return charactersPositions;
}

function generateDesc() {
    deskNode.innerHTML = "";
    deskNode.style.width = selectedValue * 50 + "px";
    for (let i = 0; i < selectedValue ** 2; i++) {
        createCell();
    }
}

function generateCharacters(charactersPositions) {
    const wolfsNodes = {};
    let rabbitNode = null;

    for (let character of Object.keys(charactersPositions)) {
        const cellNode = createCell(character.replace(/[0-9]/g, ''));
        cellNode.style.left = charactersPositions[character].left + "px";
        cellNode.style.top = charactersPositions[character].top + "px";
        if (character === RABBIT) {
            rabbitNode = cellNode;
        } else if (character.replace(/[0-9]/g, '') === WOLF) {
            wolfsNodes[character] = cellNode;
        }
    }

    return {rabbitNode, wolfsNodes};
}

function createCell(element = "") {
    const cellNode = document.createElement("div");
    const classList = element ? ["cell", element] : ["cell"];

    cellNode.classList.add(...classList);
    deskNode.appendChild(cellNode);

    if (element) {
        if (element === RABBIT) {
            cellNode.id = element;
        }
        // for characters
        return cellNode;
    }
}

function getRandumNumber(max, min = 0) {
    return Math.floor(Math.random() * (max - min) + min);
}
