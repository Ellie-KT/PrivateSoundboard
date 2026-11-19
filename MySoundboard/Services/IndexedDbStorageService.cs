using Microsoft.JSInterop;
using MySoundboard.Models;

namespace MySoundboard.Services;

public sealed class IndexedDbStorageService
{
    private readonly IJSRuntime _jsRuntime;

    public IndexedDbStorageService(IJSRuntime jsRuntime)
    {
        _jsRuntime = jsRuntime;
    }

    public async Task<List<SectionModel>> LoadSectionsAsync()
    {
        var sections = await _jsRuntime.InvokeAsync<List<SectionModel>>("indexedDbStorage.loadSections");
        sections ??= new List<SectionModel>();

        foreach (var section in sections)
        {
            section.SoundsInSection ??= new List<SoundModel>();
            foreach (var sound in section.SoundsInSection)
            {
                sound.SectionId = section.Id;
                sound.Section = section;
            }
        }

        return sections;
    }

    public async Task SaveSectionsAsync(List<SectionModel> sections)
    {
        foreach (var section in sections)
        {
            section.SoundsInSection ??= new List<SoundModel>();
            foreach (var sound in section.SoundsInSection)
            {
                sound.SectionId = section.Id;
            }
        }

        await _jsRuntime.InvokeVoidAsync("indexedDbStorage.saveSections", sections);
    }
}
