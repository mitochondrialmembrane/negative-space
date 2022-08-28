const c = document.getElementById("canvas").getContext("2d");

let currentLevel;
let keysDown = {};
let level;

// black avatar
const black = 
{
    x: 128,
    y: 224,
    width: 24,
    height: 32,
    speed: 3,
    vsp: 0,
    grv: 1,
    onGround: false,
    jump: 8,
    objColor: "#0f0f0f",
    lvlColor: "#1c1c1c",
    flagColor: "#0d0d0d"
}

// white avatar
const white = 
{
    x: 256,
    y: 256,
    width: 32,
    height: 32,
    speed: 3,
    vsp: 0,
    grv: 1,
    onGround: true,
    jump: 8,
    objColor: "#f0f0f0",
    lvlColor: "#e3e3e3",
    flagColor: "#f1f1f1"
}

let isInverted = false;
let isWin = false;
let isFlipping = false;
let rotation = 0;

function draw()
{
    c.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let row = 0; row < currentLevel.length; row++) // draws black & white platform squares
    {
        for (let col = 0; col < currentLevel[0].length; col++) 
        {
            if ((currentLevel[row][col] === "1") || (currentLevel[row][col] === "}")) 
            {
                c.fillStyle = black.lvlColor;
                c.fillRect(col * 32, row * 32, 32, 32);
            }
            if ((currentLevel[row][col] === "0") || (currentLevel[row][col] === "{")) 
            {
                c.fillStyle = white.lvlColor;
                c.fillRect(col * 32, row * 32, 32, 32);
            }
        }
    }

    for (let row = 0; row < currentLevel.length; row++) // draws flags
    {
        for (let col = 0; col < currentLevel[0].length; col++) 
        {
            if (currentLevel[row][col] === "{")
            {
                c.fillStyle = black.flagColor;
                if (isInverted == false)
                {
                    c.fillRect(col * 32 + 14, row * 32 - 20, 4, 54);
                    c.fillRect(col * 32 + 14, row * 32 - 20, 32, 20);
                }
                else
                {
                    c.fillRect(col * 32 + 14, row * 32, 4, 54);
                    c.fillRect(col * 32 - 14, row * 32 + 34, 32, 20);
                }
            }
            
            if (currentLevel[row][col] === "}") 
            {
                c.fillStyle = white.flagColor;
                if (isInverted == false)
                {
                    c.fillRect(col * 32 + 14, row * 32, 4, 54);
                    c.fillRect(col * 32 - 14, row * 32 + 34, 32, 20);
                }
                else
                {
                    c.fillRect(col * 32 + 14, row * 32 - 20, 4, 54);
                    c.fillRect(col * 32 + 14, row * 32 - 20, 32, 20);
                }
            }
        }
    }
    

    if (isInverted == false) // draws the player avatars
    {
        c.fillStyle = white.objColor;
        c.fillRect(white.x, white.y, white.width, white.height);
    
        c.fillStyle = black.objColor;
        c.fillRect(black.x, black.y, black.width, black.height);
        c.font = "bold 28px Courier New";
        if (isFlipping == false) c.fillText('Level ' + level, 10, 32);
    }
    else
    {
        
        c.fillStyle = black.objColor;
        c.fillRect(black.x, black.y, black.width, black.height);

        c.fillStyle = white.objColor;
        c.fillRect(white.x, white.y, white.width, white.height);
        if (isFlipping == false) c.fillText('Level ' + level, 10, 32);
    }
    
}

function hexify(n) // converts to hexadecimal & addes '0'padding if needed
{
    var hex = n.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function getColor(x, y) // gets color of pixel on canvas
{
    var imgData = c.getImageData(x, y, 1, 1);
    return "#" + hexify(imgData.data[0]) + hexify(imgData.data[1]) + hexify(imgData.data[2]);
}

addEventListener("keydown", function(event)
{
    keysDown[event.keyCode] = true;
});

addEventListener("keyup", function(event)
{
    delete keysDown[event.keyCode];
});

function input(obj)
{
    if ((65 in keysDown) || (37 in keysDown)) // move left
    {
        if ((getColor((obj.x - obj.speed) - 1, obj.y + obj.vsp) !== obj.lvlColor) && (getColor((obj.x - obj.speed) - 1, obj.y + obj.vsp + obj.height - 1) !== obj.lvlColor) && (obj.x > 0)) // player moves if no collision
        {
            obj.x -= obj.speed;
        }
        else if ((getColor(obj.x - 1, obj.y + obj.vsp) !== obj.lvlColor) && (getColor(obj.x - 1, obj.y + obj.vsp + obj.height - 1) !== obj.lvlColor) && (obj.x > 0)) // if player is close to the wall
        {
            obj.x--;
        }

        if ((getColor((obj.x + obj.width - obj.speed - 1), obj.y + obj.vsp) == obj.flagColor) || (getColor((obj.x + obj.width - obj.speed - 1), obj.y + obj.vsp + obj.height - 1) == obj.flagColor)) // flag collision
        {
            nextLevel();
        }
    }
  
    if ((68 in keysDown) || (39 in keysDown)) // move right
    {
        if ((getColor((obj.x + obj.width + obj.speed), obj.y + obj.vsp) !== obj.lvlColor) && (getColor((obj.x + obj.width + obj.speed), obj.y + obj.vsp + obj.height - 1) !== obj.lvlColor) && (obj.x + obj.width - 2 < canvas.width))
        {
            obj.x += obj.speed;
        }
        else if ((getColor(obj.x + obj.width, obj.y + obj.vsp) !== obj.lvlColor) && (getColor(obj.x + obj.width, obj.y + obj.vsp + obj.height - 1) !== obj.lvlColor) && (obj.x + obj.width - 2 < canvas.width))
        {
            obj.x++;
        }
        
        if ((getColor((obj.x + obj.width + obj.speed + 1), obj.y + obj.vsp) == obj.flagColor) || (getColor((obj.x + obj.width + obj.speed + 1), obj.y + obj.vsp + obj.height - 1) == obj.flagColor))
        {
            nextLevel();
        }
    }
}

function gravity(obj)
{
    if (obj.onGround == false) // player is in the air
    {   
        if (obj.vsp > 0) // player is falling
        {
            if ((getColor(obj.x, obj.y + obj.height) == obj.lvlColor) || (getColor(obj.x + obj.width - 1, obj.y + obj.height) == obj.lvlColor)) //checks if player is on the ground
            {
                obj.vsp = 0;
                obj.onGround = true;
            }
            else
            {
                for (let i = 0; i < obj.vsp; i++) // checks if player will hit the ground
                {
                    if ((getColor(obj.x, obj.y + obj.height + obj.vsp - i) !== obj.lvlColor) && (getColor(obj.x + obj.width - 1, obj.y + obj.height + obj.vsp - i) !== obj.lvlColor) && (obj.vsp - i < 32))
                    {
                        obj.y += obj.vsp - i + 1;
                        if (i == 0) // player does not hit the ground if vsp is fully applied
                        {
                            obj.vsp += obj.grv;
                        }
                        else // player hits the ground
                        {
                            obj.vsp = 0;
                            obj.onGround = true;
                        }
                        break;
                    }
                }
            }
        }
        else if (obj.vsp < 0) // player is rising
        {
            if ((getColor(obj.x, obj.y - 1) == obj.lvlColor) || (getColor(obj.x + obj.width - 1, obj.y - 1) == obj.lvlColor)) // checks if player is touching the ceiling
            {
                obj.vsp = 0;
            }
            else
            {
                for (let i = 0; i > obj.vsp; i--) // checks if player will hit the ceiling
                {
                    if ((getColor(obj.x, obj.y + obj.vsp - i - 1) !== obj.lvlColor) && (getColor(obj.x + obj.width - 1, obj.y + obj.vsp - i - 1) !== obj.lvlColor) && (obj.vsp - i > -32))
                    {
                        obj.y += obj.vsp - i - 1;
                        break;
                    }
                    
                }

                obj.vsp += obj.grv;
            }
        }
        else
        {
            obj.vsp += obj.grv;
        }

        if ((getColor(obj.x, obj.y + obj.height) == obj.flagColor) || (getColor(obj.x + obj.width - 1, obj.y + obj.height) == obj.flagColor))
        {
            nextLevel();
        }
    }
    else // player is on the ground
    {
        if ((87 in keysDown) || (38 in keysDown)) // player jump
        {
            obj.vsp -= obj.jump;
            obj.onGround = false;
            delete(keysDown[87]);
            delete(keysDown[38]);
        }

        if ((getColor(obj.x, obj.y + obj.height) !== obj.lvlColor) && (getColor(obj.x + obj.width - 1, obj.y + obj.height) !== obj.lvlColor))
        {
            obj.onGround = false;
        }
    }
}

function gridSnap(n, gridSize) // snaps position to multiple of some number
{
    
    if (n % gridSize >= gridSize / 2)
    {
        return n - (n % gridSize) + gridSize;
    }
    else
    {
        return n - (n % gridSize);
    }
}

function invert()
{
    if (32 in keysDown) // activates if player presses space
    {
        isFlipping = true;
        delete(keysDown[32]);
    }
}

function win() // displays win screen
{
    c.clearRect(0, 0, canvas.width, canvas.height);

    c.fillStyle = white.lvlColor;
    c.fillRect(0, 0, canvas.width, canvas.height / 2);

    c.fillStyle = black.lvlColor;
    c.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

    c.font = "bold 84px Courier New";

    c.fillStyle = black.objColor;
    c.fillText('YOU', canvas.width / 2 - 80, canvas.height / 2 - 20);

    c.fillStyle = white.objColor;
    c.fillText('WIN', canvas.width / 2 - 80, canvas.height / 2 + 70);
}

function nextLevel() //advances to the next level
{
    if (level == 0) // for restart implementation
    {
        currentLevel = parse(level0);
        isInverted = false;
        
        black.width = 24;
        black.x = 128;
        black.y = 224;

        white.width = 32;
        white.x = 256;
        white.y = 256;
    }
    
    if (level == 1)
    {
        currentLevel = parse(level1);
        isInverted = true;
        
        black.width = 32; // set new avatar positions & widths
        black.x = 288;
        black.y = 256;

        white.width = 24;
        white.x = 516;
        white.y = 288;
    }

    if (level == 2)
    {
        currentLevel = parse(level2);
        isInverted = false;
        
        black.width = 24;
        black.x = 196;
        black.y = 256;

        white.width = 32;
        white.x = 512;
        white.y = 288;
    }

    if (level == 3)
    {
        currentLevel = parse(level3);
        isInverted = false;
        
        black.width = 24;
        black.x = 68;
        black.y = 96;

        white.width = 32;
        white.x = 416;
        white.y = 384;
    }

    if (level == 4)
    {
        currentLevel = parse(level4);
        isInverted = true;
        
        black.width = 32;
        black.x = 288;
        black.y = 192;

        white.width = 24;
        white.x = 100;
        white.y = 160;
    }

    if (level == 5)
    {
        isWin = true;
        win();
    }

    level++;
}

function restart() // restarts current level
{
    if (82 in keysDown)
    {
        level--;
        nextLevel();
        delete(keysDown[82]);
    }

    /*if (78 in keysDown)
    {
        nextLevel();
        delete(keysDown[78]);
    }*/
}

function flip() // adds canvas rotation animation
{
    if (rotation >= 180)
    {
        c.rotate(Math.PI); // resets rotation
        c.translate(-canvas.width, -canvas.height);
        rotation = 0;

        // rotates the level platform
        currentLevel[0] = currentLevel[0].reverse(); 
        for (let i = 0; i < currentLevel.length; i++)
        {
            currentLevel[i] = currentLevel[i].reverse();
        }
        currentLevel = currentLevel.reverse();
        
        // translates player position to inverted spot
        black.y = canvas.height - black.y - black.height;
        white.y = canvas.height - white.y - white.height;

        if (isInverted == false)
        {
            isInverted = true;

            black.width = 32; // changes width of avatars
            black.x = canvas.width - black.x - black.width + 4;
            black.x = gridSnap(black.x, 16);
            black.y = gridSnap(black.y, 16);
            
            white.width = 24;
            white.x = canvas.width - white.x - white.width - 4; 
        }
        else
        {
            isInverted = false;

            black.width = 24;
            black.x = canvas.width - black.x - black.width - 4;
            
            white.width = 32;
            white.x = canvas.width - white.x - white.width + 4;
            white.x = gridSnap(white.x, 16);
            white.y = gridSnap(white.y, 16);
        }

        isFlipping = false;
    }
    else
    {
        
        c.translate(canvas.width / 2, canvas.height / 2);
        c.rotate(9 * Math.PI / 180); // rotates canvas
        c.translate(-canvas.width / 2, -canvas.height / 2);

        rotation += 9;
    }
}

function main()
{
    if (isFlipping == false)
    {
        invert();

        if (isInverted == false) // applies physics and input to active avatar
        {
            input(black);
            gravity(black);
        }
        else
        {
            input(white);
            gravity(white);
        }
    
        if (isWin == false)
        {
            draw();
        }
        restart();
    }
    else
    {
        flip();
        draw();
    }
    
    requestAnimationFrame(main);
}


const level0 = 
`00000000000000000000
00000000000000000000
00000000000000000000
00000000000000000000
00000000000000000000
00000000000000000000
00000000000000100000
00000000000000100{00
11111111111111111111
11111111111111111111
11111111111111111111
11111111111111111111
11111111111111111111
11111111111111111111
11111111111111111111
11111111111111111111`;

const level1 = 
`11111111111111111111
11111111111111111111
11111111111111111111
11111111111111111111
11111111111111111111
11111111111111111111
11111111111111111111
11111111111111111111
00{00000100000001000
00000000100000001000
00000000000000000000
00000000000000000000
00000000000000000000
00000000000000000000
00000000000000000000
00000000000000000000`;

const level2 = 
`00000000000000000000
00000000000000000000
00000000000000000000
00000000000000000000
000000{0000000000000
00000010000000000000
00000101000000000000
00001000100000000000
00110000010000000000
11101111111000111111
11100000000001111111
11111111111111111111
11111111111111111111
11111111111111111111
11111111111111111111
11111111111111111111`;

const level3 = 
`00000000000000000000
00000000000000000000
00000000000000000000
00000000000000000000
1111100011101111}111
11111100111011111111
11111110111011111111
11110000111011111111
11110111111011111111
11110001111011111111
11111100011001111111
11111111100000000000
11111111111111111111
11111111111111111111
11111111111111111111
11111111111111111111`;

const level4 = 
`11111111111111111111
11111111111111111111
11111111111111101111
11111111111111100111
11111111110000000011
11111111110111111101
00000111000100001000
01110101100100100110
01}10100110101000000
00010100011110000000
00011100001100000000
00000001100000000000
00000000000000000000
00000000000000000000
00000000000000000000
00000000000000000000`;

function parse(level) // splits level string into array with rows
{
  const lines = level.split("\n");
  const characters = lines.map(x => x.split(""));
  return characters;
}


window.onload = function()
{
    currentLevel = parse(level0);
    level = 1;
    main();
}