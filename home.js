document.body.style.maxWidth = "600px";
document.body.style.margin = "auto";

let changeColorButton = document.getElementById('change_bg_color_button');
changeColorButton.addEventListener("click", changeBGColor);

function changeBGColor(){

    let bg = document.body;
    bg.style.backgroundColor = randomBGColor();
    
}

function randomBGColor(){

    let randomColor = "rgb(" + Math.floor(Math.random() * 256) + ", " + Math.floor(Math.random() * 256) + ", " + Math.floor(Math.random() * 256) + ")";
    return randomColor;
}