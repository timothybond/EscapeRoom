import * as signalR from "@microsoft/signalr";
import { GameState, GameStateUpdate } from './gameState';

export interface UpdateFunction {
    (gameState: GameState): void;
}

export class Service {
    connection: signalR.HubConnection;
    private startup: Promise<void>;

    constructor(public updateFunctions: UpdateFunction[], public readonly url = "/hub", ) {
        this.connection = new signalR.HubConnectionBuilder().withUrl(url).configureLogging(signalR.LogLevel.Trace).build();

        this.connection.on("UpdateGameState", (gameState: GameState) => {
            for (let updateFunc of updateFunctions) {
                updateFunc(gameState);
            }
        });

        this.startup = this.connection.start();
    }

    receiveGameState() {

    }

    updateGameState(update: GameStateUpdate) {
        this.startup.then(() =>
            this.connection.send("Update", update));
    }

    join() {
        this.startup =
            this.startup.then(() =>
                this.connection.send("Join"));
    }
}