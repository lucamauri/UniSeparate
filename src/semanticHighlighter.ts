import * as vscode from 'vscode';
import { CsvToUsvConverter } from './converter';

export class UsvSemanticHighlighter {
  private decorations: Map<string, vscode.TextEditorDecorationType> = new Map();
  private colorPalette = [
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

  constructor(private context: vscode.ExtensionContext) {
    this.createDecorations();
  }

  /**
   * Create decoration types for each color
   */
  private createDecorations(): void {
    for (let i = 0; i < this.colorPalette.length; i++) {
      const color = this.colorPalette[i];
      const decoration = vscode.window.createTextEditorDecorationType({
        color: color,
        fontWeight: '500'
      });
      this.decorations.set(`col-${i}`, decoration);
      this.context.subscriptions.push(decoration);
    }
  }

  /**
   * Get color index for a column (cycles through palette)
   */
  private getColorIndex(columnIndex: number): number {
    return columnIndex % this.colorPalette.length;
  }

  /**
   * Apply semantic highlighting to USV file
   */
  public highlightEditor(editor: vscode.TextEditor): void {
    if (editor.document.languageId !== 'usv') {
      return;
    }

    try {
      const content = editor.document.getText();
      const UNIT_SEP = '␟';
      const RECORD_SEP = '␞';

      // Parse the USV content
      const records = content.split(RECORD_SEP).filter(r => r.length > 0);

      if (records.length === 0) {
        return;
      }

      // Clear all previous decorations
      this.decorations.forEach(decoration => {
        editor.setDecorations(decoration, []);
      });

      // Get maximum number of fields (columns)
      let maxColumns = 0;
      records.forEach(record => {
        const fieldCount = record.split(UNIT_SEP).length;
        maxColumns = Math.max(maxColumns, fieldCount);
      });

      // Create range arrays for each column
      const columnRanges: vscode.Range[][] = Array(maxColumns).fill(null).map(() => []);

      // Process each record
      let currentPos = 0;
      records.forEach((record, recordIndex) => {
        const fields = record.split(UNIT_SEP);

        fields.forEach((field, fieldIndex) => {
          // Find the position of this field in the document
          const fieldStartPos = editor.document.positionAt(
            content.indexOf(field, currentPos)
          );
          const fieldEndPos = new vscode.Position(
            fieldStartPos.line,
            fieldStartPos.character + field.length
          );

          columnRanges[fieldIndex].push(
            new vscode.Range(fieldStartPos, fieldEndPos)
          );

          currentPos += field.length + 1; // +1 for separator
        });

        currentPos += 1; // +1 for record separator
      });

      // Apply decorations for each column
      columnRanges.forEach((ranges, columnIndex) => {
        if (ranges.length > 0) {
          const colorIndex = this.getColorIndex(columnIndex);
          const decoration = this.decorations.get(`col-${colorIndex}`);
          if (decoration) {
            editor.setDecorations(decoration, ranges);
          }
        }
      });
    } catch (error) {
      console.log('Semantic highlight error:', error);
    }
  }
}
