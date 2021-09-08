// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

import * as vscode from 'vscode';

import * as tag from "./switch";
import * as CON from "./constants";

import * as console from "./console";


export async function activate(context: vscode.ExtensionContext) {
	
	console.log("fhIntellisense: activate");

	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(async event => {
		const filePath = event?.document?.fileName ?? "";

		if (!filePath) {
			return;
		}
		
		await tag.checkSwitchIntellisense(filePath);
	}));

	vscode.commands.registerCommand(CON.URI_FUL_FHI_LOCK , async () => {
		await tag.onLockToggle();
	});

	const intellisenseStatusItem = tag.createStatusItem( "", CON.URI_FUL_FHI_LOCK, "");
	intellisenseStatusItem.show();
	tag.setIntellisenseStatusItem(intellisenseStatusItem);

	const fileName = vscode.window.activeTextEditor?.document.fileName;
	await tag.checkSwitchIntellisense(fileName ? fileName : "");

}


export function deactivate() {
	
	// Dispose of taskbar icon
	tag.setIntellisenseStatusItem(null);

	return undefined;  //  An extension may return undefined from deactivate() if the cleanup runs synchronously.
}
