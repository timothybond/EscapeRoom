using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EscapeRoom
{
    public interface IGameClient
    {
        Task UpdateGameState(GameState gameState);

        //Task UpdateImages(string[] backgrounds, string[] sprites);
    }
}
