using System.Text.Json.Serialization;

namespace MySoundboard.Models
{
    public class SoundModel
    {

        public int Id { get; set; }
        public string Name { get; set; }
        public string FilePath { get; set; }
        public string? AudioKey { get; set; }
        public string? ContentType { get; set; }
        public string Color { get; set; } = "#c9b22a";
        public int SectionId { get; set; }
        public int Position { get; set; }
        public int Volume { get; set; }
        public string? IconPath { get; set; }

        [JsonIgnore]
        public SectionModel Section { get; set; }


        public override bool Equals(object? obj)
        {
            if (obj is not SoundModel other)
            {
                return false;
            }

            return Id          == other.Id          && 
                   Name        == other.Name        && 
                   FilePath    == other.FilePath    &&
                   AudioKey    == other.AudioKey    &&
                   ContentType == other.ContentType &&
                   Color       == other.Color       &&
                   SectionId   == other.SectionId   &&
                   Position    == other.Position    &&
                   Volume      == other.Volume      &&
                   IconPath    == other.IconPath;
        }

        public SoundModel Clone()
        {
            return (SoundModel)this.MemberwiseClone();
        }

    }
}
