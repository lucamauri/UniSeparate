/**
 * CSV to USV Converter
 * Converts CSV format to Unicode Separated Values format
 */

export class CsvToUsvConverter {
  /**
   * Convert CSV string to USV string
   * @param csvContent - Raw CSV content as string
   * @returns USV formatted string
   * @throws Error if content is empty or invalid
   */
  public static csvToUsv(csvContent: string): string {
    if (!csvContent || csvContent.trim().length === 0) {
      throw new Error('Input file is empty. Please provide CSV content.');
    }

    try {
      // Parse CSV into 2D array (rows and columns)
      const rows = this.parseCsv(csvContent);

      if (rows.length === 0) {
        throw new Error('No valid data rows found in CSV.');
      }

      // Convert 2D array to USV format
      return this.arrayToUsv(rows);
    } catch (error) {
      throw new Error(`CSV parsing failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Parse CSV content into a 2D array
   * Handles quoted fields, escaped quotes, and edge cases
   */
  private static parseCsv(csvContent: string): string[][] {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentField = '';
    let insideQuotes = false;
    let lineNumber = 1;

    for (let i = 0; i < csvContent.length; i++) {
      const char = csvContent[i];
      const nextChar = csvContent[i + 1];

      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          // Escaped quote ("") becomes single quote (")
          currentField += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        // Comma outside quotes = field separator
        currentRow.push(currentField.trim());
        currentField = '';
      } else if ((char === '\n' || char === '\r') && !insideQuotes) {
        // Newline outside quotes = row separator
        if (currentField || currentRow.length > 0) {
          currentRow.push(currentField.trim());
          if (currentRow.some(field => field.length > 0)) {
            rows.push(currentRow);
          }
          currentRow = [];
          currentField = '';
        }
        if (char === '\n') {
          lineNumber++;
        }
        // Skip \r\n combination
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
      } else {
        currentField += char;
      }
    }

    // Check for unclosed quotes
    if (insideQuotes) {
      throw new Error(`Unclosed quote at line ${lineNumber}. Check your CSV formatting.`);
    }

    // Add last field and row if they exist
    if (currentField || currentRow.length > 0) {
      currentRow.push(currentField.trim());
      if (currentRow.some(field => field.length > 0)) {
        rows.push(currentRow);
      }
    }

    return rows;
  }

  /**
   * Convert 2D array to USV format
   * Uses visible Unicode separators:
   * ␟ (U+241F) = Unit Separator (between fields)
   * ␞ (U+241E) = Record Separator (between rows)
   */
  private static arrayToUsv(rows: string[][]): string {
    const UNIT_SEP = '␟';    // Field separator
    const RECORD_SEP = '␞';   // Row separator

    const usvRows = rows.map(row => row.join(UNIT_SEP));
    return usvRows.join(RECORD_SEP);
  }

  /**
   * Convert USV string back to CSV
   * @param usvContent - USV formatted string
   * @returns CSV formatted string
   * @throws Error if content is empty or invalid
   */
  public static usvToCsv(usvContent: string): string {
    if (!usvContent || usvContent.trim().length === 0) {
      throw new Error('Input file is empty. Please provide USV content.');
    }

    try {
      const UNIT_SEP = '␟';
      const RECORD_SEP = '␞';

      // Check if content actually contains USV separators
      if (!usvContent.includes(UNIT_SEP) && !usvContent.includes(RECORD_SEP)) {
        throw new Error(
          'No USV separators found. Is this really a USV file? ' +
          'USV files should contain visible separator characters (␟, ␞, ␝, ␜).'
        );
      }

      // Split by record separator to get rows
      const rows = usvContent.split(RECORD_SEP).filter(row => row.length > 0);

      if (rows.length === 0) {
        throw new Error('No valid records found in USV file.');
      }

      // Split each row by unit separator to get fields
      const csvRows = rows.map(row => {
        const fields = row.split(UNIT_SEP);
        // Quote fields that contain commas, quotes, or newlines
        return fields
          .map(field => {
            if (field.includes(',') || field.includes('"') || field.includes('\n')) {
              // Escape quotes by doubling them
              return `"${field.replace(/"/g, '""')}"`;
            }
            return field;
          })
          .join(',');
      });

      return csvRows.join('\n');
    } catch (error) {
      throw new Error(`USV parsing failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get conversion statistics
   * @param content - CSV or USV content
   * @returns Object with row and column counts
   */
  public static getStatistics(content: string, format: 'csv' | 'usv'): { rows: number; columns: number; characters: number } {
    try {
      let rows: string[][];

      if (format === 'csv') {
        rows = (this as any).parseCsv(content);
      } else {
        const UNIT_SEP = '␟';
        const RECORD_SEP = '␞';
        const rowStrings = content.split(RECORD_SEP).filter(r => r.length > 0);
        rows = rowStrings.map(row => row.split(UNIT_SEP));
      }

      const rowCount = rows.length;
      const columnCount = rows.length > 0 ? rows[0].length : 0;
      const charCount = content.length;

      return {
        rows: rowCount,
        columns: columnCount,
        characters: charCount
      };
    } catch {
      return { rows: 0, columns: 0, characters: content.length };
    }
  }
}
