import * as React from 'react';
import { saveAs } from "file-saver";
export class Overrides extends React.Component {
    constructor(props) {
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
    NewGameState() {
        return {
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
            activeRunes: [[false, false, false], [false, false, false], [false, false, false]],
            runeCharges: [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
        };
    }
    ReceiveUpdate(gameState) {
        this.state = { game: gameState };
    }
    OnSetKeyCount(event) {
        this.props.service.updateGameState({ keyCount: event.target.valueAsNumber });
    }
    OnSetClue1Seen(event) {
        this.props.service.updateGameState({ clue1Seen: event.target.checked });
    }
    OnSetClue2Seen(event) {
        this.props.service.updateGameState({ clue2Seen: event.target.checked });
    }
    OnSetClue3Seen(event) {
        this.props.service.updateGameState({ clue3Seen: event.target.checked });
    }
    OnSetClue4Seen(event) {
        this.props.service.updateGameState({ clue4Seen: event.target.checked });
    }
    OnSetUse4Board(event) {
        this.props.service.updateGameState({ use4Board: event.target.checked });
    }
    OnSetSolved3Board(event) {
        this.props.service.updateGameState({ solved3Board: event.target.checked });
    }
    OnSetSolved4Board(event) {
        this.props.service.updateGameState({ solved4Board: event.target.checked });
    }
    OnSetFinished(event) {
        this.props.service.updateGameState({ finished: event.target.checked });
    }
    SaveState() {
        let saveData = JSON.stringify(this.state.game);
        let blob = new Blob([saveData], { type: "application/json;charset=utf-8" });
        saveAs(blob, "gameState.json");
    }
    LoadState() {
        let fileInput = document.getElementById('loadFileInput');
        if (fileInput.files.length > 0) {
            let reader = new FileReader();
            reader.onload = this.OnFileLoad;
            let file = fileInput.files[0];
            reader.readAsText(file);
        }
    }
    Reset() {
        this.props.service.updateGameState(this.NewGameState());
    }
    SelectFile() {
        var _a;
        (_a = document.getElementById('loadFileInput')) === null || _a === void 0 ? void 0 : _a.click();
    }
    OnFileLoad(event) {
        var _a;
        let contents = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
        let gameState = JSON.parse(contents);
        gameState.loaded = true;
        // Allows us to load the same file multiple times in a row
        let fileInput = document.getElementById('loadFileInput');
        fileInput.value = "";
        this.props.service.updateGameState(gameState);
    }
    render() {
        return React.createElement("div", { className: "overrides-container" },
            React.createElement("div", null,
                React.createElement("button", { id: "save-button", onClick: this.SaveState }, "Save"),
                React.createElement("button", { id: "save-button", onClick: this.LoadState }, "Load")),
            React.createElement("div", null,
                React.createElement("label", { htmlFor: "keyCount" }, "Key Count: "),
                React.createElement("input", { type: "number", id: "keyCount", value: this.state.game.keyCount, onChange: this.OnSetKeyCount })),
            React.createElement("div", null,
                React.createElement("input", { type: "checkbox", id: "clue1Seen", checked: this.state.game.clue1Seen, onChange: this.OnSetClue1Seen }),
                React.createElement("label", { htmlFor: "clue1Seen" }, "Clue 1 Seen")),
            React.createElement("div", null,
                React.createElement("input", { type: "checkbox", id: "clue2Seen", checked: this.state.game.clue2Seen, onChange: this.OnSetClue2Seen }),
                React.createElement("label", { htmlFor: "clue2Seen" }, "Clue 2 Seen")),
            React.createElement("div", null,
                React.createElement("input", { type: "checkbox", id: "clue3Seen", checked: this.state.game.clue3Seen, onChange: this.OnSetClue3Seen }),
                React.createElement("label", { htmlFor: "clue3Seen" }, "Clue 3 Seen")),
            React.createElement("div", null,
                React.createElement("input", { type: "checkbox", id: "clue4Seen", checked: this.state.game.clue4Seen, onChange: this.OnSetClue4Seen }),
                React.createElement("label", { htmlFor: "clue4Seen" }, "Clue 4 Seen")),
            React.createElement("div", null,
                React.createElement("input", { type: "checkbox", id: "use4Board", checked: this.state.game.clue1Seen, onChange: this.OnSetUse4Board }),
                React.createElement("label", { htmlFor: "use4Board" }, "Use 4x4 Board")),
            React.createElement("div", null,
                React.createElement("input", { type: "checkbox", id: "solved3Board", checked: this.state.game.solved3Board, onChange: this.OnSetSolved3Board }),
                React.createElement("label", { htmlFor: "solved3Board" }, "Solved 3x3 Board")),
            React.createElement("div", null,
                React.createElement("input", { type: "checkbox", id: "solved4Board", checked: this.state.game.solved4Board, onChange: this.OnSetSolved4Board }),
                React.createElement("label", { htmlFor: "solved4Board" }, "Solved 4x4 Board")),
            React.createElement("div", null,
                React.createElement("input", { type: "checkbox", id: "finished", onChange: this.OnSetFinished }),
                React.createElement("label", { htmlFor: "finished" }, "Finished")));
    }
}
