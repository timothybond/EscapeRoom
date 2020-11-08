import * as React from 'react';
import { GameState } from './gameState';
import { Service } from './service';
import { saveAs } from "file-saver";

interface OverridesProps {
    service: Service;
}

interface OverridesState {
    game: GameState;
}

export class Overrides extends React.Component<OverridesProps, OverridesState> {
    constructor(props: OverridesProps) {
        super(props);

        this.NewGameState = this.NewGameState.bind(this);
        this.SaveState = this.SaveState.bind(this);
        this.LoadState = this.LoadState.bind(this);
        this.SelectFile = this.SelectFile.bind(this);
        this.OnFileLoad = this.OnFileLoad.bind(this);
        this.Reset = this.Reset.bind(this);

        this.OnSetKeyCount = this.OnSetKeyCount.bind(this);
        this.OnSetClue1Seen = this.OnSetClue1Seen.bind(this);
        this.OnSetClue2Seen = this.OnSetClue2Seen.bind(this);
        this.OnSetClue3Seen = this.OnSetClue3Seen.bind(this);
        this.OnSetClue4Seen = this.OnSetClue4Seen.bind(this);
        this.OnSetUse4Board = this.OnSetUse4Board.bind(this);
        this.OnSetSolved3Board = this.OnSetSolved3Board.bind(this);
        this.OnSetSolved4Board = this.OnSetSolved4Board.bind(this);
        this.OnSetFinished = this.OnSetFinished.bind(this);

        this.state = { game: this.NewGameState() };
    }

    NewGameState(): GameState {
        return {
            keyCount: 1,
            mazeX: 0,
            mazeY: 0,
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
            activeRunes: [[false, false, false], [false, false, false], [false, false, false]],
            runeCharges: [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
        };
    }

    ReceiveUpdate(gameState: GameState) {
        this.state = { game: gameState };
    }

    OnSetKeyCount(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.service.updateGameState({ keyCount: event.target.valueAsNumber });
    }

    OnSetClue1Seen(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.service.updateGameState({ clue1Seen: event.target.checked });
    }

    OnSetClue2Seen(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.service.updateGameState({ clue2Seen: event.target.checked });
    }

    OnSetClue3Seen(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.service.updateGameState({ clue3Seen: event.target.checked });
    }

    OnSetClue4Seen(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.service.updateGameState({ clue4Seen: event.target.checked });
    }

    OnSetUse4Board(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.service.updateGameState({ use4Board: event.target.checked });
    }

    OnSetSolved3Board(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.service.updateGameState({ solved3Board: event.target.checked });
    }

    OnSetSolved4Board(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.service.updateGameState({ solved4Board: event.target.checked });
    }

    OnSetFinished(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.service.updateGameState({ finished: event.target.checked });
    }

    SaveState() {
        let saveData = JSON.stringify(this.state.game);
        let blob = new Blob([saveData], { type: "application/json;charset=utf-8" });
        saveAs(blob, "gameState.json");
    }

    LoadState() {
        let fileInput = document.getElementById('loadFileInput') as HTMLInputElement;

        if (fileInput.files!.length > 0) {
            let reader = new FileReader();
            reader.onload = this.OnFileLoad;

            let file = fileInput.files![0];
            reader.readAsText(file);
        }
    }

    Reset() {
        this.props.service.updateGameState(this.NewGameState());
    }

    SelectFile() {
        document.getElementById('loadFileInput')?.click();
    }

    OnFileLoad(event: ProgressEvent<FileReader>) {
        let contents = event.target?.result as string;
        let gameState = JSON.parse(contents) as GameState;
        gameState.loaded = true;

        // Allows us to load the same file multiple times in a row
        let fileInput = document.getElementById('loadFileInput') as HTMLInputElement;
        fileInput.value = "";

        this.props.service.updateGameState(gameState);
    }

    render() {
        return <div className="overrides-container">
            <div>
                <div>
                    <button id="save-button" onClick={this.SaveState}>Save</button>
                    <button id="save-button" onClick={this.LoadState}>Load</button>
                </div>
            </div>
            <div>
                <div>
                    <label htmlFor="keyCount">Key Count: </label><input type="number" id="keyCount" value={this.state.game.keyCount} onChange={this.OnSetKeyCount} />
                </div>
            </div>
            <div className="overrides-flex-container">
                <div>
                    <div>
                        <input type="checkbox" id="clue1Seen" checked={this.state.game.clue1Seen} onChange={this.OnSetClue1Seen} /><label htmlFor="clue1Seen">Clue 1 Seen</label>
                    </div>
                    <div>
                        <input type="checkbox" id="clue2Seen" checked={this.state.game.clue2Seen} onChange={this.OnSetClue2Seen} /><label htmlFor="clue2Seen">Clue 2 Seen</label>
                    </div>
                    <div>
                        <input type="checkbox" id="clue3Seen" checked={this.state.game.clue3Seen} onChange={this.OnSetClue3Seen} /><label htmlFor="clue3Seen">Clue 3 Seen</label>
                    </div>
                    <div>
                        <input type="checkbox" id="clue4Seen" checked={this.state.game.clue4Seen} onChange={this.OnSetClue4Seen} /><label htmlFor="clue4Seen">Clue 4 Seen</label>
                    </div>
                </div>
                <div>
                    <div>
                        <input type="checkbox" id="use4Board" checked={this.state.game.clue1Seen} onChange={this.OnSetUse4Board} /><label htmlFor="use4Board">Use 4x4 Board</label>
                    </div>
                    <div>
                        <input type="checkbox" id="solved3Board" checked={this.state.game.solved3Board} onChange={this.OnSetSolved3Board} /><label htmlFor="solved3Board">Solved 3x3 Board</label>
                    </div>
                    <div>
                        <input type="checkbox" id="solved4Board" checked={this.state.game.solved4Board} onChange={this.OnSetSolved4Board} /><label htmlFor="solved4Board">Solved 4x4 Board</label>
                    </div>
                    <div>
                        <input type="checkbox" id="finished" onChange={this.OnSetFinished} /><label htmlFor="finished">Finished</label>
                    </div>
                    </div>
            </div>
        </div>;
    }
}