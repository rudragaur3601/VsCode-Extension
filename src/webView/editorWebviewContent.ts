import * as vscode from 'vscode';
import * as path from 'path';

export function getEditorWebviewContent(webview: vscode.Webview): string {
  // Update to the correct path of the 'editor.css' file
  const styleUri = vscode.Uri.file(path.join(__dirname, '..', '..', 'media', 'editor.css'));
    
  // Convert the path to a webview-compatible URI
  const styleUriWithWebview = webview.asWebviewUri(styleUri);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Code Assistant</title>
        <!-- Use the correct editor.css file here -->
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



