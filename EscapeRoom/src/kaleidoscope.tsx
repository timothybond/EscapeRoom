import * as React from 'react';
import { GameState } from './gameState';
import { Service } from './service';

interface KaleidoscopeProps {
    service: Service;
    viewOnly: boolean;
}

interface KaleidoscopeState {
    xOffset: number,
    yOffset: number,
    rotation: number
}

export class Kaleidoscope extends React.Component<KaleidoscopeProps, KaleidoscopeState> {
    side: number;
    height: number;
    maxOffset: number;
    minOffset: number;
    maxSpace: number;
    preparedBackgrounds: boolean;

    backgrounds: HTMLCanvasElement[];

    interval: number;

    scrollRight: boolean;
    scrollLeft: boolean;
    scrollUp: boolean;
    scrollDown: boolean;
    rotateClockwise: boolean;
    rotateCounterClockwise: boolean;

    admin: boolean = false;

    constructor(props: KaleidoscopeProps) {
        super(props);

        this.preparedBackgrounds = false;

        this.side = 100.0;
        this.height = this.side * Math.sin(Math.PI / 3.0);

        // Furthest the triangle gets from its center
        this.maxOffset = this.height - this.side * Math.tan(Math.PI / 6.0) / 2.0;
        this.minOffset = this.height - this.maxOffset;
        this.maxSpace = this.maxOffset - this.minOffset;

        this.OnSetXOffset = this.OnSetXOffset.bind(this);
        this.OnSetYOffset = this.OnSetYOffset.bind(this);
        this.OnSetRotation = this.OnSetRotation.bind(this);
        this.OnKeyDown = this.OnKeyDown.bind(this);
        this.OnKeyUp = this.OnKeyUp.bind(this);
        this.Tick = this.Tick.bind(this);

        this.Draw = this.Draw.bind(this);

        this.XToNumber = this.XToNumber.bind(this);
        this.YToNumber = this.YToNumber.bind(this);
        this.RToNumber = this.RToNumber.bind(this);
        this.NumberToX = this.NumberToX.bind(this);
        this.NumberToY = this.NumberToY.bind(this);
        this.NumberToR = this.NumberToR.bind(this);

        this.ReceiveUpdate = this.ReceiveUpdate.bind(this);

        this.state = { xOffset: 0, yOffset: 0, rotation: 0 };
    }

    XToNumber(x: number) : number {
        return x / 30 + 1;
    }

    NumberToX(dial: number): number {
        return (dial - 1) * 30;
    }

    YToNumber(y: number): number {
        return y / 30 + 1;
    }

    NumberToY(dial: number): number {
        return (dial - 1) * 30;
    }

    RToNumber(r: number): number {
        return r * 0.075 + 1;
    }

    NumberToR(dial: number): number {
        return (dial - 1) / 0.075;
    }

    ReceiveUpdate(gameState: GameState) {
        if (gameState.loaded || this.props.viewOnly) {
            this.setState({
                xOffset: gameState.kaleidoscopeGear1,
                yOffset: gameState.kaleidoscopeGear2,
                rotation: gameState.kaleidoscopeGear3
            },
            () => this.Draw());
        }
    }

    Draw(forcePrepareImage = false) {
        let canvas = document.getElementById("main-canvas") as HTMLCanvasElement;
        let ctx = canvas.getContext('2d')!;
        ctx.resetTransform();
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width + 1, canvas.height + 1);
        ctx.translate(0.5, 0.5);

        let glassCanvas = document.getElementById("glass") as HTMLCanvasElement;
        glassCanvas.width = this.maxOffset * 2 + 1;
        glassCanvas.height = this.maxOffset * 2 + 1;

        ctx.globalCompositeOperation = "source-over";

        this.PrepareBackgrounds(forcePrepareImage);

        let glassCtx = glassCanvas!.getContext('2d')!;

        for (let i = 0; i < 150; i++) {
            this.DrawTriangleFromOffsets(glassCtx, i);
            this.DrawFromTriangle(glassCanvas, ctx, i);
        }

        ctx.strokeStyle = '#0000cc';
        ctx.fillStyle = "#ffffff";
        ctx.lineCap = "square";
        ctx.lineWidth = 0.5;
        ctx.setLineDash([]);

        let centerX = 350.0;
        let centerY = 350.0;

        let radius = 300;

        // Outer ring
        
        ctx.resetTransform();

        ctx.globalCompositeOperation = "destination-in";
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2.0 * Math.PI);
        ctx.fill();

        // Draw kaleidoscope and numeric indicators
        this.DrawScope(ctx);
    }

    DrawScope(ctx: CanvasRenderingContext2D) {
        let scopeImg = document.getElementById('scope') as HTMLImageElement;

        if (!scopeImg) {
            return;
        }

        let scopeCanvas = document.getElementById('scope-canvas') as HTMLCanvasElement;
        let scopeCtx = scopeCanvas.getContext('2d')!;


        scopeCtx.resetTransform();
        scopeCtx.globalCompositeOperation = 'source-over';

        scopeCtx.fillStyle = 'transparent';
        scopeCtx.fillRect(0, 0, scopeCanvas.width, scopeCanvas.height);

        scopeCtx.translate(172, 127);
        scopeCtx.transform(1, 0, 0, 2, 0, 0);

        let mainShadowGrad = scopeCtx.createRadialGradient(0, 0, 0, 0, 0, 200);
        mainShadowGrad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0');
        mainShadowGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1.0');
        mainShadowGrad.addColorStop(0.8, 'rgba(255, 255, 255, 0.0');

        scopeCtx.fillStyle = mainShadowGrad;

        scopeCtx.beginPath();
        scopeCtx.moveTo(0, 0);
        scopeCtx.arc(0, 0, 200, 0, Math.PI * 2);
        scopeCtx.fill();

        scopeCtx.resetTransform();
        scopeCtx.globalCompositeOperation = 'source-in';

        scopeCtx.drawImage(scopeImg, 0, 0);

        // scopeCtx.globalCompositeOperation = 'source-over';

        // scopeCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        // scopeCtx.fillRect(70, 80, 200, 100);

        scopeCtx.globalCompositeOperation = 'destination-over';

        // TODO: Calculate values to correspond to x, y, rotation
        let xDial = this.XToNumber(this.state.xOffset);
        let yDial = this.YToNumber(this.state.yOffset);
        let rotDial = this.RToNumber(this.state.rotation);
        this.DrawDial(scopeCtx, 77, 80, yDial);
        this.DrawDial(scopeCtx, 148, 80, xDial);
        this.DrawDial(scopeCtx, 219, 80, rotDial);

        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(scopeCanvas, 800, 230);
    }

    DrawDial(scopeCtx: CanvasRenderingContext2D, x: number, y: number, value: number) {
        const numberScrollOffset = 58.2;
        const initialScroll = 10; // Enough to center '1'

        let dialImg = document.getElementById('dial') as HTMLImageElement;

        value = Math.max(value, 1.0);

        let totalScroll = (value - 1) * numberScrollOffset + initialScroll;

        if (!dialImg) {
            return;
        }

        scopeCtx.drawImage(dialImg, 0, totalScroll, 50, 100, x, y, 50, 100);
    }

    PrepareBackgrounds(forcePrepareImage = false) {
        if (this.preparedBackgrounds && !forcePrepareImage) {
            return;
        }

        let image = document.getElementById('colored-glass') as HTMLImageElement;

        if (image) {
            this.backgrounds = [];

            for (let i = 0; i < 150; i++) {
                let canvas = document.getElementById(`glass${i}`) as HTMLCanvasElement;
                let ctx = canvas.getContext('2d')!;
                ctx.resetTransform();
                ctx.translate(0.5, 0.5);
                ctx.drawImage(image, 0, 0);

                this.backgrounds.push(canvas);
            }

            let bgGlassCanvas = document.getElementById('bg-glass') as HTMLCanvasElement;
            bgGlassCanvas.width = this.maxOffset * 2 + 1;
            bgGlassCanvas.height = this.maxOffset * 2 + 1;
            let bgGlassCtx = bgGlassCanvas.getContext('2d')!;

            // Add 'solution' triangles to original images
            let galaxy = document.getElementById('galaxy') as HTMLImageElement;

            this.AddSolution(3, 3, 3, bgGlassCanvas, bgGlassCtx, galaxy);

            this.preparedBackgrounds = true;
        }
    }

    AddSolution(xDial: number, yDial: number, rotDial: number, bgGlassCanvas: HTMLCanvasElement, bgGlassCtx: CanvasRenderingContext2D, image: CanvasImageSource) {
        for (let i = 0; i < 150; i++) {
            this.DrawSourceTriangle(bgGlassCtx, true);

            let hexIndex = i % 6;
            let hexRow = Math.floor(i / 6) % 5;
            let hexColumn = Math.floor(i / 30);

            // These offsets are based purely on the hex indices
            let offsetX = 350 + (hexColumn-2)*this.side*1.5;
            let offsetY = 350 + (hexRow - 2) * this.height * 2 + (((hexColumn % 2) == 1) ? this.height : 0.0);

            // To account for this, first we need to rotate this triangle relative to the center of the hex,
            // which in the draw logic means rotating it relative to the bottom point
            bgGlassCtx.translate(this.maxOffset, this.maxOffset * 2);

            let rotation = hexIndex * Math.PI / 3;
            let flip: boolean = i % 2 == 0;

            bgGlassCtx.rotate(rotation * (flip ? 1 : -1));
            if (flip) {
               bgGlassCtx.transform(-1, 0, 0, 1, 0, 0);
            }

            bgGlassCtx.translate(-1 * this.maxOffset, -2 * this.maxOffset);

            
            bgGlassCtx.globalCompositeOperation = 'source-in';

            bgGlassCtx.translate(-1 * offsetX, -1 * offsetY);
            
            bgGlassCtx.drawImage(image, this.maxOffset, 2 * this.maxOffset);

            bgGlassCtx.resetTransform();
            
            // Also, odd-number columns are shifted up by one triangle height
            let bgCtx = this.backgrounds[i].getContext('2d')!;

            // Also fade out the background around this triangle for a more gradual input
            // TODO: Consider adding overlapping/faded version of solution

            let xVal = this.NumberToX(xDial);
            let yVal = this.NumberToY(yDial);
            let rVal = this.NumberToR(rotDial);

            bgCtx.translate(xVal + this.maxOffset, yVal + this.maxOffset);
            bgCtx.rotate(-1 * rVal);
            bgCtx.translate(-1 * (xVal + this.maxOffset), -1 * (yVal + this.maxOffset));

            // This has to be the solution coordinates
            bgCtx.drawImage(bgGlassCanvas, xVal, yVal);
        }
    }

    DrawFromTriangle(triangleCanvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, index: number) {
        let hexIndex = index % 6;
        let hexRow = Math.floor(index / 6) % 5;
        let hexColumn = Math.floor(index / 30);

        // The 2-index column/row is the center hex.
        ctx.resetTransform();

        // For drawing within a given hex, we change its center to be (0, 0)
        let xOffset = 350 + (hexColumn-2)*this.side*1.5;
        let yOffset = 350 + (hexRow - 2) * this.height * 2 + (((hexColumn % 2) == 1) ? this.height : 0.0);
        ctx.translate(xOffset, yOffset);
        
        // Next, we align ourselves for one of the six triangles in the hex
        ctx.rotate(hexIndex * Math.PI / 3);
        if (hexIndex % 2 == 0) {
            ctx.transform(-1, 0, 0, 1, 0, 0);
        }

        // Finally, we need to align the triangle.
        // The 'neutral' position is the top one pointing downward.
        // The above logic would draw the box with the triangle starting
        // at what should be the bottom point of the triangle.
        // To fix this we need to move back vertically the box length,
        // and horizontally by half of it.
        ctx.drawImage(triangleCanvas, -1 * this.maxOffset, -2 * this.maxOffset);
    }

    DrawSourceTriangle(ctx: CanvasRenderingContext2D, faded = false) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, this.maxOffset * 2, this.maxOffset * 2);

        let glassX = this.maxOffset - this.side / 2.0;
        let glassY = this.maxSpace;

        if (faded) {
            let gradient = ctx.createRadialGradient(this.maxOffset, this.maxOffset, 0, this.maxOffset, this.maxOffset, this.maxOffset);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0');
            //gradient.addColorStop(0.5, 'rgba(255, 255, 255, 1.0');
            gradient.addColorStop(1.0, 'rgba(255, 255, 255, 0.0');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(this.maxOffset, this.maxOffset);
            ctx.arc(this.maxOffset, this.maxOffset, this.maxOffset, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(glassX - 0.5, glassY - 0.5);
        ctx.lineTo(glassX + this.side + 0.5, glassY - 0.5);
        ctx.lineTo(glassX + 0.5 + this.side / 2, glassY + this.height + 0.5);
        ctx.lineTo(glassX - 0.5, glassY - 0.5);
        ctx.fill();
    }

    DrawTriangleFromOffsets(glassCtx: CanvasRenderingContext2D, index: number) {
        glassCtx.resetTransform();
        glassCtx.translate(0.5, 0.5);

        if (index == 0) {
            this.DrawSourceTriangle(glassCtx);
        }

        glassCtx.globalCompositeOperation = 'source-in';
        let glassImage = this.backgrounds[index];

        // Need to apply rotation here, but it should be at the "center" of the triangle,
        // which is actually (maxOffset, maxOffset)
        glassCtx.translate(this.maxOffset, this.maxOffset);
        glassCtx.rotate(Math.PI * 2 * this.state.rotation / 100);
        glassCtx.translate(-1 * this.maxOffset, -1 * this.maxOffset);
        glassCtx.drawImage(glassImage, -1 * this.state.xOffset, -1 * this.state.yOffset);
    }

    OnSetXOffset(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ xOffset: parseInt(event.target.value) });
    }

    OnSetYOffset(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ yOffset: parseInt(event.target.value) });
    }

    OnSetRotation(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ rotation: parseInt(event.target.value) });
    }

    OnKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case "z":
                this.scrollDown = true;
                break;
            case "a":
                this.scrollUp = true;
                break;
            case "s":
                this.scrollLeft = true;
                break;
            case "x":
                this.scrollRight = true;
                break;
            case "d":
                this.rotateClockwise = true;
                break;
            case "c":
                this.rotateCounterClockwise = true;
                break;
        }
    }

    OnKeyUp(event: KeyboardEvent) {
        switch (event.key) {
            case "z":
                this.scrollDown = false;
                break;
            case "a":
                this.scrollUp = false;
                break;
            case "s":
                this.scrollLeft = false;
                break;
            case "x":
                this.scrollRight = false;
                break;
            case "d":
                this.rotateClockwise = false;
                break;
            case "c":
                this.rotateCounterClockwise = false;
                break;
        }
    }

    Tick() {
        // TODO: Add min/max offsets based on image height/width
        if (this.scrollRight && !this.scrollLeft) {
            this.setState({ xOffset: Math.min(this.state.xOffset + 1, 1000) });
        } else if (this.scrollLeft && !this.scrollRight) {
            this.setState({ xOffset: Math.max(this.state.xOffset - 1, 0) });
        }

        if (this.scrollUp && !this.scrollDown) {
            this.setState({ yOffset: Math.max(this.state.yOffset - 1, 0) });
        } else if (this.scrollDown && !this.scrollUp) {
            this.setState({ yOffset: Math.min(this.state.yOffset + 1, 1000) });
        }

        if (this.rotateClockwise && !this.rotateCounterClockwise) {
            this.setState({ rotation: Math.max(this.state.rotation - 1, 0) });
        } else if (this.rotateCounterClockwise && !this.rotateClockwise) {
            this.setState({ rotation: Math.min(this.state.rotation + 1, 400) });
        }
    }

    componentDidMount() {
        if (!this.props.viewOnly) {
            document.addEventListener("keydown", this.OnKeyDown);
            document.addEventListener("keyup", this.OnKeyUp);
        }

        this.interval = window.setInterval(this.Tick, 5);

        this.Draw();
    }

    componentDidUpdate(prevProps: KaleidoscopeProps, prevState: KaleidoscopeState) {
        // TODO: Set when clues are seen (or close enough)

        if ((this.state.xOffset != prevState.xOffset ||
            this.state.yOffset != prevState.yOffset ||
            this.state.rotation != prevState.rotation) &&
            !this.props.viewOnly) {
            this.props.service.updateGameState({
                kaleidoscopeGear1: this.state.xOffset,
                kaleidoscopeGear2: this.state.yOffset,
                kaleidoscopeGear3: this.state.rotation
            });
        }

        this.Draw();
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.OnKeyDown);
        document.removeEventListener("keyup", this.OnKeyUp);

        window.clearInterval(this.interval);

        for (let i = this.props.service.updateFunctions.length; i >= 0; i--) {
            if (this.props.service.updateFunctions[i] == this.ReceiveUpdate) {
                this.props.service.updateFunctions.splice(i, 1);
            }
        }
    }

    render() {
        // Note the double-call to "Draw" on image load gets rid of some aliasing artifacts that I haven't been able to pin down yet.
        return <div className="kaleidoscope-container">
            <canvas id="main-canvas" width="1200" height="700"></canvas>
            <div style={{ display: 'none' }}>
                <canvas id="scope-canvas" width="344" height="257"></canvas>
                <img id="scope" src="src/scope.png" onLoad={() => this.Draw()} />
                <img id="dial" src="src/dial.png" onLoad={() => this.Draw()} />
            </div>
            <div style={ { display:  this.admin ? "inline" : "none" } }>
                <canvas id="triangle0" width="200" height="200"></canvas>
                <canvas id="glass" width="200" height="200"></canvas>
                <canvas id="bg-glass" width="200" height="200"></canvas>
            </div>
            <div style={{ display: this.admin ? "inline" : "none" } }>
                <div>
                    <label htmlFor="x-offset">X: </label>
                    <input type="number" id="x-offset" readOnly value={this.state.xOffset}/>
                </div>
                <div>
                    <label htmlFor="y-offset">Y: </label>
                    <input type="number" id="y-offset" readOnly value={this.state.yOffset}/>
                </div>
                <div>
                    <label htmlFor="rotation">Y: </label>
                    <input type="number" id="rotation" readOnly value={this.state.rotation}/>
                </div>
            </div>
            <div style={{ display: this.admin ? "inline" : "none" } }>
                <img id="colored-glass" src="src/fractal.png" onLoad={() => { this.Draw(true); this.Draw(); } } style={{ width: 500, height: 370 }}/>
                <img id="galaxy" src="src/galaxy.png" onLoad={() => { this.Draw(true); } } style={{ width: 700, height: 700 }}/>
                <canvas id="glass0" width="2000" height="1481"/>
                <canvas id="glass1" width="2000" height="1481"/>
                <canvas id="glass2" width="2000" height="1481"/>
                <canvas id="glass3" width="2000" height="1481"/>
                <canvas id="glass4" width="2000" height="1481"/>
                <canvas id="glass5" width="2000" height="1481"/>
                <canvas id="glass6" width="2000" height="1481"/>
                <canvas id="glass7" width="2000" height="1481"/>
                <canvas id="glass8" width="2000" height="1481"/>
                <canvas id="glass9" width="2000" height="1481"/>
                <canvas id="glass10" width="2000" height="1481"/>
                <canvas id="glass11" width="2000" height="1481"/>
                <canvas id="glass12" width="2000" height="1481"/>
                <canvas id="glass13" width="2000" height="1481"/>
                <canvas id="glass14" width="2000" height="1481"/>
                <canvas id="glass15" width="2000" height="1481"/>
                <canvas id="glass16" width="2000" height="1481"/>
                <canvas id="glass17" width="2000" height="1481"/>
                <canvas id="glass18" width="2000" height="1481"/>
                <canvas id="glass19" width="2000" height="1481"/>
                <canvas id="glass20" width="2000" height="1481"/>
                <canvas id="glass21" width="2000" height="1481"/>
                <canvas id="glass22" width="2000" height="1481"/>
                <canvas id="glass23" width="2000" height="1481"/>
                <canvas id="glass24" width="2000" height="1481"/>
                <canvas id="glass25" width="2000" height="1481"/>
                <canvas id="glass26" width="2000" height="1481"/>
                <canvas id="glass27" width="2000" height="1481"/>
                <canvas id="glass28" width="2000" height="1481"/>
                <canvas id="glass29" width="2000" height="1481"/>
                <canvas id="glass30" width="2000" height="1481"/>
                <canvas id="glass31" width="2000" height="1481"/>
                <canvas id="glass32" width="2000" height="1481"/>
                <canvas id="glass33" width="2000" height="1481"/>
                <canvas id="glass34" width="2000" height="1481"/>
                <canvas id="glass35" width="2000" height="1481"/>
                <canvas id="glass36" width="2000" height="1481"/>
                <canvas id="glass37" width="2000" height="1481"/>
                <canvas id="glass38" width="2000" height="1481"/>
                <canvas id="glass39" width="2000" height="1481"/>
                <canvas id="glass40" width="2000" height="1481"/>
                <canvas id="glass41" width="2000" height="1481"/>
                <canvas id="glass42" width="2000" height="1481"/>
                <canvas id="glass43" width="2000" height="1481"/>
                <canvas id="glass44" width="2000" height="1481"/>
                <canvas id="glass45" width="2000" height="1481"/>
                <canvas id="glass46" width="2000" height="1481"/>
                <canvas id="glass47" width="2000" height="1481"/>
                <canvas id="glass48" width="2000" height="1481"/>
                <canvas id="glass49" width="2000" height="1481"/>
                <canvas id="glass50" width="2000" height="1481"/>
                <canvas id="glass51" width="2000" height="1481"/>
                <canvas id="glass52" width="2000" height="1481"/>
                <canvas id="glass53" width="2000" height="1481"/>
                <canvas id="glass54" width="2000" height="1481"/>
                <canvas id="glass55" width="2000" height="1481"/>
                <canvas id="glass56" width="2000" height="1481"/>
                <canvas id="glass57" width="2000" height="1481"/>
                <canvas id="glass58" width="2000" height="1481"/>
                <canvas id="glass59" width="2000" height="1481"/>
                <canvas id="glass60" width="2000" height="1481"/>
                <canvas id="glass61" width="2000" height="1481"/>
                <canvas id="glass62" width="2000" height="1481"/>
                <canvas id="glass63" width="2000" height="1481"/>
                <canvas id="glass64" width="2000" height="1481"/>
                <canvas id="glass65" width="2000" height="1481"/>
                <canvas id="glass66" width="2000" height="1481"/>
                <canvas id="glass67" width="2000" height="1481"/>
                <canvas id="glass68" width="2000" height="1481"/>
                <canvas id="glass69" width="2000" height="1481"/>
                <canvas id="glass70" width="2000" height="1481"/>
                <canvas id="glass71" width="2000" height="1481"/>
                <canvas id="glass72" width="2000" height="1481"/>
                <canvas id="glass73" width="2000" height="1481"/>
                <canvas id="glass74" width="2000" height="1481"/>
                <canvas id="glass75" width="2000" height="1481"/>
                <canvas id="glass76" width="2000" height="1481"/>
                <canvas id="glass77" width="2000" height="1481"/>
                <canvas id="glass78" width="2000" height="1481"/>
                <canvas id="glass79" width="2000" height="1481"/>
                <canvas id="glass80" width="2000" height="1481"/>
                <canvas id="glass81" width="2000" height="1481"/>
                <canvas id="glass82" width="2000" height="1481"/>
                <canvas id="glass83" width="2000" height="1481"/>
                <canvas id="glass84" width="2000" height="1481"/>
                <canvas id="glass85" width="2000" height="1481"/>
                <canvas id="glass86" width="2000" height="1481"/>
                <canvas id="glass87" width="2000" height="1481"/>
                <canvas id="glass88" width="2000" height="1481"/>
                <canvas id="glass89" width="2000" height="1481"/>
                <canvas id="glass90" width="2000" height="1481"/>
                <canvas id="glass91" width="2000" height="1481"/>
                <canvas id="glass92" width="2000" height="1481"/>
                <canvas id="glass93" width="2000" height="1481"/>
                <canvas id="glass94" width="2000" height="1481"/>
                <canvas id="glass95" width="2000" height="1481"/>
                <canvas id="glass96" width="2000" height="1481"/>
                <canvas id="glass97" width="2000" height="1481"/>
                <canvas id="glass98" width="2000" height="1481"/>
                <canvas id="glass99" width="2000" height="1481"/>
                <canvas id="glass100" width="2000" height="1481"/>
                <canvas id="glass101" width="2000" height="1481"/>
                <canvas id="glass102" width="2000" height="1481"/>
                <canvas id="glass103" width="2000" height="1481"/>
                <canvas id="glass104" width="2000" height="1481"/>
                <canvas id="glass105" width="2000" height="1481"/>
                <canvas id="glass106" width="2000" height="1481"/>
                <canvas id="glass107" width="2000" height="1481"/>
                <canvas id="glass108" width="2000" height="1481"/>
                <canvas id="glass109" width="2000" height="1481"/>
                <canvas id="glass110" width="2000" height="1481"/>
                <canvas id="glass111" width="2000" height="1481"/>
                <canvas id="glass112" width="2000" height="1481"/>
                <canvas id="glass113" width="2000" height="1481"/>
                <canvas id="glass114" width="2000" height="1481"/>
                <canvas id="glass115" width="2000" height="1481"/>
                <canvas id="glass116" width="2000" height="1481"/>
                <canvas id="glass117" width="2000" height="1481"/>
                <canvas id="glass118" width="2000" height="1481"/>
                <canvas id="glass119" width="2000" height="1481"/>
                <canvas id="glass120" width="2000" height="1481"/>
                <canvas id="glass121" width="2000" height="1481"/>
                <canvas id="glass122" width="2000" height="1481"/>
                <canvas id="glass123" width="2000" height="1481"/>
                <canvas id="glass124" width="2000" height="1481"/>
                <canvas id="glass125" width="2000" height="1481"/>
                <canvas id="glass126" width="2000" height="1481"/>
                <canvas id="glass127" width="2000" height="1481"/>
                <canvas id="glass128" width="2000" height="1481"/>
                <canvas id="glass129" width="2000" height="1481"/>
                <canvas id="glass130" width="2000" height="1481"/>
                <canvas id="glass131" width="2000" height="1481"/>
                <canvas id="glass132" width="2000" height="1481"/>
                <canvas id="glass133" width="2000" height="1481"/>
                <canvas id="glass134" width="2000" height="1481"/>
                <canvas id="glass135" width="2000" height="1481"/>
                <canvas id="glass136" width="2000" height="1481"/>
                <canvas id="glass137" width="2000" height="1481"/>
                <canvas id="glass138" width="2000" height="1481"/>
                <canvas id="glass139" width="2000" height="1481"/>
                <canvas id="glass140" width="2000" height="1481"/>
                <canvas id="glass141" width="2000" height="1481"/>
                <canvas id="glass142" width="2000" height="1481"/>
                <canvas id="glass143" width="2000" height="1481"/>
                <canvas id="glass144" width="2000" height="1481"/>
                <canvas id="glass145" width="2000" height="1481"/>
                <canvas id="glass146" width="2000" height="1481"/>
                <canvas id="glass147" width="2000" height="1481"/>
                <canvas id="glass148" width="2000" height="1481"/>
                <canvas id="glass149" width="2000" height="1481"/>
            </div>
        </div>;
    }
}