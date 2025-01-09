import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Generates the HTML content for the sidebar webview, with the correct path for the CSS.
 * @param webviewView - The webview instance that allows us to resolve resource paths.
 * @returns The HTML content for the sidebar webview.
 */
export function getSidebarWebviewContent(webviewView: vscode.WebviewView): string {
    
  // Path to the CSS file
  const styleUri = vscode.Uri.file(path.join(__dirname, '..', '..', 'media', 'sidebar.css'));
  
  // Convert the path to a webview-compatible URI
  const styleUriWithWebview = webviewView.webview.asWebviewUri(styleUri);
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Code Assistant</title>
        <link rel="stylesheet" type="text/css" href="${styleUriWithWebview}">
    </head>
    <body>
        <div class="main-div">
            <h1 id="main-heading">
                Welcome to Code Assistant, your coding companion!
            </h1>
            <p id="intro">
                A code assistant helps developers by providing real-time code suggestions, debugging support, and automating tasks to enhance productivity, ensuring faster and more efficient software development.
            </p>
            <h2 id="sub-heading">
                Explore what Code Assistant can do
            </h2>
            <div id="func-list">
               <a>Explain Code</a>
               <a>Fix Code</a>
            </div>
        </div>
    </body>
    </html>
  `;
}
