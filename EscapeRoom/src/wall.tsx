import * as React from 'react';
import { GameState } from './gameState';
import { Service } from './service';

interface WallProps {
    service: Service;
    viewOnly: boolean;
}

interface WallState {
    game: GameState,
    x: number,
    y: number
}

const maze: Array<Array<string>> = [
    ['nw', 'ns', 'n', 'ns', 'ns', 'ns', 'ns', 'ne', 'nw', 'ns', 'ns', 'n', 'ne', 'nw', 'ne'],
    ['ws', 'ne', 'ws', 'ns', 'ns', 'ne', 'nw', 'es', 'w', 'nes', 'nw', 'es', 'ws', 'es', 'ew'],
    ['nw', 'es', 'new', 'nw', 'ns', 'es', 'ws', 'ne', 'ew', 'nw', 'es', 'nw', 'ns', 'ne', 'ew'],
    ['ws', 'ne', 'ew', 'ew', 'nw', 'n', 'nes', 'ew', 'ews', 'w', 'ns', 'es', 'nw', 'es', 'ew'],
    ['nw', 's', 'es', 'ew', 'ew', 'ws', 'ne', 'ws', 'ne', 'ws', 'ne', 'nw', 'e', 'nws', 'es'],
    ['ws', 'ne', 'nw', 'es', 'ew', 'new', 'ws', 'ns', 's', 'ne', 'ew', 'ew', 'ews', 'nw', 'ne'],
    ['nws', 'es', 'ew', 'nws', 's', 'e', 'nw', 'ne', 'new', 'ew', 'ews', 'ws', 'ns', 'e', 'ew'],
    ['nw', 'ne', 'ws', 'ne', 'nw', 'es', 'ew', 'ews', 'ew', 'ws', 'ne', 'nw', 'ne', 'ew', 'ew'],
    ['ew', 'ws', 'ns', 'es', 'ews', 'nw', 'es', 'nw', 's', 'ns', 'es', 'ew', 'ew', 'ews', 'ew'],
    ['ew', 'nw', 'ns', 'ns', 'ns', 'es', 'nw', 'es', 'nws', 'ns', 'ns', 'e', 'ew', 'nw', 'e'],
    ['ew', 'ew', 'nws', 'ns', 'ns', 'ns', 's', 'ns', 'ns', 'ne', 'nw', 'es', 'ws', 'es', 'ew'],
    ['ew', 'ew', 'nw', 'ns', 'ns', 'ns', 'ns', 'ne', 'new', 'ew', 'ws', 'ne', 'nw', 'ns', 'es'],
    ['ew', 'ws', 'es', 'nw', 'n', 'ne', 'nw', 'es', 'ew', 'ws', 'ne', 'ew', 'ew', 'nw', 'ne'],
    ['ew', 'nw', 'ne', 'ew', 'ew', 'ews', 'ew', 'new', 'w', 'ns', 'es', 'ew', 'ws', 'es', 'ew'],
    ['ws', 'es', 'ws', 'es', 'ws', 'ns', 'es', 'ws', 's', 'ns', 'ns', 'es', 'nws', 'ns', 'es']
];

const keyClue: [number, number] = [6, 6];
const clue1: [number, number] = [0, 0];
const clue2: [number, number] = [14, 14];
const clue3: [number, number] = [14, 0];
const clue4: [number, number] = [0, 14];

export class Wall extends React.Component<WallProps, WallState> {
    font: FontFace;

    constructor(props: WallProps) {
        super(props);

        this.font = new FontFace('EB Garamond', 'url(src/EBGaramondSC12-Regular.ttf');

        this.Draw = this.Draw.bind(this);
        this.DrawMazePrompt = this.DrawMazePrompt.bind(this);
        this.DrawMaze = this.DrawMaze.bind(this);
        this.DrawClue1 = this.DrawClue1.bind(this);
        this.DrawClue2 = this.DrawClue2.bind(this);
        this.DrawClue3 = this.DrawClue3.bind(this);
        this.DrawClue4 = this.DrawClue4.bind(this);
        this.DrawBoardPrompt = this.DrawBoardPrompt.bind(this);

        this.ReceiveUpdate = this.ReceiveUpdate.bind(this);
        this.OnKeyDown = this.OnKeyDown.bind(this);

        this.state =
        {
            game: {
                keyCount: 1,
                mazeX: 6,
                mazeY: 6,
                kaleidoscopeGear1: 0,
                kaleidoscopeGear2: 0,
                kaleidoscopeGear3: 0,
                bookPage: 0,
                clue1Seen: false,
                clue2Seen: false,
                clue3Seen: false,
                clue4Seen: false,
                solved3Board: false,
                solved4Board: false,
                finished: false,
                use4Board: false,
                loaded: false,
                runesValid: true,
                activeRunes: [],
                runeCharges: []
            },
            x: 6,
            y: 6
        };
    }

    ReceiveUpdate(gameState: GameState) {
        let x = gameState.loaded ? gameState.mazeX : this.state.x;
        let y = gameState.loaded ? gameState.mazeY : this.state.y;

        this.setState({ game: gameState, x, y }, () => this.Draw());
    }

    Draw() {
        let canvas = document.getElementById('wall-canvas') as HTMLCanvasElement;
        let ctx = canvas.getContext('2d')!;

        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#000000';

        let background = document.getElementById('wall-background') as HTMLImageElement;

        if (!background) {
            return;
        }

        if (this.font.status != 'loaded') {
            return;
        }

        let shadowCanvas = document.getElementById('wall-shadow-canvas') as HTMLCanvasElement;
        let shadowCtx = shadowCanvas.getContext('2d')!;

        shadowCtx.globalCompositeOperation = 'source-over';
        shadowCtx.fillStyle = '#000000';
        shadowCtx.fillRect(0, 0, shadowCanvas.width + 1, shadowCanvas.height + 1);

        ctx.drawImage(background, 0, 0);

        if (this.state.game.keyCount < 4) {
            this.DrawMazePrompt(ctx, shadowCtx, 170, 300);
        }

        // TODO: Add transition from full key count to clue 1? 
        if (this.state.game.keyCount == 4) {
            this.DrawClue1(ctx, shadowCtx, 250, 300);
        }

        if (this.state.game.clue1Seen) {
            this.DrawClue2(ctx, shadowCtx, 250, 430);
        }

        if (this.state.game.clue2Seen) {
            this.DrawClue3(ctx, shadowCtx, 250, 650);
        }

        if (this.state.game.clue3Seen) {
            this.DrawClue4(ctx, shadowCtx, 250, 820);
        }
        
        if (this.state.game.clue4Seen) {
            this.DrawBoardPrompt(ctx, shadowCtx, 250, 1300);
        }

        this.DrawMaze(ctx, shadowCtx, 1000, 200);

        ctx.resetTransform();
        //ctx.drawImage(shadowCanvas, 0, 0);
    }

    DrawMaze(ctx: CanvasRenderingContext2D, shadowCtx: CanvasRenderingContext2D, x: number, y: number) {
        const space: number = 40;
        const lightRadius = space / 2.0;

        ctx.resetTransform();
        ctx.translate(0.5, 0.5);

        ctx.strokeStyle = '#000000';
        ctx.fillStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'square';

        // Maze outline
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + space * maze[0].length, y);
        ctx.lineTo(x + space * maze[0].length, y + space * maze.length);
        ctx.lineTo(x, y + space * maze.length);
        ctx.lineTo(x, y);

        // Inner walls
        for (let r = 0; r < maze.length; r++) {
            for (let c = 0; c < maze.length; c++) {
                if (maze[r][c].indexOf('n') >= 0) {
                    ctx.moveTo(x + space * c, y + space * r);
                    ctx.lineTo(x + space * (c + 1), y + space * r);
                }
                if (maze[r][c].indexOf('s') >= 0) {
                    ctx.moveTo(x + space * c, y + space * (r + 1));
                    ctx.lineTo(x + space * (c + 1), y + space * (r + 1));
                }
                if (maze[r][c].indexOf('w') >= 0) {
                    ctx.moveTo(x + space * c, y + space * r);
                    ctx.lineTo(x + space * c, y + space * (r + 1));
                }
                if (maze[r][c].indexOf('e') >= 0) {
                    ctx.moveTo(x + space * (c + 1), y + space * r);
                    ctx.lineTo(x + space * (c + 1), y + space * (r + 1));
                }
            }
        }

        ctx.stroke();

        // Draw player location
        let playerX = x + (this.state.x + 0.5) * space;
        let playerY = y + (this.state.y + 0.5) * space;
        ctx.beginPath();
        ctx.moveTo(playerX, playerY);
        ctx.arc(playerX, playerY, 3, 0, Math.PI * 2);
        ctx.fill();

        // Light up player location
        this.DrawLight(shadowCtx, playerX, playerY, lightRadius, undefined, 0.5);

        // TODO: Light up clue locations
        // Initial clue
        let keyClueX = x + (keyClue[0] + 0.5) * space;
        let keyClueY = y + (keyClue[1] + 0.5) * space;
        this.DrawLight(shadowCtx, keyClueX, keyClueY, lightRadius, undefined, 1.0);

        if (this.state.game.keyCount < 4) {
            return;
        }

        let clue1X = x + (clue1[0] + 0.5) * space;
        let clue1Y = y + (clue1[1] + 0.5) * space;

        this.DrawLight(shadowCtx, clue1X, clue1Y, lightRadius, undefined, 1.0);

        if (!this.state.game.clue1Seen) {
            return;
        }

        let clue2X = x + (clue2[0] + 0.5) * space;
        let clue2Y = y + (clue2[1] + 0.5) * space;

        this.DrawLight(shadowCtx, clue2X, clue2Y, lightRadius, undefined, 1.0);

        if (!this.state.game.clue2Seen) {
            return;
        }

        let clue3X = x + (clue3[0] + 0.5) * space;
        let clue3Y = y + (clue3[1] + 0.5) * space;

        this.DrawLight(shadowCtx, clue3X, clue3Y, lightRadius, undefined, 1.0);

        if (!this.state.game.clue3Seen) {
            return;
        }

        let clue4X = x + (clue4[0] + 0.5) * space;
        let clue4Y = y + (clue4[1] + 0.5) * space;

        this.DrawLight(shadowCtx, clue4X, clue4Y, lightRadius, undefined, 1.0);
    }

    DrawLight(shadowCtx: CanvasRenderingContext2D, x: number, y: number, width: number, height?: number, intensity = 1.0) {
        shadowCtx.globalCompositeOperation = 'destination-out';

        let lightGradient: CanvasGradient;

        shadowCtx.resetTransform();
        shadowCtx.translate(x, y);

        lightGradient = shadowCtx.createRadialGradient(0, 0, 0, 0, 0, width * 2);
        
        lightGradient.addColorStop(0, 'rgba(0, 0, 0, 1.0)');
        lightGradient.addColorStop(0.5, 'rgba(0, 0, 0, 1.0)');
        lightGradient.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');

        if (height) {
            let scaleY = height / width;

            shadowCtx.transform(1, 0, 0, scaleY, 0, 0);
        }
         

        shadowCtx.fillStyle = lightGradient;

        shadowCtx.globalAlpha = intensity;

        shadowCtx.beginPath();
        shadowCtx.arc(0, 0, width * 2, 0, Math.PI * 2);
        shadowCtx.fill();

        shadowCtx.globalAlpha = 1.0;

        shadowCtx.resetTransform();
    }

    DrawClue1(ctx: CanvasRenderingContext2D, shadowCtx: CanvasRenderingContext2D, x, y) {
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#000000';
        ctx.font = '20px EB Garamond';

        ctx.textBaseline = 'top';

        ctx.globalAlpha = 0.9;
        
        ctx.fillText('On the third day of the third month of the third ', x, y);
        ctx.fillText('year of his reign, a great warlord had a vision.', x, y+30);
        
        ctx.globalAlpha = 1.0;
        
        this.DrawLight(shadowCtx, x + 240, y + 30, 200, 50);
    }

    DrawClue2(ctx: CanvasRenderingContext2D, shadowCtx: CanvasRenderingContext2D, x, y) {
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#000000';
        ctx.font = '20px EB Garamond';

        ctx.textBaseline = 'top';

        ctx.globalAlpha = 0.9;
        
        ctx.fillText('For a year and a day, he thought on what he had seen.', x, y);
        ctx.fillText('Then, he gathered his troops and marched forth,', x , y+30);
        ctx.fillText('promising his daughter he would conquer the many', x, y+60);
        ctx.fillText('worlds for her.', x, y + 90)
        
        ctx.globalAlpha = 1.0;
        
        this.DrawLight(shadowCtx, x + 240, y + 50, 200, 80);
    }

    DrawClue3(ctx: CanvasRenderingContext2D, shadowCtx: CanvasRenderingContext2D, x, y) {
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#000000';
        ctx.font = this.font.family;

        ctx.textBaseline = 'top';

        ctx.globalAlpha = 0.9;
        
        ctx.fillText('But only ten fortnights hence, the warlord died,', x, y);
        ctx.fillText('in a peaceful meadow outside a peaceful village,', x, y + 30);
        ctx.fillText('poisoned by a rare spider.', x, y + 60);
        
        ctx.globalAlpha = 1.0;
        
        this.DrawLight(shadowCtx, x + 240, y + 40, 200, 70);
    }

    DrawClue4(ctx: CanvasRenderingContext2D, shadowCtx: CanvasRenderingContext2D, x, y) {
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#000000';
        ctx.font = '20px EB Garamond';

        ctx.textBaseline = 'top';

        ctx.globalAlpha = 0.9;
        
        ctx.fillText('In her grief, the daughter swore to find the spider', x, y);
        ctx.fillText('and kill it. And for five years and fifty-five days,', x, y + 30);
        ctx.fillText('she scoured the meadow for spiderwebs.', x, y + 60)
        ctx.fillText('But when she found one, she found the goddess', x, y + 120)
        ctx.fillText('had been searching for her as well.', x, y + 150)
        
        ctx.globalAlpha = 1.0;
        
        this.DrawLight(shadowCtx, x + 240, y + 80, 200, 100);
    }

    DrawBoardPrompt(ctx: CanvasRenderingContext2D, shadowCtx: CanvasRenderingContext2D, x, y) {
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#000000';
        ctx.font = '20px EB Garamond';

        ctx.textBaseline = 'top';

        ctx.globalAlpha = 0.9;
        
        ctx.fillText('To unlock the door, you must activate all the runes at once.', x, y);
        ctx.fillText('Each rune affects the charge of those around it.', x, y + 30);
        ctx.fillText('Only one rune can be active with zero charge or less.', x, y + 60)
        
        ctx.globalAlpha = 1.0;
        
        this.DrawLight(shadowCtx, x + 260, y + 60, 220, 100);
    }
    
    DrawMazePrompt(ctx: CanvasRenderingContext2D, shadowCtx: CanvasRenderingContext2D, x, y) {
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#000000';
        ctx.font = '50px EB Garamond';

        ctx.textBaseline = 'top';

        ctx.globalAlpha = 0.9;
        
        ctx.fillText('You are in THE MAZE', x  + 20, y);
        ctx.fillText('You must find ', x, y + 100);
        ctx.strokeText('THE KEY', x + 330, y + 100)

        let keyPartsCanvas = document.getElementById('the-key') as HTMLCanvasElement;
        let keyPartsCtx = keyPartsCanvas.getContext('2d')!;

        this.DrawKeyParts(keyPartsCtx, this.state.game.keyCount);
        ctx.drawImage(keyPartsCanvas, x + 330, y + 100);

        ctx.globalAlpha = 1.0;
        
        this.DrawLight(shadowCtx, x + 240, y + 80, 200, 100);        
    }

    DrawKeyParts(keyPartsCtx: CanvasRenderingContext2D, count: number) {
        keyPartsCtx.font = '50px EB Garamond';
        keyPartsCtx.textBaseline = 'top';

        keyPartsCtx.globalCompositeOperation = 'source-over';
        keyPartsCtx.fillStyle = 'transparent';
        keyPartsCtx.fillRect(0, 0, 204, 40);

        keyPartsCtx.fillStyle = '#000000';
        
        count = Math.floor(Math.min(Math.max(1, count), 4));

        switch (count) {
            case 1:
                keyPartsCtx.fillRect(0, 0, 110, 20);
                break;
            case 2:
                keyPartsCtx.fillRect(0, 0, 110, 40);
                break;
            case 3:
                keyPartsCtx.fillRect(0, 0, 110, 40);
                keyPartsCtx.fillRect(110, 0, 110, 20);
                break;
            case 4:
                keyPartsCtx.fillRect(0, 0, 220, 40);
                break;
        }

        keyPartsCtx.globalCompositeOperation = 'source-in';
        keyPartsCtx.fillStyle = '#000000';
        keyPartsCtx.fillText('THE KEY', 0, 0);
    }

    OnKeyDown(event: KeyboardEvent) {
        let walls = maze[this.state.y][this.state.x];

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                if (this.state.y == 14 || walls.indexOf('s') >= 0) {
                    return;
                }
                this.setState({ y: this.state.y + 1 });
                break;
            case 'ArrowUp':
                event.preventDefault();
                if (this.state.y == 0 || walls.indexOf('n') >= 0) {
                    return;
                }
                this.setState({ y: this.state.y - 1 });
                break;
            case 'ArrowLeft':
                event.preventDefault();
                if (this.state.x == 0 || walls.indexOf('w') >= 0) {
                    return;
                }
                this.setState({ x: this.state.x - 1 });
                break;
            case 'ArrowRight':
                event.preventDefault();
                if (this.state.x == 14 || walls.indexOf('e') >= 0) {
                    return;
                }
                this.setState({ x: this.state.x + 1 });
                break;
        }
    }

    componentDidMount() {
        if (!this.props.viewOnly) {
            document.addEventListener("keydown", this.OnKeyDown);
        }
        
        this.font.load().then( () =>
        {
            document.fonts.add(this.font);
            let test = 0;
            test += 1;
            this.Draw;
        });
    }

    componentWillUnmount() {
        for (let i = this.props.service.updateFunctions.length; i >= 0; i--) {
            if (this.props.service.updateFunctions[i] == this.ReceiveUpdate) {
                this.props.service.updateFunctions.splice(i, 1);
            }
        }

        document.removeEventListener("keydown", this.OnKeyDown);
    }

    componentDidUpdate(prevProps: WallProps, prevState: WallState) {
        this.Draw();

        if (this.state.x != prevState.x || this.state.y != prevState.y) {
            // TODO: Update maze location
        }
    }

    render() {
        return <div className="wall-container">
            <canvas id="wall-canvas" width="2000" height="1800"></canvas>
            <div style={ { display: 'none' }}>
                <canvas id="wall-shadow-canvas" width="1800" height="2000"></canvas>
                <canvas id="the-key" width="220" height="40"></canvas>
                <img src="src/concrete.jpg" id="wall-background" onLoad={this.Draw}/>
            </div>
        </div>
    }
}