import * as React from 'react';
export class Wall extends React.Component {
    constructor(props) {
        super(props);
        this.font = new FontFace('EB Garamond', 'url(src/EBGaramondSC12-Regular.ttf');
        this.Draw = this.Draw.bind(this);
        this.DrawMazePrompt = this.DrawMazePrompt.bind(this);
        this.DrawClue1 = this.DrawClue1.bind(this);
        this.DrawClue2 = this.DrawClue2.bind(this);
        this.DrawClue3 = this.DrawClue3.bind(this);
        this.DrawClue4 = this.DrawClue4.bind(this);
        this.DrawBoardPrompt = this.DrawBoardPrompt.bind(this);
        this.ReceiveUpdate = this.ReceiveUpdate.bind(this);
        this.state =
            {
                game: {
                    keyCount: 1,
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
                }
            };
    }
    ReceiveUpdate(gameState) {
        this.setState({ game: gameState }, () => this.Draw());
    }
    Draw() {
        let canvas = document.getElementById('wall-canvas');
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#000000';
        let background = document.getElementById('wall-background');
        if (!background) {
            return;
        }
        if (this.font.status != 'loaded') {
            return;
        }
        let shadowCanvas = document.getElementById('wall-shadow-canvas');
        let shadowCtx = shadowCanvas.getContext('2d');
        shadowCtx.globalCompositeOperation = 'source-over';
        shadowCtx.fillStyle = '#000000';
        shadowCtx.fillRect(0, 0, shadowCanvas.width + 1, shadowCanvas.height + 1);
        ctx.drawImage(background, 0, 0);
        if (this.state.game.keyCount < 4) {
            this.DrawMazePrompt(ctx, shadowCtx, 300, 300);
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
        ctx.drawImage(shadowCanvas, 0, 0);
    }
    DrawLight(shadowCtx, x, y, width, height) {
        shadowCtx.globalCompositeOperation = 'destination-out';
        let lightGradient;
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
        shadowCtx.beginPath();
        shadowCtx.arc(0, 0, width * 2, 0, Math.PI * 2);
        shadowCtx.fill();
        shadowCtx.resetTransform();
    }
    DrawClue1(ctx, shadowCtx, x, y) {
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#000000';
        ctx.font = '20px EB Garamond';
        ctx.textBaseline = 'top';
        ctx.globalAlpha = 0.9;
        ctx.fillText('On the third day of the third month of the third ', x, y);
        ctx.fillText('year of his reign, a great warlord had a vision.', x, y + 30);
        ctx.globalAlpha = 1.0;
        this.DrawLight(shadowCtx, x + 240, y + 30, 200, 50);
    }
    DrawClue2(ctx, shadowCtx, x, y) {
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#000000';
        ctx.font = '20px EB Garamond';
        ctx.textBaseline = 'top';
        ctx.globalAlpha = 0.9;
        ctx.fillText('For a year and a day, he thought on what he had seen.', x, y);
        ctx.fillText('Then, he gathered his troops and marched forth,', x, y + 30);
        ctx.fillText('promising his daughter he would conquer the many', x, y + 60);
        ctx.fillText('worlds for her.', x, y + 90);
        ctx.globalAlpha = 1.0;
        this.DrawLight(shadowCtx, x + 240, y + 50, 200, 80);
    }
    DrawClue3(ctx, shadowCtx, x, y) {
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
    DrawClue4(ctx, shadowCtx, x, y) {
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#000000';
        ctx.font = '20px EB Garamond';
        ctx.textBaseline = 'top';
        ctx.globalAlpha = 0.9;
        ctx.fillText('In her grief, the daughter swore to find the spider', x, y);
        ctx.fillText('and kill it. And for five years and fifty-five days,', x, y + 30);
        ctx.fillText('she scoured the meadow for spiderwebs.', x, y + 60);
        ctx.fillText('But when she found one, she found the goddess', x, y + 120);
        ctx.fillText('had been searching for her as well.', x, y + 150);
        ctx.globalAlpha = 1.0;
        this.DrawLight(shadowCtx, x + 240, y + 80, 200, 100);
    }
    DrawBoardPrompt(ctx, shadowCtx, x, y) {
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#000000';
        ctx.font = '20px EB Garamond';
        ctx.textBaseline = 'top';
        ctx.globalAlpha = 0.9;
        ctx.fillText('To unlock the door, you must activate all the runes at once.', x, y);
        ctx.fillText('Each rune affects the charge of those around it.', x, y + 30);
        ctx.fillText('Only one rune can be active with zero charge or less.', x, y + 60);
        ctx.globalAlpha = 1.0;
        this.DrawLight(shadowCtx, x + 260, y + 60, 220, 100);
    }
    DrawMazePrompt(ctx, shadowCtx, x, y) {
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#000000';
        ctx.font = '50px EB Garamond';
        ctx.textBaseline = 'top';
        ctx.globalAlpha = 0.9;
        ctx.fillText('You are in THE MAZE', x + 20, y);
        ctx.fillText('You must find ', x, y + 100);
        ctx.strokeText('THE KEY', x + 330, y + 100);
        // TODO: Input active key parts count (minimum 1)
        let keyPartsCanvas = document.getElementById('the-key');
        let keyPartsCtx = keyPartsCanvas.getContext('2d');
        this.DrawKeyParts(keyPartsCtx, 3);
        ctx.drawImage(keyPartsCanvas, x + 330, y + 100);
        ctx.globalAlpha = 1.0;
        this.DrawLight(shadowCtx, x + 240, y + 80, 200, 100);
    }
    DrawKeyParts(keyPartsCtx, count) {
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
    componentDidMount() {
        this.font.load().then(() => {
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
    }
    componentDidUpdate() {
        this.Draw();
    }
    render() {
        return React.createElement("div", { className: "wall-container" },
            React.createElement("canvas", { id: "wall-canvas", width: "1000", height: "2000" }),
            React.createElement("div", { style: { display: 'none' } },
                React.createElement("canvas", { id: "wall-shadow-canvas", width: "1000", height: "2000" }),
                React.createElement("canvas", { id: "the-key", width: "220", height: "40" }),
                React.createElement("img", { src: "src/concrete.jpg", id: "wall-background", onLoad: this.Draw })));
    }
}
