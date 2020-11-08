using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EscapeRoom
{
    public class GameState
    {
        public GameState()
        {
            KeyCount = 0;
            MazeX = 0;
            MazeY = 0;
            KaleidoscopeGear1 = 0.0;
            KaleidoscopeGear2 = 0.0;
            KaleidoscopeGear3 = 0.0;
            BookPage = 0;
            Clue1Seen = false;
            Clue2Seen = false;
            Clue3Seen = false;
            Clue4Seen = false;
            Solved3Board = false;
            Solved4Board = false;
            Finished = false;
            Use4Board = true;
            Loaded = false;
            RunesValid = true;
            ActiveRunes = new List<List<bool>>();
            RuneCharges = new List<List<double>>();
        }

        public bool Loaded { get; set; }

        public int KeyCount { get; set; }

        public int MazeX { get; set; }

        public int MazeY { get; set; }

        public double KaleidoscopeGear1 { get; set; }

        public double KaleidoscopeGear2 { get; set; }

        public double KaleidoscopeGear3 { get; set; }

        public bool Clue1Seen { get; set; }

        public bool Clue2Seen { get; set; }

        public bool Clue3Seen { get; set; }

        public bool Clue4Seen { get; set; }

        public int BookPage { get; set; }

        public bool Use4Board { get; set; }

        public bool Solved3Board { get; set; }

        public bool Solved4Board { get; set; }

        public bool Finished { get; set; }

        public bool RunesValid { get; set; }

        public List<List<bool>> ActiveRunes { get; set; }

        public List<List<double>> RuneCharges { get; set; }

        public GameState WithUpdate(GameStateUpdate update)
        {
            return new GameState
            {
                KeyCount = update.KeyCount ?? this.KeyCount,
                MazeX = update.MazeX ?? this.MazeX,
                MazeY = update.MazeY ?? this.MazeY,
                KaleidoscopeGear1 = update.KaleidoscopeGear1 ?? this.KaleidoscopeGear1,
                KaleidoscopeGear2 = update.KaleidoscopeGear2 ?? this.KaleidoscopeGear2,
                KaleidoscopeGear3 = update.KaleidoscopeGear3 ?? this.KaleidoscopeGear3,
                BookPage = update.BookPage ?? this.BookPage,
                Clue1Seen = update.Clue1Seen ?? this.Clue1Seen,
                Clue2Seen = update.Clue2Seen ?? this.Clue2Seen,
                Clue3Seen = update.Clue3Seen ?? this.Clue3Seen,
                Clue4Seen = update.Clue4Seen ?? this.Clue4Seen,
                Solved3Board = update.Solved3Board ?? this.Solved3Board,
                Solved4Board = update.Solved4Board ?? this.Solved4Board,
                Finished = update.Finished ?? this.Finished,
                Use4Board = update.Use4Board ?? this.Use4Board,
                RunesValid = update.RunesValid ?? this.RunesValid,
                ActiveRunes = update.ActiveRunes ?? this.ActiveRunes,
                RuneCharges = update.RuneCharges ?? this.RuneCharges,
                Loaded = update.Loaded ?? false // Special logic for initial load or restored state
            };
        }
    }
}
