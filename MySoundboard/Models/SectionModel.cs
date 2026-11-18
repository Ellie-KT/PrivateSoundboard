namespace MySoundboard.Models
{
    public class SectionModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Color { get; set; } = "#5308cc";
        public int Position { get; set; }
        public int ButtonCout { get; set; }
        public string? IconPath { get; set; }


        public List<SoundModel> SoundsInSection { get; set; } = new();


        override public bool Equals(object? obj)
        {
            if (obj is not SectionModel other)
                return false;

            return Id         == other.Id && 
                   Name       == other.Name && 
                   Color      == other.Color &&
                   Position   == other.Position &&
                   ButtonCout == other.ButtonCout &&
                   IconPath   == other.IconPath;
        }

        public SectionModel Clone()
        {
            return (SectionModel)this.MemberwiseClone();
        }




    }
}
