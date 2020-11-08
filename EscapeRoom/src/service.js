import * as signalR from "@microsoft/signalr";
export class Service {
    constructor(updateFunctions, url = "/hub") {
        this.updateFunctions = updateFunctions;
        this.url = url;
        this.connection = new signalR.HubConnectionBuilder().withUrl(url).configureLogging(signalR.LogLevel.Trace).build();
        this.connection.on("UpdateGameState", (gameState) => {
            for (let updateFunc of updateFunctions) {
                updateFunc(gameState);
            }
        });
        this.startup = this.connection.start();
    }
    receiveGameState() {
    }
    updateGameState(update) {
        this.startup.then(() => this.connection.send("Update", update));
    }
    join() {
        this.startup =
            this.startup.then(() => this.connection.send("Join"));
    }
}
