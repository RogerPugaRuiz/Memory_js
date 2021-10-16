document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("submit").addEventListener("click", create_table);
    document.getElementById("reset").addEventListener("click", remove_user);
}, false);

function create_table() {
    let player1 = document.getElementById("player1").value;
    let player2 = document.getElementById("player2").value;
    let ok_player1 = validate(player1);
    let ok_player2 = validate(player2);
    if (ok_player1) {
        if (ok_player2) {
            document.getElementById("content").classList.add("invisible");
            table();
        } else {
            alert("Nombre de jugador dos \"" + player2 + "\" no valido");
        }
    } else {
        alert("Nombre de jugador uno \"" + player1 + "\" no valido");
    }

}

function table() {
    let table_color = document.createElement("table");
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    let map = {};
    let colors = [
        "red", "red",
        "blue", "blue",
        "orange", "orange",
        "green", "green",
        "black", "black",
        "purple", "purple",
        "yellow", "yellow",
        "gray", "gray"];
    let colors_used = []
    let row = 0;
    let col
    table_color.id = "t-color";

    // create the table with 4 rows
    for (let i = 0; i < 4; i++) {
        let trAux = tr.cloneNode(false);
        col = 0;
        // with 4 columns
        for (let j = 0; j < 4; j++) {
            let tdAux = td.cloneNode(false);

            trAux.appendChild(tdAux);

            let noColor = true;

            // create a random color and compare if it is in list color used
            while (noColor) {
                let random = Math.floor(Math.random() * colors.length);
                if (!colors_used.includes(random)) {
                    //event.target.style.backgroundColor = colors[random];

                    //console.log(cell + " " + row)
                    map[[row, col]] = colors[random];
                    colors_used.push(random);
                    noColor = false;

                }
            }
            col++;
        }
        row++;
        table_color.appendChild(trAux);
    }



    document.getElementById("table").appendChild(table_color);
    game(map);


}

// validate if the name user is valid
// is valid if the length of the text is greater than or equal to 8 and contains only letters
function validate(text) {
    let len = text.length;
    return len >= 8 && isLetter(text) ? true : false;
}

// return true if contains only letters
function isLetter(text) {
    for (let i = 0; i < text.length; i++) {
        if (!text[i].match(/[a-z]/i)) {
            return false;
        }
    }
    return true;
}

// reset the name player
function remove_user() {
    document.getElementById("player1").value = "";
    document.getElementById("player2").value = "";
}


// the logic of the game
function game(map) {
    let player1 = document.getElementById("player1");
    let player2 = document.getElementById("player2");
    let click_elements = [];
    let next_turn = 0;
    let player1_points = 0;
    let player2_points = 0;
    turn(next_turn);
    let h = historial();

    // on click td table elements
    document.getElementById("table").addEventListener("click", function (event) {

        if (event.target.nodeName == "TD") {
            let row = event.target.parentNode.rowIndex;
            let col = event.target.cellIndex;
            // new td clicked
            click_elements.push(event.target);
            event.target.style.backgroundColor = map[[row, col]];
            event.target.classList.add("on_click");

            // when you have 2 clicks
            if (click_elements.length == 2) {
                // console.log(click_elements[0].style.backgroundColor + " " + click_elements[1].style.backgroundColor)

                // if first td has different color than the second pass next turn
                if (click_elements[0].style.backgroundColor !== click_elements[1].style.backgroundColor) {
                    next_turn++;
                    if (next_turn > 1) {
                        next_turn = 0;
                    }
                    
                    // drop de clicks after 1 second
                    setTimeout(() => {
                        for (let i = 0; i < click_elements.length; i++) {
                            click_elements[i].style.backgroundColor = "";
                            click_elements[i].classList.remove("on_click");
                        }
                        click_elements = [];
                    }, 1000);

                    turn(next_turn);

                }
                // if first td has equal color than the second and the first is diferent object than the second
                // increment the player point
                else if (click_elements[0].style.backgroundColor === click_elements[1].style.backgroundColor && click_elements[0] !== click_elements[1]) {
                    if (next_turn == 0) {
                        player1_points++;

                        histori_add_element(player1.value,click_elements[0].style.backgroundColor,click_elements[1].style.backgroundColor);

                    } else if (next_turn == 1) {
                        player2_points++;

                        histori_add_element(player2.value,click_elements[0].style.backgroundColor,click_elements[1].style.backgroundColor);

                    }
                    click_elements = [];
                    
                }
                

            }
        }

        // end the game
        let total_points = player1_points + player2_points;
        if (total_points >= 8) {
            
            // if player 1 have more points than the player 2 he won.
            if (player1_points > player2_points) {
                alert("El ganador/a es " + player1.value);
            } else if (player1_points === player2_points) {
                alert("Empate");
            }
            else {
                alert("El ganador/a es " + player2.value);
            }
        }
        // console.log(player1_points + " " + player2_points);
    });

}

function turn(turn_value) {
    let div_turn = document.getElementById("turn");
    div_turn.innerHTML = "<h1 id=\"h1_style\">Turno de <span id=\"player_turn\"></span></h1>";
    let player1 = document.getElementById("player1").value;
    let player2 = document.getElementById("player2").value;

    if (turn_value == 0) {
        document.getElementById("player_turn").innerText = player1;
    } else if (turn_value == 1) {
        document.getElementById("player_turn").innerText = player2;
    }
}

function historial() {
    let aside = document.createElement("aside");
    aside.id = "historial";
    let h2 = document.createElement("h2");
    h2.innerHTML = "Cartas";
    aside.appendChild(h2);
    document.getElementById("table").appendChild(aside);
    return aside;
}
function histori_add_element(player_text, color1_click, color2_click) {
    let div = document.createElement("div");
    let player = document.createElement("span");
    let color1 = document.createElement("span");
    let color2 = document.createElement("span");

    div.classList.add("histori_add_element");
    player.innerText = player_text;
    color1.style.backgroundColor = color1_click;
    color2.style.backgroundColor = color2_click;
    player.classList.add("player");
    color1.classList.add("colors");
    color2.classList.add("colors");

    div.appendChild(player);
    div.appendChild(color1);
    div.appendChild(color2);

    document.getElementById("historial").appendChild(div);
}