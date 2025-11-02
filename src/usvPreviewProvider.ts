import * as vscode from 'vscode';
import { CsvToUsvConverter } from './converter';

export class UsvPreviewProvider {
  private panels: Map<string, vscode.WebviewPanel> = new Map();

  // Color palette for columns (rainbow colors)
  private columnColors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#FFA07A', // Light Salmon
    '#98D8C8', // Mint
    '#F7DC6F', // Yellow
    '#BB8FCE', // Purple
    '#85C1E2', // Sky Blue
    '#F8B88B', // Peach
    '#52C77E'  // Green
  ];

  /**
   * Open USV preview in a WebView
   */
  public openPreview(editor: vscode.TextEditor): void {
    const filePath = editor.document.uri.fsPath;
    const fileName = editor.document.fileName.split('/').pop() || 'usv-preview';

    // Reuse existing panel if file is already open
    if (this.panels.has(filePath)) {
      const panel = this.panels.get(filePath)!;
      panel.reveal(vscode.ViewColumn.Beside);
      this.updatePreview(panel, editor);
      return;
    }

    // Create new WebView panel
    const panel = vscode.window.createWebviewPanel(
      'usvPreview',
      `Preview: ${fileName}`,
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        localResourceRoots: [],
        retainContextWhenHidden: true
      }
    );

    // Store panel reference
    this.panels.set(filePath, panel);

    // Clean up on close
    panel.onDidDispose(() => {
      this.panels.delete(filePath);
    });

    // Update preview
    this.updatePreview(panel, editor);
  }

  /**
   * Update preview content
   */
  private updatePreview(panel: vscode.WebviewPanel, editor: vscode.TextEditor): void {
    try {
      const content = editor.document.getText();
      const stats = CsvToUsvConverter.getStatistics(content, 'usv');

      if (stats.rows === 0) {
        panel.webview.html = this.getErrorHtml('No data found in USV file');
        return;
      }

      // Parse USV into 2D array
      const rows = this.parseUsv(content);

      // Generate HTML table with column colors
      panel.webview.html = this.generateTableHtml(rows, stats);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      panel.webview.html = this.getErrorHtml(`Parse error: ${errorMsg}`);
    }
  }

  /**
   * Parse USV content into 2D array
   */
  private parseUsv(usvContent: string): string[][] {
    const UNIT_SEP = '␟';
    const RECORD_SEP = '␞';

    const rows = usvContent
      .split(RECORD_SEP)
      .filter(row => row.length > 0)
      .map(row => row.split(UNIT_SEP));

    return rows;
  }

  /**
   * Get color for a specific column index
   */
  private getColumnColor(columnIndex: number): string {
    return this.columnColors[columnIndex % this.columnColors.length];
  }

  /**
   * Generate HTML table from 2D array with column colors
   */
  private generateTableHtml(rows: string[][], stats: { rows: number; columns: number; characters: number }): string {
    if (rows.length === 0) {
      return this.getErrorHtml('No data to display');
    }

    // Generate CSS for column colors
    let columnCss = '';
    for (let i = 0; i < stats.columns; i++) {
      const color = this.getColumnColor(i);
      columnCss += `
        .col-${i} {
          border-left: 3px solid ${color};
          background-color: ${color}15; /* 15% opacity */
        }
        .col-${i}:hover {
          background-color: ${color}25; /* 25% opacity on hover */
        }
      `;
    }

    // Generate table header row with colors
    const headerRow = rows[0];
    const headerHtml = headerRow
      .map((cell, index) => {
        const color = this.getColumnColor(index);
        return `<th class="col-${index}" style="border-left: 3px solid ${color}; background-color: ${color}30;">${this.escapeHtml(cell)}</th>`;
      })
      .join('');

    // Generate table body rows with colors
    const bodyRows = rows
      .slice(1)
      .map((row, rowIndex) => {
        const cells = row
          .map((cell, colIndex) => `<td class="col-${colIndex}">${this.escapeHtml(cell)}</td>`)
          .join('');
        return `<tr><td class="row-number">${rowIndex + 2}</td>${cells}</tr>`;
      })
      .join('');

    // Add row number header
    const fullHeaderHtml = `<th class="row-number">#</th>${headerHtml}`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>USV Preview</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      background-color: var(--vscode-editor-background);
      color: var(--vscode-editor-foreground);
      padding: 20px;
      overflow-x: auto;
    }

    .container {
      max-width: 100%;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid var(--vscode-editorGroup-border);
    }

    .header h1 {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
      color: var(--vscode-editor-foreground);
    }

    .stats {
      display: flex;
      gap: 20px;
      font-size: 14px;
      color: var(--vscode-descriptionForeground);
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .stat-icon {
      font-size: 16px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background-color: var(--vscode-editor-background);
      border: 1px solid var(--vscode-editorGroup-border);
      margin-top: 20px;
      font-size: 13px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    thead {
      position: sticky;
      top: 0;
      z-index: 10;
    }

    th {
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: var(--vscode-editor-foreground);
      border-bottom: 2px solid var(--vscode-editorGroup-border);
      border-right: 1px solid var(--vscode-editorGroup-border);
      user-select: none;
      cursor: default;
      word-break: break-word;
      max-width: 300px;
    }

    th:last-child {
      border-right: none;
    }

    th.row-number {
      background-color: var(--vscode-sideBar-background);
      width: 60px;
      min-width: 60px;
      max-width: 60px;
      text-align: center;
      color: var(--vscode-descriptionForeground);
      font-weight: 500;
      border-left: none;
    }

    td {
      padding: 10px 12px;
      border-bottom: 1px solid var(--vscode-editorGroup-border);
      border-right: 1px solid var(--vscode-editorGroup-border);
      color: var(--vscode-editor-foreground);
      word-break: break-word;
      max-width: 300px;
    }

    td:last-child {
      border-right: none;
    }

    td.row-number {
      background-color: var(--vscode-sideBar-background);
      width: 60px;
      min-width: 60px;
      max-width: 60px;
      text-align: center;
      color: var(--vscode-descriptionForeground);
      font-weight: 500;
      border-right: 1px solid var(--vscode-editorGroup-border);
      border-left: none;
    }

    tbody tr:hover {
      background-color: var(--vscode-list-hoverBackground);
    }

    tbody tr:nth-child(even) td {
      opacity: 0.9;
    }

    tbody tr:nth-child(odd) td {
      opacity: 1;
    }

    /* Column-specific colors */
    ${columnCss}

    .empty {
      padding: 40px;
      text-align: center;
      color: var(--vscode-descriptionForeground);
      font-size: 16px;
    }

    .error {
      padding: 20px;
      background-color: var(--vscode-inputValidation-errorBackground);
      color: var(--vscode-inputValidation-errorForeground);
      border: 1px solid var(--vscode-inputValidation-errorBorder);
      border-radius: 4px;
      margin: 20px 0;
    }

    .error-icon {
      margin-right: 8px;
      font-size: 18px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 USV Preview</h1>
      <div class="stats">
        <div class="stat-item">
          <span class="stat-icon">📈</span>
          <span><strong>${stats.rows}</strong> rows</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">📋</span>
          <span><strong>${stats.columns}</strong> columns</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">💾</span>
          <span><strong>${(stats.characters / 1024).toFixed(1)}</strong> KB</span>
        </div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          ${fullHeaderHtml}
        </tr>
      </thead>
      <tbody>
        ${bodyRows}
      </tbody>
    </table>
  </div>
</body>
</html>
    `;

    return html;
  }

  /**
   * HTML escape helper
   */
  private escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, char => map[char] || char);
  }

  /**
   * Generate error HTML
   */
  private getErrorHtml(message: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>USV Preview - Error</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background-color: var(--vscode-editor-background);
      color: var(--vscode-editor-foreground);
      padding: 40px;
    }
    .error {
      padding: 20px;
      background-color: var(--vscode-inputValidation-errorBackground);
      color: var(--vscode-inputValidation-errorForeground);
      border: 1px solid var(--vscode-inputValidation-errorBorder);
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .error-icon {
      font-size: 24px;
    }
  </style>
</head>
<body>
  <div class="error">
    <span class="error-icon">⚠️</span>
    <span>${this.escapeHtml(message)}</span>
  </div>
</body>
</html>
    `;
  }
}
