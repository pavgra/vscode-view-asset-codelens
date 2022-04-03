# vscode-view-asset-codelens

Provides a codelens (hint over line of code) with a link to open detected asset.

Configuration:
- `enabled` - defines whether the extension should be executed.
- `assetRegex` - regex to detect code entry with an asset to show the codelens for. Should include named matching group that references the asset identifier. E.g. `\.toMatchScreenshot\(\s*'(?<asset>[^']+)` where a line with code `expect('html').toMatchScreenshot('opSlnDP');` would be matched and `opSlnDP` would be extracted as the asset identifier.
- `assetRegexFlags` - RegExp flags for the regex described abolve. E.g. `sg`.
- `assetValueRegexGroupKey` - name of the matching group that references the asset identifier.
- `assetUriPattern` - pattern used for the asset URI construction. E.g. for the assetUriPattern set to `https://imgur.com/gallery/{id}` and extracted `opSlnDP` asset identifier the `https://imgur.com/gallery/opSlnDP` URI would be assembled.