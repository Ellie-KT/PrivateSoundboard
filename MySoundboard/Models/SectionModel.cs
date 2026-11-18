namespace MySoundboard.Models
{
    public class SectionModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
        public int Position { get; set; }
        public int ButtonCout { get; set; }
        public string? IconPath { get; set; }


        public List<SoundModel> SoundsInSection { get; set; } = new();







    }
}
