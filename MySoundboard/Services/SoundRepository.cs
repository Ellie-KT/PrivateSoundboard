using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using MySoundboard.Models;

namespace MySoundboard.Services;

public sealed class SoundRepository :
    ISoundRepository,
    IAsyncDisposable
{
    private readonly IJSRuntime _jsRuntime;

    private IJSObjectReference? _module;

    public SoundRepository(IJSRuntime jsRuntime)
    {
        _jsRuntime = jsRuntime;
    }

    private async Task<IJSObjectReference> GetModuleAsync()
    {
        _module ??= await _jsRuntime.InvokeAsync<IJSObjectReference>(
            "import",
            "./js/indexedDb.js"
        );

        return _module;
    }

    public async Task InitializeAsync()
    {
        var module = await GetModuleAsync();

        await module.InvokeAsync<bool>("initialize");
    }

    public async Task<IReadOnlyList<SoundModel>> GetAllAsync()
    {
        var module = await GetModuleAsync();

        var sounds =
            await module.InvokeAsync<SoundModel[]>("getAllSounds");

        return sounds;
    }

    public async Task UpdateMetadataAsync(SoundModel sound)
    {
        ArgumentNullException.ThrowIfNull(sound);

        var module = await GetModuleAsync();

        await module.InvokeVoidAsync(
            "updateMetadata",
            sound
        );
    }

    public async Task DeleteAsync(string id)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(id);

        var module = await GetModuleAsync();

        await module.InvokeVoidAsync(
            "deleteSound",
            id
        );
    }

    public async Task ClearAsync()
    {
        var module = await GetModuleAsync();

        await module.InvokeVoidAsync("clearSounds");
    }

    public async Task PlayAsync(int id, double volume)
    {
        var module = await GetModuleAsync();

        await module.InvokeVoidAsync(
            "playSound",
            id,
            Math.Clamp(volume, 0, 1)
        );
    }

    public async ValueTask DisposeAsync()
    {
        if (_module is not null)
        {
            await _module.DisposeAsync();
        }
    }

    public async Task<IReadOnlyList<SoundModel>> ImportAsync(
    ElementReference inputElement)
    {
        var module = await GetModuleAsync();

        var importedSounds =
            await module.InvokeAsync<SoundModel[]>(
                "importFiles",
                inputElement
            );

        return importedSounds;
    }
}