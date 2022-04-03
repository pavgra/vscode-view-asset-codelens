import * as vscode from 'vscode';
import * as regexpMatchIndices from 'regexp-match-indices';
import { EXTENSION_NAME, EXTENSION_CONFIG_KEYS, EXTENSION_COMMANDS, getFullCommandName, getConfigStringValue } from './constants';

export class CodelensProvider implements vscode.CodeLensProvider {

    private codeLenses: vscode.CodeLens[] = [];
    private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

    private regex: RegExp;
    private assetValueRegexGroupKey: string;

    constructor() {
        this.regex = new RegExp(
            getConfigStringValue(EXTENSION_CONFIG_KEYS.ASSET_REGEX),
            getConfigStringValue(EXTENSION_CONFIG_KEYS.ASSET_REGEX_FLAGS),
        );
        this.assetValueRegexGroupKey = getConfigStringValue(EXTENSION_CONFIG_KEYS.ASSET_VALUE_REGEX_GROUP_KEY);

        vscode.workspace.onDidChangeConfiguration((_) => {
            this._onDidChangeCodeLenses.fire();
        });
    }

    public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {

        if (vscode.workspace.getConfiguration(EXTENSION_NAME).get(EXTENSION_CONFIG_KEYS.ENABLED, true)) {
            // Parsing AST would be complicated due to possible multiple syntax types: JS, TS, Flow

            this.codeLenses = [];
            const text = document.getText();
            let matches;

            while ((matches = regexpMatchIndices(this.regex, text)) !== null) {

                if (matches?.groups?.[this.assetValueRegexGroupKey] !== undefined
                    && matches.indices?.groups?.[this.assetValueRegexGroupKey] !== undefined) {

                    const asset = matches.groups[this.assetValueRegexGroupKey];
                    const [start, end] = matches.indices.groups[this.assetValueRegexGroupKey];

                    const line = document.lineAt(document.positionAt(start).line);
                    const range = new vscode.Range(
                        new vscode.Position(line.lineNumber, line.range.start.character),
                        new vscode.Position(line.lineNumber, line.range.end.character),
                    );

                    this.codeLenses.push(new vscode.CodeLens(range, {
                        title: 'Show asset',
                        command: getFullCommandName(EXTENSION_COMMANDS.SHOW_ASSET),
                        arguments: [asset],
                    }));
                }
            }
            return this.codeLenses;
        }
        return [];
    }

}