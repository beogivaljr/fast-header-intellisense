// This module contains code for the tag parser version of this extension

import * as vscode from 'vscode';
import * as path from 'path';

import { FileType, IntellisenseMode, Intellisense } from './types';

import * as CON from './constants';

import * as console from "./console";


let _oldFileType: FileType = FileType.Other;
let _intellisenseStatusItem: vscode.StatusBarItem | null = null;
let _intellisenseMode : IntellisenseMode = IntellisenseMode.UnlockedSwitch;


const HEADER_EXTENSIONS: ReadonlyArray<string> = [".hpp", ".h", ".hh", ".hxx"];
const SOURCE_EXTENSIONS: ReadonlyArray<string> = [".cpp", ".c", ".cc", ".cxx"];



export async function checkSwitchIntellisense(filePath: string): Promise<void> {
	
	const newFileType = getFileTypeFromExtension(path.extname(filePath));
	
	// Do nothing for 'old' filetypes or if intellisense is locked
	// We also do nothing after filetype.Other so it doesn't get stored in old file type var
	// This will prevent changeSettings happening when switching back and forth between Other file types and Header/Source file types.
	if (newFileType === getCurrentFileType() || newFileType === FileType.Other || isLocked()) {
		return;
	}
	
	setCurrentFileType(newFileType);
	setStartProcessingIntellisenseStatusText();
	
	switch (newFileType as FileType) {
		case FileType.Header:
			await changeIntellisenseSetting(Intellisense.Tag);
			break;
		case FileType.Source:
			await changeIntellisenseSetting(Intellisense.Context);
			break;
		default:
			throw Error("Unreachable code was reached in checkSwitchIntellisense()");
			break;
	}

	const currentIntellisense = getCurrentFileType() === FileType.Header ? Intellisense.Tag : Intellisense.Context;
	updateIntellisenseStatusItem(getIntellisenseMode(), currentIntellisense);

}


async function changeIntellisenseSetting(intellisense : Intellisense): Promise<void> {
		
	if (!vscode.workspace.workspaceFolders) {
		return;
	}
	
	const config_category = CON.URI_CAT_C_CPP;
	const config = vscode.workspace.getConfiguration(config_category);

	try {

		// Set Intellisense to Tag or Context Aware depending on filetype
		const intellisense_value = intellisense === Intellisense.Tag ? CON.URI_VAL_TAGPARSER : CON.URI_VAL_DEFAULT;
		await config.update(CON.URI_SET_INTELLISENSE_ENGINE, intellisense_value, CON.UPDATE_WORKSPACE_CONFIG);
		
	} catch (error) {
		if(error instanceof(Error)){
			console.error(`changeIntellisenseSettings() threw an error: ${error.message}`);
		}
		else {
			console.error("changeIntellisenseSettings() threw an error");
		}
		return;
	}

}

export async function onLockToggle() {
	
	if (isProcessingIntellisense()){
		return;
	}
	setStartProcessingIntellisenseStatusText();
	
	const currentFileType = getCurrentFileType();
	const intellisenseMode = getIntellisenseMode();

	if (currentFileType === FileType.Header){
		if (intellisenseMode === IntellisenseMode.UnlockedSwitch) {
			setIntellisenseMode(IntellisenseMode.LockedTag);
		}
		else if (intellisenseMode === IntellisenseMode.LockedTag){
			setIntellisenseMode(IntellisenseMode.LockedContext);
			await changeIntellisenseSetting(Intellisense.Context);
		}
		else {  // LockedContext
			setIntellisenseMode(IntellisenseMode.UnlockedSwitch);
			await changeIntellisenseSetting(Intellisense.Tag);
		}
	}
	else if(currentFileType === FileType.Source){ 

		if (intellisenseMode === IntellisenseMode.UnlockedSwitch) {
			setIntellisenseMode(IntellisenseMode.LockedContext);
		}
		else if (intellisenseMode === IntellisenseMode.LockedContext){
			setIntellisenseMode(IntellisenseMode.LockedTag);
			await changeIntellisenseSetting(Intellisense.Tag);
		}
		else {  // LockedTag
			
			setIntellisenseMode(IntellisenseMode.UnlockedSwitch);
			await changeIntellisenseSetting(Intellisense.Context);
		}
	}
	
	const currentIntellisense = getCurrentFileType() === FileType.Header ? Intellisense.Tag : Intellisense.Context;
	updateIntellisenseStatusItem(getIntellisenseMode(), currentIntellisense);
}


export function getFileTypeFromExtension(extension: string): FileType {
	const extLower = extension.toLowerCase();
	
	if (HEADER_EXTENSIONS.includes(extLower)) {
		return FileType.Header;
	}
	else if (SOURCE_EXTENSIONS.includes(extLower)) {
		return FileType.Source;
	}
	else {
		return FileType.Other;
	}

}


/**
 * Create the statusbar icon and text that appears when we have a 'fast' header.
 * 
 * @param tooltip 
 */
export function createStatusItem(tooltip: string, command: string | vscode.Command | undefined,
	text: string = "", alignment: vscode.StatusBarAlignment | undefined = vscode.StatusBarAlignment.Left,
	priority: number | undefined = CON.TOGGLED_STATUS_PRIORITY): vscode.StatusBarItem {

	const item = vscode.window.createStatusBarItem(alignment, priority);
	item.text = text;
	item.tooltip = tooltip;
	item.command = command;

	return item;
}


/**
 * @param statusBarItem null will despose of any current Intellisense statusBarItem
 */
export function setIntellisenseStatusItem(statusBarItem: vscode.StatusBarItem | null): void {
	if (!statusBarItem){
		getIntellisenseStatusItem()?.dispose();
		return;
	}
	_intellisenseStatusItem = statusBarItem;
}


function setStartProcessingIntellisenseStatusText() {

	if (isProcessingIntellisense()){
		return;
	}

	const statusItem = getIntellisenseStatusItem();

	if (!statusItem){
		return;
	}

	statusItem.text = statusItem.text.concat(CON.CODICON_PROCESSING);
}


function isProcessingIntellisense() : boolean {
	const statusItem = getIntellisenseStatusItem();

	if (!statusItem){
		console.log("No status item to check for isProcessingIntellisense");
		return false;
	}

	return statusItem.text.includes(CON.CODICON_PROCESSING);
}


/**
 * 
 * @param intellisenseMode 
 * @param intellisense Only matters if intellisenseMode is equal to UnlockedSwitch
 */
function createIntellisenseStatusText( intellisenseMode: IntellisenseMode, intellisense: Intellisense) : string 
{	
	let codiconIntellisenseType;
	let codiconLocked = intellisenseMode === IntellisenseMode.UnlockedSwitch ? CON.CODICON_UNLOCK : CON.CODICON_LOCK;

	if (intellisenseMode === IntellisenseMode.LockedContext || (intellisenseMode === IntellisenseMode.UnlockedSwitch && intellisense === Intellisense.Context)) {
		codiconIntellisenseType = CON.CODICON_AWARE;
	}
	else {
		codiconIntellisenseType = CON.CODICON_TAG;
	}

	return `${codiconLocked} ${codiconIntellisenseType}`;
}


function updateIntellisenseStatusItem( intellisenseMode: IntellisenseMode, intellisense: Intellisense )
{
	const intellisenseStatusItem = getIntellisenseStatusItem();

	if (!intellisenseStatusItem){
		console.log("No Intellisense Status Item to update.");
		return;
	}

	intellisenseStatusItem.text = createIntellisenseStatusText(intellisenseMode, intellisense);

}


function getCurrentFileType(): FileType {
	return _oldFileType;
}

function setCurrentFileType(fileType: FileType): void {
	_oldFileType = fileType;
}

function getIntellisenseMode() : IntellisenseMode {
	return _intellisenseMode;
}

function setIntellisenseMode(mode: IntellisenseMode) {
	_intellisenseMode = mode;
}

function isLocked(): boolean{
	return _intellisenseMode !== IntellisenseMode.UnlockedSwitch;
}

function getIntellisenseStatusItem(): vscode.StatusBarItem | null {
	return _intellisenseStatusItem;
}
