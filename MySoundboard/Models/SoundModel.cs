namespace MySoundboard.Models
{
    public class SoundModel
    {

        public int Id { get; set; }
        public string Name { get; set; }
        public string FilePath { get; set; }
        public string Color { get; set; }
        public int SectionId { get; set; }
        public int Position { get; set; }
        public int Volume { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastChanged { get; set; }
        public string? IconPath { get; set; }


        public SectionModel Section { get; set; }


    }
}
