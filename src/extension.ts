import * as vscode from 'vscode';
import { CsvToUsvConverter } from './converter';
import { UsvPreviewProvider } from './usvPreviewProvider';

export function activate(context: vscode.ExtensionContext) {
  console.log('UniSeparate extension is now active!');
  // ============================================
  // PREVIEW PROVIDER SETUP
  // ============================================
  const previewProvider = new UsvPreviewProvider();

  // ============================================
  // COMMAND REGISTRATIONS
  // ============================================

  // Command 1: Convert CSV to USV (replace)
  const convertCsvToUsvCommand = vscode.commands.registerCommand(
    'uniseparate.csvToUsv',
    async () => {
      await handleCsvToUsv(false);
    }
  );

  // Command 2: Convert CSV to USV (new file)
  const convertCsvToUsvNewCommand = vscode.commands.registerCommand(
    'uniseparate.csvToUsvNew',
    async () => {
      await handleCsvToUsv(true);
    }
  );

  // Command 3: Convert USV to CSV (replace)
  const convertUsvToCsvCommand = vscode.commands.registerCommand(
    'uniseparate.usvToCsv',
    async () => {
      await handleUsvToCsv(false);
    }
  );

  // Command 4: Convert USV to CSV (new file)
  const convertUsvToCsvNewCommand = vscode.commands.registerCommand(
    'uniseparate.usvToCsvNew',
    async () => {
      await handleUsvToCsv(true);
    }
  );

  // Command 5: Save As USV
  const saveAsUsvCommand = vscode.commands.registerCommand(
    'uniseparate.saveAsUsv',
    async () => {
      await handleSaveAs('usv');
    }
  );

  // Command 6: Save As CSV
  const saveAsCsvCommand = vscode.commands.registerCommand(
    'uniseparate.saveAsCsv',
    async () => {
      await handleSaveAs('csv');
    }
  );

  // Command 7: Open USV Preview
  const openPreviewCommand = vscode.commands.registerCommand(
    'uniseparate.openPreview',
    async () => {
      await handleOpenPreview(previewProvider);
    }
  );

  // ============================================
  // ADD ALL COMMANDS TO SUBSCRIPTIONS
  // ============================================
  context.subscriptions.push(convertCsvToUsvCommand);
  context.subscriptions.push(convertCsvToUsvNewCommand);
  context.subscriptions.push(convertUsvToCsvCommand);
  context.subscriptions.push(convertUsvToCsvNewCommand);
  context.subscriptions.push(saveAsUsvCommand);
  context.subscriptions.push(saveAsCsvCommand);
  context.subscriptions.push(openPreviewCommand);

  // ============================================
  // STATUS BAR SETUP
  // ============================================
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.name = 'UniSeparate Stats';
  context.subscriptions.push(statusBarItem);

  // Update status bar when editor changes
  const updateStatusBar = () => {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      statusBarItem.hide();
      return;
    }

    const langId = editor.document.languageId;

    // Only show for CSV and USV files
    if (langId !== 'csv' && langId !== 'usv') {
      statusBarItem.hide();
      return;
    }

    try {
      const content = editor.document.getText();
      const stats = CsvToUsvConverter.getStatistics(
        content,
        langId as 'csv' | 'usv'
      );

      if (langId === 'csv') {
        statusBarItem.text = `📊 CSV: ${stats.rows} rows × ${stats.columns} cols | $(arrow-right) USV`;
        statusBarItem.command = 'uniseparate.csvToUsvNew';
        statusBarItem.tooltip = 'Click to convert CSV to USV (new file)';
      } else {
        statusBarItem.text = `📊 USV: ${stats.rows} rows | $(arrow-left) CSV`;
        statusBarItem.command = 'uniseparate.usvToCsvNew';
        statusBarItem.tooltip = 'Click to convert USV to CSV (new file)';
      }

      statusBarItem.show();
    } catch {
      statusBarItem.hide();
    }
  };

  // Update on editor change
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(() => {
      updateStatusBar();
    })
  );

  // Update on file change (content modified)
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(() => {
      updateStatusBar();
    })
  );

  // Initial update
  updateStatusBar();
}

export function deactivate() {}

// ============================================
// COMMAND HANDLERS
// ============================================

/**
 * Handle CSV to USV conversion
 * @param createNewFile - If true, creates new file; if false, replaces current
 */
async function handleCsvToUsv(createNewFile: boolean) {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage('🔴 No file open. Please open a CSV file first.');
    return;
  }

  // Show progress indicator
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Converting CSV to USV...',
      cancellable: false
    },
    async () => {
      try {
        const csvContent = editor.document.getText();

        // Get statistics before conversion
        const statsBefore = CsvToUsvConverter.getStatistics(csvContent, 'csv');

        // Perform conversion
        const usvContent = CsvToUsvConverter.csvToUsv(csvContent);

        // Get statistics after conversion
        const statsAfter = CsvToUsvConverter.getStatistics(usvContent, 'usv');

        if (createNewFile) {
          // Create new untitled document
          const newDoc = await vscode.workspace.openTextDocument({
            language: 'usv',
            content: usvContent
          });

          // Show the new document
          await vscode.window.showTextDocument(newDoc);

          vscode.window.showInformationMessage(
            `🟢 CSV → USV: ${statsBefore.rows} rows, ${statsBefore.columns} columns converted successfully!`
          );
        } else {
          // Replace current file content
          await editor.edit(editBuilder => {
            const fullRange = new vscode.Range(
              editor.document.positionAt(0),
              editor.document.positionAt(csvContent.length)
            );
            editBuilder.replace(fullRange, usvContent);
          });

          vscode.window.showInformationMessage(
            `🟢 CSV → USV: File updated (${statsBefore.rows} rows, ${statsBefore.columns} columns)`
          );
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        vscode.window.showErrorMessage(`🔴 Conversion failed: ${errorMsg}`);
      }
    }
  );
}

/**
 * Handle USV to CSV conversion
 * @param createNewFile - If true, creates new file; if false, replaces current
 */
async function handleUsvToCsv(createNewFile: boolean) {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage('🔴 No file open. Please open a USV file first.');
    return;
  }

  // Show progress indicator
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Converting USV to CSV...',
      cancellable: false
    },
    async () => {
      try {
        const usvContent = editor.document.getText();

        // Get statistics before conversion
        const statsBefore = CsvToUsvConverter.getStatistics(usvContent, 'usv');

        // Perform conversion
        const csvContent = CsvToUsvConverter.usvToCsv(usvContent);

        // Get statistics after conversion
        const statsAfter = CsvToUsvConverter.getStatistics(csvContent, 'csv');

        if (createNewFile) {
          // Create new untitled document
          const newDoc = await vscode.workspace.openTextDocument({
            language: 'csv',
            content: csvContent
          });

          // Show the new document
          await vscode.window.showTextDocument(newDoc);

          vscode.window.showInformationMessage(
            `🟢 USV → CSV: ${statsBefore.rows} rows converted successfully!`
          );
        } else {
          // Replace current file content
          await editor.edit(editBuilder => {
            const fullRange = new vscode.Range(
              editor.document.positionAt(0),
              editor.document.positionAt(usvContent.length)
            );
            editBuilder.replace(fullRange, csvContent);
          });

          vscode.window.showInformationMessage(
            `🟢 USV → CSV: File updated (${statsBefore.rows} rows)`
          );
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        vscode.window.showErrorMessage(`🔴 Conversion failed: ${errorMsg}`);
      }
    }
  );
}

/**
 * Handle "Save As" with suggested extension
 * @param format - 'usv' or 'csv'
 */
async function handleSaveAs(format: 'usv' | 'csv') {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage('🔴 No file open.');
    return;
  }

  const currentPath = editor.document.uri.fsPath;
  const currentFileName = editor.document.fileName;
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(editor.document.uri);

  if (!workspaceFolder) {
    vscode.window.showErrorMessage('🔴 File must be in a workspace folder.');
    return;
  }

  // Generate suggested filename
  let suggestedFileName = currentFileName;

  if (format === 'usv') {
    // Replace extension with .usv
    suggestedFileName = suggestedFileName.replace(/\.[^/.]+$/, '.usv');
  } else if (format === 'csv') {
    // Replace extension with .csv
    suggestedFileName = suggestedFileName.replace(/\.[^/.]+$/, '.csv');
  }

  // Extract just the filename (no path)
  const baseName = suggestedFileName.split(/[\\/]/).pop() || `untitled.${format}`;

  // Show save dialog
  const fileUri = await vscode.window.showSaveDialog({
    defaultUri: vscode.Uri.file(`${workspaceFolder.uri.fsPath}/${baseName}`),
    filters: {
      'USV Files': ['usv'],
      'CSV Files': ['csv'],
      'All Files': ['*']
    }
  });

  if (!fileUri) {
    return; // User cancelled
  }

  // Write file
  try {
    const content = editor.document.getText();
    await vscode.workspace.fs.writeFile(fileUri, Buffer.from(content, 'utf8'));
    vscode.window.showInformationMessage(`🟢 File saved as ${fileUri.fsPath}`);
  } catch (error) {
    vscode.window.showErrorMessage(`🔴 Failed to save file: ${error}`);
  }
}

/**
 * Handle opening USV preview
 */
async function handleOpenPreview(previewProvider: UsvPreviewProvider) {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage('🔴 No file open.');
    return;
  }

  if (editor.document.languageId !== 'usv') {
    vscode.window.showErrorMessage('🔴 This command only works with USV files.');
    return;
  }

  try {
    previewProvider.openPreview(editor);
    vscode.window.showInformationMessage('🟢 USV preview opened!');
  } catch (error) {
    vscode.window.showErrorMessage(`🔴 Failed to open preview: ${error}`);
  }
}
