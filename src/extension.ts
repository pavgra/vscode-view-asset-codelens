import { ExtensionContext, env, commands, Disposable, languages, Uri, workspace } from 'vscode';
import { EXTENSION_NAME, EXTENSION_COMMANDS, EXTENSION_CONFIG_KEYS, getFullCommandName, getConfigStringValue } from './constants';
import { CodelensProvider } from './CodelensProvider';

let disposables: Disposable[] = [];

export function activate(context: ExtensionContext) {
    const codelensProvider = new CodelensProvider();

    languages.registerCodeLensProvider("*", codelensProvider);

    commands.registerCommand(getFullCommandName(EXTENSION_COMMANDS.ENABLE), () => {
        workspace.getConfiguration(EXTENSION_NAME).update(EXTENSION_CONFIG_KEYS.ENABLED, true, true);
    });

    commands.registerCommand(getFullCommandName(EXTENSION_COMMANDS.DISABLE), () => {
        workspace.getConfiguration(EXTENSION_NAME).update(EXTENSION_CONFIG_KEYS.ENABLED, false, true);
    });

    commands.registerCommand(getFullCommandName(EXTENSION_COMMANDS.SHOW_ASSET), (...args: any) => {
		const uriPattern = getConfigStringValue(EXTENSION_CONFIG_KEYS.ASSET_URI_PATTERN);
		const uri = Uri.parse(uriPattern.replace('{id}', args[0]));
		env.openExternal(uri);
    });
}

// this method is called when your extension is deactivated
export function deactivate() {
    if (disposables) {
        disposables.forEach(item => item.dispose());
    }
    disposables = [];
}