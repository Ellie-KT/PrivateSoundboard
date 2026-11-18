using Microsoft.AspNetCore.Components;
using MySoundboard.Models;

namespace MySoundboard.Services;

public interface ISoundRepository
{
    Task InitializeAsync();

    Task<IReadOnlyList<SoundModel>> GetAllAsync();

    Task UpdateMetadataAsync(SoundModel sound);

    Task DeleteAsync(string id);

    Task ClearAsync();

    Task PlayAsync(int id, double volume);

    Task<IReadOnlyList<SoundModel>> ImportAsync(ElementReference inputElement);
}