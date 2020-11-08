using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Memory;
using System.Text.Json;
using System.Threading.Tasks;

namespace EscapeRoom
{
    public class GameHub : Hub<IGameClient>
    {
        const string GameKey = "Game";
        const string MasterGroup = "Master";

        private static readonly JsonSerializerOptions JsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        private readonly IMemoryCache cache;

        public GameHub(IMemoryCache cache)
        {
            this.cache = cache;
        }

        public async Task Join(string playerId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, MasterGroup);

            var gameState = this.cache.GetOrCreate(GameKey, entry => new GameState());
            this.cache.Set(Context.ConnectionId, playerId);

            if (gameState != null)
            {
                await Clients.Client(Context.ConnectionId).UpdateGameState(gameState);
            }
        }

        public async Task Update(GameStateUpdate update)
        {
            var gameState = this.cache.GetOrCreate(GameKey, entry => new GameState()).WithUpdate(update);

            this.cache.Set(GameKey, gameState);

            if (update.Admin ?? false)
            {
                await this.Clients.All.UpdateGameState(gameState);
            }
            else
            {
                await this.Clients.AllExcept(Context.ConnectionId).UpdateGameState(gameState);
            }
        }
    }
}
