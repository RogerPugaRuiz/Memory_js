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
            let img = document.createElement("img");
            img.src = "static/memory.png";
            img.classList.add("img_memory");
            tdAux.appendChild(img);
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
    historial(player1.value,player2.value);

    // on click td table elements
    document.getElementById("table").addEventListener("click", function (event) {

        // if img Memory is clicked
        if (event.target.nodeName == "IMG" && click_elements.length < 2) {

            // img do invisible
            event.target.style.visibility = "hidden";
            // rotate the td table
            event.target.parentNode.style.transform = "rotateY(180deg)";

            // get the row and cell td index
            let row = event.target.parentNode.parentNode.rowIndex;
            let col = event.target.parentNode.cellIndex;
            
            // add new click_elements
            click_elements.push(event.target.parentNode);
            event.target.parentNode.style.backgroundColor = map[[row, col]];
            // style click td
            event.target.parentNode.classList.add("on_click");

            // when you have 2 clicks
            if (click_elements.length == 2) {
                // console.log(click_elements[0].style.backgroundColor + " " + click_elements[1].style.backgroundColor)
                // if first td has different color than the second pass next turn

                if (click_elements[0].style.backgroundColor !== click_elements[1].style.backgroundColor) {
                    next_turn++;
                    if (next_turn > 1) {
                        next_turn = 0;
                    }
                    
                    // drop de clicks after 2 second
                    setTimeout(() => {
                        for (let i = 0; i < click_elements.length; i++) {
                            click_elements[i].style.transform = "rotateY(360deg)";
                            click_elements[i].style.backgroundColor = "";
                            click_elements[i].classList.remove("on_click");
                            click_elements[i].childNodes[0].style.visibility = "visible";
                        }
                        click_elements = [];
                    }, 2000);

                    turn(next_turn);
                }
                // if first td has equal color than the second and the first is diferent object than the second
                // increment the player point
                else if (click_elements[0].style.backgroundColor === click_elements[1].style.backgroundColor && click_elements[0] !== click_elements[1]) {
                    if (next_turn == 0) {
                        player1_points++;
                        histori_add_element(document.getElementById("player1_name"),click_elements[0].style.backgroundColor,click_elements[1].style.backgroundColor);
                    } else if (next_turn == 1) {
                        player2_points++;
                        histori_add_element(document.getElementById("player2_name"),click_elements[0].style.backgroundColor,click_elements[1].style.backgroundColor);
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

// show the text turn game
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


// show the history turn game
function historial(player1_name_parameter, player2_name_parameter) {
    let aside = document.createElement("aside");
    let player1 = document.createElement("div");
    let player2 = document.createElement("div");
    let player1_name = document.createElement("span");
    let player2_name = document.createElement("span");
    let h2 = document.createElement("h2");

    player1.classList.add("players");
    player2.classList.add("players");
    player1.id = "player1_name";
    player2.id = "player2_name";
    player1_name.classList.add("player_name");
    player2_name.classList.add("player_name");
    player1_name.innerText = player1_name_parameter;
    player2_name.innerText = player2_name_parameter;

    player1.appendChild(player1_name);
    player2.appendChild(player2_name);

    aside.id = "historial";
    h2.innerHTML = "Cartas";
    aside.appendChild(h2);
    aside.appendChild(player1);
    aside.appendChild(player2);
    document.getElementById("table").appendChild(aside);
}

// add the colors in
function histori_add_element(player, color1_click, color2_click) {
    let color1 = document.createElement("span");
    let color2 = document.createElement("span");

    color1.style.backgroundColor = color1_click;
    color2.style.backgroundColor = color2_click;
    color1.classList.add("colors");
    color2.classList.add("colors");

    player.appendChild(color1);
    player.appendChild(color2);

}