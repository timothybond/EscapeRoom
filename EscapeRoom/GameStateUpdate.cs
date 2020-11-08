using System.Collections.Generic;

namespace EscapeRoom
{
    public class GameStateUpdate
    {
        public int? KeyCount { get; set; }

        public int? MazeX { get; set; }

        public int? MazeY { get; set; }

        public double? KaleidoscopeGear1 { get; set; }

        public double? KaleidoscopeGear2 { get; set; }

        public double? KaleidoscopeGear3 { get; set; }

        public bool? Clue1Seen { get; set; }

        public bool? Clue2Seen { get; set; }

        public bool? Clue3Seen { get; set; }

        public bool? Clue4Seen { get; set; }

        public int? BookPage { get; set; }

        public bool? Use4Board { get; set; }

        public bool? Solved3Board { get; set; }

        public bool? Solved4Board { get; set; }

        public bool? Finished { get; set; }

        public bool? Loaded { get; set; }

        /// <summary>
        /// Indicates changes made directly from the admin page.
        /// </summary>
        public bool? Admin { get; set; }

        public bool? RunesValid { get; set; }

        public List<List<bool>>? ActiveRunes { get; set; }

        public List<List<double>>? RuneCharges { get; set; }
    }
}
