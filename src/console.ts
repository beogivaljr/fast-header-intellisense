/**
 * Override for console so it shows console messages for both developer and user
 */

 import * as vscode from 'vscode';
 

 const EXTENSION_NAME = "Fast Header Intellisense";
 
 
 export const outputChannel = vscode.window.createOutputChannel(EXTENSION_NAME);
 
 // If debugging set this to true;
 const IS_DEBUG = false;
 
 export function log(message: string) {
     if(IS_DEBUG){  console.log(message); }
 
     outputChannel.appendLine(message);
 }
 
 export function error(message: string) {
     if(IS_DEBUG){  console.error(message); }
 
     outputChannel.appendLine("** Error **: ".concat(message));
     outputChannel.show();
 }
