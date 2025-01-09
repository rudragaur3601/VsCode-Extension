import * as vscode from "vscode";
import { createFileTreeDataProvider } from "./directoryTreeDataProvider";
import { getEditorWebviewContent } from "./webView/editorWebviewContent";
import { getSidebarWebviewContent } from "./webView/sidebarWebviewContent";

export function activate(context: vscode.ExtensionContext): void {
  const workspaceFolder = vscode.workspace.workspaceFolders
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : undefined;

  if (!workspaceFolder) {
    vscode.window.showErrorMessage("No workspace folder is opened.");
    return;
  }

  const fileTreeProvider = createFileTreeDataProvider(workspaceFolder);

  context.subscriptions.push(
    vscode.commands.registerCommand("code-assistant.showFileTree", async () => {
      try {
        const structure = await fileTreeProvider.getDirectoryStructure();
        console.log("Directory structure:", JSON.stringify(structure, null, 2));
        vscode.window.showInformationMessage("Directory structure logged to the console.");
      } catch (error) {
        vscode.window.showErrorMessage("Error retrieving directory structure.");
        console.error(error);
      }
    }));

  context.subscriptions.push(
    vscode.commands.registerCommand("code-assistant.showEditorWebview",()=>{
      const editorPanel = vscode.window.createWebviewPanel(
        "CaEditorPanel",
        "Code Assistant",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
        }
      );
      try {
        editorPanel.webview.html = getEditorWebviewContent();
        vscode.window.showInformationMessage("file Webview content loaded successfully");
      } catch (error) {
          vscode.window.showErrorMessage("Failed to load File webview content.");        
        }
      })
    );

    context.subscriptions.push(
      vscode.window.registerWebviewViewProvider("code-assistant.showSidebarWebView",{
        resolveWebviewView(webviewView:vscode.WebviewView){
          webviewView.webview.options={
            enableScripts: true
          }
          webviewView.webview.html = getSidebarWebviewContent();
        }
      })
    )
    
}


