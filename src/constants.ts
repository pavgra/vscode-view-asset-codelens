import * as vscode from 'vscode';

type ValueOf<T> = T[keyof T];

const EXTENSION_NAME = 'vscode-view-asset-codelens';

const EXTENSION_COMMANDS = {
    ENABLE: 'enable',
    DISABLE: 'disable',
    SHOW_ASSET: 'showAsset',
} as const;

const EXTENSION_CONFIG_KEYS = {
    ENABLED: 'enabled',
    ASSET_REGEX: 'assetRegex',
    ASSET_REGEX_FLAGS: 'assetRegexFlags',
    ASSET_VALUE_REGEX_GROUP_KEY: 'assetValueRegexGroupKey',
    ASSET_URI_PATTERN: 'assetUriPattern',
} as const;

function getFullCommandName(command: ValueOf<typeof EXTENSION_COMMANDS>) {
    return `${EXTENSION_NAME}.${command}`;
}

function getConfigStringValue(key: string): string {
    const value: string | undefined = vscode.workspace.getConfiguration(EXTENSION_NAME).get(key);
    if (!value) {
        throw new Error('Extension misconfigured');
    }
    return value;
}

export {
    EXTENSION_NAME,
    EXTENSION_COMMANDS,
    EXTENSION_CONFIG_KEYS,
    getFullCommandName,
    getConfigStringValue,
};
