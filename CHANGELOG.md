# Changelog

All notable changes to the UniSeparate project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-05

### Added
- Logo and icons

## [1.0.0] - 2025-11-02

### Added

#### Core Conversion Features
- CSV to USV conversion with full support for quoted fields and escaped quotes
- USV to CSV conversion with automatic re-quoting of complex fields
- Bidirectional conversion between CSV and USV formats
- RFC 4180 compliant CSV parsing
- Support for multiple file extensions: `.usv`, `.usx`, `.uss`

#### User Interface
- Status bar widget displaying real-time file statistics (rows × columns)
- One-click conversion from status bar for quick workflows
- Right-click context menu integration for all conversion commands
- Command Palette integration with 7 available commands
- Visual feedback with green (✅) and red (❌) emoji indicators
- Progress indicators for conversion operations

#### Preview & Visualization
- USV Preview feature - display USV files as formatted tables in a side panel
- Column-based color coding in preview for visual data tracking
- Real-time statistics display (rows, columns, file size)
- Responsive table design with hover effects
- Professional styling that respects VS Code theme colors

#### File Management
- "Save As" commands with intelligent extension suggestions
- File dialog filters for USV and CSV formats
- Workspace-aware file operations
- Automatic filename generation based on source file

#### Error Handling & Validation
- Comprehensive input validation (empty files, malformed data)
- Line-by-line quote mismatch detection with error reporting
- Detailed error messages with helpful hints for users
- USV separator validation before conversion
- Safe field trimming and data processing

#### Syntax Highlighting
- Language support for USV format
- Syntax highlighting configuration for USV files
- Language configuration for editor behavior (comments, brackets)
- Support for three file extensions: `.usv`, `.usx`, `.uss`

### Features

#### Conversion Commands (7 total)
1. **Convert CSV to USV** - Replace current file with USV format
2. **Convert CSV to USV (New File)** - Create new USV file in current editor
3. **Convert USV to CSV** - Replace current file with CSV format
4. **Convert USV to CSV (New File)** - Create new CSV file in current editor
5. **Save As USV File** - Save current file with `.usv` extension
6. **Save As CSV File** - Save current file with `.csv` extension
7. **Open USV Preview** - Display USV file as formatted table

#### Statistics & Monitoring
- Real-time row and column counting
- File size calculation (in KB)
- Automatic status bar updates on file change
- Conversion statistics displayed in success messages

### Documentation

- Comprehensive README.md with installation and usage instructions
- Examples of CSV vs USV format
- Troubleshooting guide with common issues and solutions
- About USV section explaining the format and its advantages
- Contributing guidelines for open-source development
- Professional acknowledgments and project status

### Project Setup

- GPL-2.0-or-later license for open-source distribution
- `.gitignore` for clean Git repository
- `.vscodeignore` for optimized marketplace package
- TypeScript configuration for development
- Language configuration for editor behavior
- TextMate grammar for syntax highlighting

### Testing

- Manual testing of all conversion scenarios
- CSV edge cases: quoted fields, escaped quotes, newlines in data
- Empty file and error condition handling
- Status bar auto-update on file change
- Preview rendering with various USV structures
- Cross-platform compatibility (Windows, macOS, Linux)

### Known Limitations

- Field-based syntax coloring in editor not yet implemented (planned for v1.1.0)
- Group (␝) and File (␜) separator support limited to parsing (full feature planned for v1.1.0)
- Semantic highlighter created but not activated (requires refinement)

## Roadmap

### v1.1.0 (Planned)
- [ ] Field-based syntax coloring in editor (different color per column)
- [ ] Full support for Group (␝) and File (␜) separators
- [ ] Interactive conversion preview before applying
- [ ] Settings/preferences panel
- [ ] Theme customization options

### v1.2.0 (Planned)
- [ ] Batch file conversion utilities
- [ ] Performance optimization for files >10MB
- [ ] Additional file format support (JSON, XML, Parquet)
- [ ] Internationalization (i18n) support

### v1.3.0 (Planned)
- [ ] Advanced data validation and sanitization
- [ ] CSV dialect detection and customization
- [ ] Data transformation pipelines
- [ ] Export to additional formats

## [Unreleased]

### In Development
- Field-based semantic highlighting for improved readability
- Extended separator support for hierarchical data

---

## Version Details

### Dependencies
- VS Code Engine: ^1.85.0
- Node.js: 16.x or later
- TypeScript: 4.x or later

### File Structure
```
uniseparate/
├── src/
│   ├── extension.ts           - Main extension entry point
│   ├── converter.ts           - CSV/USV conversion logic
│   ├── usvPreviewProvider.ts  - Table preview rendering
│   └── semanticHighlighter.ts - (Prepared for v1.1.0)
├── syntaxes/
│   └── usv.tmLanguage.json    - TextMate grammar definition
├── language-configuration.json - Editor behavior configuration
├── package.json               - Extension metadata
├── README.md                  - User documentation
├── LICENSE                    - GPL-2.0-or-later
├── CHANGELOG.md               - This file
├── .gitignore                 - Git ignore rules
├── .vscodeignore              - Marketplace packaging rules
└── tsconfig.json              - TypeScript configuration
```

### Metrics
- **Lines of Code**: ~1,500+ (excluding node_modules)
- **Commands**: 7 integrated commands
- **Supported Formats**: 2 (CSV, USV)
- **File Extensions**: 3 (.usv, .usx, .uss)
- **Error Scenarios Handled**: 10+

---

## Contributors

### v1.0.0 Release
- Initial development and implementation
- Feature testing and refinement
- Documentation creation

---

## Links

- **GitHub Repository**: https://github.com/lucamauri/uniseparate
- **VS Code Marketplace**: https://marketplace.visualstudio.com/items?itemName=lucamauri.uniseparate
- **USV Specification**: https://github.com/SixArm/usv
- **Issue Tracker**: https://github.com/lucamauri/uniseparate/issues
- **Discussions**: https://github.com/lucamauri/uniseparate/discussions

---

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/lucamauri/uniseparate).

Report bugs via [GitHub Issues](https://github.com/lucamauri/uniseparate/issues).

---

## License

UniSeparate is released under the [GNU General Public License v2.0 or later](LICENSE).

---

**Last Updated**: November 2, 2025
**Current Version**: 1.0.0
**Status**: Released ✅
