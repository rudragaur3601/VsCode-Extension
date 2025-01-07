import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext): void {
    
    const workspaceFolder = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;

    if (!workspaceFolder) {
        vscode.window.showErrorMessage('No workspace folder is opened.');
        return;
    }

    // Register the top-level "Code Assistant" command
    const showDirectoryStructureGroup = vscode.commands.registerCommand('code-assistant.showDirectoryStructureGroup', () => {
        // This command shows the submenu with the actual "Show Directory Structure" option.
        // No need to do anything here. The submenu appears.
    });

    // Register the "Show Directory Structure" command
    const showFileTreeCommand = vscode.commands.registerCommand('code-assistant.showFileTree', () => {
        const treeDataProvider = createFileTreeDataProvider(workspaceFolder);
        vscode.window.createTreeView('Directory-Structure', { treeDataProvider });
        treeDataProvider.refresh(workspaceFolder);
    });

    context.subscriptions.push(showDirectoryStructureGroup);
    context.subscriptions.push(showFileTreeCommand);
}

function createFileTreeDataProvider(rootPath: string) {
    if (!rootPath) {
        throw new Error('Invalid root path');
    }

    async function getChildren(element?: { uri: vscode.Uri }): Promise<any[]> {
        const dirPath = element ? element.uri.fsPath : rootPath;

        try {
            const stats = await fs.stat(dirPath);
            if (!stats.isDirectory()) {
                throw new Error(`${dirPath} is not a directory`);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error accessing directory: ${dirPath}`);
            return [];
        }

        try {
            const files = await fs.readdir(dirPath);
            const items = await Promise.all(files.map(async (file) => {
                const filePath = path.join(dirPath, file);
                const stat = await fs.stat(filePath);

                if (stat.isDirectory()) {
                    return {
                        label: file,
                        uri: vscode.Uri.file(filePath),
                        type: 'folder',
                        children: await getChildren({ uri: vscode.Uri.file(filePath) })
                    };
                }

                return {
                    label: file,
                    uri: vscode.Uri.file(filePath),
                    type: 'file'
                };
            }));
			if (!element) {
				console.log('Directory structure (JSON):', JSON.stringify(items, null, 2));
				}
				
				return items.filter(item => item !== null); // Filter out null items
        } catch (error) {
            vscode.window.showErrorMessage(`Error reading directory: ${dirPath}`);
            return [];
        }
    }

    function getTreeItem(element: any): vscode.TreeItem {
        const treeItem = new vscode.TreeItem(
            element.label,
            element.type === 'folder' ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
        );
        treeItem.resourceUri = element.uri;

        return treeItem;
    }

    function refresh(newRootPath: string): void {
        if (!newRootPath) {
            throw new Error('Invalid root path for refresh');
        }
        rootPath = newRootPath;
    }

    return {
        getChildren,
        getTreeItem,
        refresh
    };
}

export { createFileTreeDataProvider };
