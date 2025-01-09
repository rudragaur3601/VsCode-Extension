import * as vscode from "vscode";
import * as fs from "fs/promises";
import * as path from "path";

function createFileTreeDataProvider(rootPath: string) {
  if (!rootPath) {
    throw new Error("Invalid root path");
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
      const items = await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(dirPath, file);
          const stat = await fs.stat(filePath);

          if (stat.isDirectory()) {
            return {
              label: file,
              uri: vscode.Uri.file(filePath),
              type: "folder",
              children: await getChildren({ uri: vscode.Uri.file(filePath) }),
            };
          }

          return {
            label: file,
            uri: vscode.Uri.file(filePath),
            type: "file",
          };
        })
      );

      return items.filter((item) => item !== null); // Filter out null items
    } catch (error) {
      vscode.window.showErrorMessage(`Error reading directory: ${dirPath}`);
      return [];
    }
  }

  async function getDirectoryStructure(): Promise<any[]> {
    try {
      const structure = await getChildren(); // Properly invoke getChildren
      return structure;
    } catch (error) {
      vscode.window.showErrorMessage("Error retrieving directory structure.");
      throw error;
    }
  }

  return {
    getDirectoryStructure,
  };
}

export { createFileTreeDataProvider };
