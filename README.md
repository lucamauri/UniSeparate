# UniSeparate - USV Data Editor

A VS Code extension for working with **Unicode Separated Values (USV)** files with ease. Convert between CSV and USV formats, with real-time syntax highlighting and intelligent file management.

![VS Code](https://img.shields.io/badge/VS%20Code-1.85.0+-007ACC?logo=visual-studio-code)
![License](https://img.shields.io/badge/license-GPL--2.0--or--later-green)
![Status](https://img.shields.io/badge/status-Active-brightgreen)
[![CI Status](https://github.com/lucamauri/uniseparate/actions/workflows/ci.yml/badge.svg)](https://github.com/lucamauri/uniseparate/actions/workflows/ci.yml)
[![Publish Status](https://github.com/lucamauri/uniseparate/actions/workflows/publish.yml/badge.svg)](https://github.com/lucamauri/uniseparate/actions/workflows/publish.yml)
[![VS Code Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/lucamauri.uniseparate)](https://marketplace.visualstudio.com/items?itemName=lucamauri.uniseparate)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/lucamauri.uniseparate)](https://marketplace.visualstudio.com/items?itemName=lucamauri.uniseparate)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.x-brightgreen)](package.json)


## ✨ Features

### Syntax Highlighting
- Clean syntax highlighting for USV files
- Support for `.usv`, `.usx`, and `.uss` file extensions
- Real-time highlighting as you edit

### Format Conversion
- **Convert CSV ↔ USV** with a single command
- Create conversions in new files or replace current file
- Handles quoted fields, escaped quotes, and edge cases
- Robust CSV parser supporting RFC 4180 standard
- Smart error detection and helpful error messages

### Status Bar Integration
- **Real-time file statistics** (rows × columns)
- **One-click conversion** from status bar
- Automatic updates as you edit
- Quick access without opening command palette

### Smart File Saving
- Quick save with correct file extension (`.usv` or `.csv`)
- Suggested filename based on current file
- File extension filters in save dialog
- Workspace-aware file operations

### USV Preview
- **View USV files as formatted tables** in a side panel
- Column-based color coding for easy data tracking
- Real-time statistics (rows, columns, file size)
- Professional table rendering with hover effects

### Robust Error Handling
- Detailed error messages with helpful hints
- Validation for empty files and malformed data
- Line-by-line quote mismatch detection
- Clear feedback on conversion success/failure

## 🚀 Getting Started

### Installation

1. Open **VS Code**
2. Go to **Extensions** (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for **"UniSeparate"**
4. Click **Install**

### Basic Usage

#### Convert CSV to USV

1. Open a CSV file in VS Code
2. Open **Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`)
3. Select **"Convert CSV to USV"**
4. Choose one of:
   - **"Convert CSV to USV"** - overwrites the current file
   - **"Convert CSV to USV (New File)"** - creates a new USV file

**Quick method**: Click the statistics display in the **status bar** (bottom-right) for instant conversion to new file.

#### Convert USV to CSV

Same process in reverse:
1. Open a USV file
2. Run **"Convert USV to CSV"** or **"Convert USV to CSV (New File)"**

#### View USV as Table

1. Open a USV file
2. Right-click → **"Open USV Preview"**
3. A new panel appears showing the data as a formatted table
4. Each column is color-coded for easy visual tracking

#### Save with Correct Extension

1. Run **"Save As USV File"** or **"Save As CSV File"** from Command Palette
2. A save dialog appears with the correct extension suggestion
3. Choose location and save

#### Right-Click Context Menu

All conversion commands are available via **right-click context menu** in the editor:
- Right-click in a CSV file → See CSV-to-USV options
- Right-click in a USV file → See USV-to-CSV options

## 📋 Commands Reference

| Command | Description |
|---------|-------------|
| **Convert CSV to USV** | Replace current CSV file with USV format |
| **Convert CSV to USV (New File)** | Create new USV file from current CSV |
| **Convert USV to CSV** | Replace current USV file with CSV format |
| **Convert USV to CSV (New File)** | Create new CSV file from current USV |
| **Save As USV File** | Save current file as `.usv` with extension suggestion |
| **Save As CSV File** | Save current file as `.csv` with extension suggestion |
| **Open USV Preview** | Display USV file as a formatted table in side panel |

**Access commands via:**
- Command Palette: `Ctrl+Shift+P` / `Cmd+Shift+P` → type command name
- Right-click context menu in editor
- Status bar: Click statistics display

## 📚 About USV (Unicode Separated Values)

USV is a modern, hierarchical data format that solves CSV limitations:

### Why USV?

- **Visible Separators**: Uses printable Unicode characters (␟ ␞ ␝ ␜) instead of invisible control characters
- **Hierarchical Structure**: Supports 4 levels of data organization (units, records, groups, files)
- **Unambiguous**: No escaping needed for commas, quotes, or newlines within data
- **Standardized**: Pursuing IETF RFC and IANA registration
- **Human-Readable**: Separators are visible in text editors

### Separator Characters

| Character | Name | Unicode | Purpose |
|-----------|------|---------|---------|
| ␟ | Unit Separator | U+241F | Separates fields/cells |
| ␞ | Record Separator | U+241E | Separates rows/records |
| ␝ | Group Separator | U+241D | Separates tables/groups |
| ␜ | File Separator | U+241C | Separates files/documents |

### Learn More
- [GitHub - SixArm/usv](https://github.com/SixArm/usv) - Official USV project
- [IETF Draft - Unicode Separated Values](https://www.ietf.org/archive/id/draft-unicode-separated-values-01.html) - RFC proposal

## 💡 Examples

### CSV Format
```csv
Name,Age,City
Alice,28,New York
Bob,35,Los Angeles
Charlie,42,Chicago
```

### Equivalent USV Format
```
Name␟Age␟City␞Alice␟28␟New York␞Bob␟35␟Los Angeles␞Charlie␟42␟Chicago
```

### CSV with Quoted Fields (Commas in Data)
```csv
Name,Address,Phone
Alice,"123 Main St, Apt 4",555-0123
Bob,"456 Oak Ave, Suite B",555-0456
```

### Equivalent USV (No Escaping Needed!)
```
Name␟Address␟Phone␞Alice␟123 Main St, Apt 4␟555-0123␞Bob␟456 Oak Ave, Suite B␟555-0456
```

## 🔧 Troubleshooting

### "No USV separators found"
- Ensure the file actually contains USV separator characters (␟ ␞ ␝ ␜)
- If you pasted from plain text, the separators may not have copied correctly
- Check that you're opening a genuine USV file

### "Unclosed quote at line X"
- Your CSV has a quotation mark (`"`) that isn't properly closed
- Check the specified line number for mismatched or unescaped quotes
- Verify all quoted fields have matching opening and closing quotes

### Syntax highlighting not appearing
- The highlighting is working; colors depend on your VS Code theme
- Try switching to a different theme to see the effect (Settings → Color Theme)
- Some themes don't define colors for all scope names

### Conversion produces unexpected results
- Verify your input file is valid CSV or USV
- Try the "New File" option to see results without overwriting
- Check the status bar statistics to verify row/column counts

### File not saved after conversion
- Conversions modify the file in the editor but don't auto-save
- Use `Ctrl+S` / `Cmd+S` or "Save As" commands to persist changes
- Enable "Auto Save" in VS Code settings if desired

### Preview table not rendering
- Ensure the USV file has valid data with separators
- The file must contain at least one record separator (␞)
- Check the browser console (F12) for JavaScript errors

## 🤝 Contributing

Contributions are welcome! This extension is part of the USV ecosystem and aligns with the [SixArm/usv](https://github.com/SixArm/usv) project goals.

### How to Contribute

1. **Fork** the repository on GitHub
2. **Create a branch** for your feature (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Setup

```bash
# Clone the repository
git clone https://github.com/lucamauri/UniSeparate.git
cd uniseparate

# Install dependencies
npm install

# Run in debug mode
npm run compile
# Then press F5 in VS Code
```

### Areas for Contribution

- [ ] Field-based syntax coloring in editor
- [ ] Support for Group (␝) and File (␜) separators in conversions
- [ ] Interactive preview of conversions before applying
- [ ] Batch file conversion utilities
- [ ] Performance optimization for large files
- [ ] Additional file format support (JSON, XML, Parquet)
- [ ] Internationalization (i18n) support
- [ ] Additional test coverage
- [ ] Documentation improvements

## 🐛 Bug Reports

Found an issue? [Report it on GitHub](https://github.com/lucamauri/UniSeparate/issues)

Please include:
- VS Code version
- Extension version
- Steps to reproduce
- Example file (if applicable)
- Expected vs. actual behavior

## 📄 License

This project is licensed under the **GNU General Public License v2.0 or later (GPL-2.0-or-later)**.

This means:
- You are free to use, modify, and distribute this software
- Any modifications must also be released under GPL-2.0-or-later
- The source code must be made available to users
- See the [LICENSE](LICENSE) file for full details

For more information about GPL-2.0, visit: [GNU GPL v2.0](https://www.gnu.org/licenses/old-licenses/gpl-2.0.html)

## 🙏 Acknowledgments

- **[SixArm/usv](https://github.com/SixArm/usv)** - USV format specification and reference implementation
- **VS Code Extension API** - Excellent documentation and examples
- **USV Community** - For standardizing this powerful data format
- **Contributors** - Thank you for helping improve UniSeparate!

## 📊 Project Status

| Component | Status |
|-----------|--------|
| CSV ↔ USV Conversion | ✅ Complete |
| Syntax Highlighting | ✅ Complete |
| Status Bar Integration | ✅ Complete |
| Command Palette Integration | ✅ Complete |
| Context Menu | ✅ Complete |
| USV Preview (Table View) | ✅ Complete |
| Error Handling | ✅ Complete |
| Field-based Syntax Coloring | 🔄 In Progress |
| Group/File Separator Support | 📋 Planned |
| Batch Conversion | 📋 Planned |
| Settings/Preferences | 📋 Planned |

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/lucamauri/UniSeparate/issues)
- **Discussions**: [Join community discussions](https://github.com/lucamauri/UniSeparate/discussions)
- **Documentation**: Comprehensive help in this README
- **USV Project**: [Visit SixArm/usv for format details](https://github.com/SixArm/usv)

---

**Made with ❤️ for the USV community**

*UniSeparate - Making hierarchical data editing simple, visible, and standardized.*
