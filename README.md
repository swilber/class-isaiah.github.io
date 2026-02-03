# Isaiah Study Guide

A comprehensive 12-week verse-by-verse study of the Book of Isaiah for men's groups, combining scholarly commentary, historical context, and practical application.

## Overview

This interactive web application provides a structured approach to studying Isaiah, integrating:
- **Verse-by-verse exegesis** with J. Alec Motyer's commentary
- **Video lectures** from Dr. John Oswalt (30 sessions)
- **Historical context** with color-coded geopolitical timelines
- **Archaeological imagery** from museums and historical sources
- **Discussion questions** for group engagement
- **Printable study guides** for each week

## Features

### 📚 Study Structure
- **12 weeks** covering all 66 chapters of Isaiah
- **Three-part framework**: Judgment/Hope (chs. 1-39), Comfort/Servant (chs. 40-55), Ethics/New Creation (chs. 56-66)
- **Preparation checklists** with reading assignments and video lectures
- **Commentary questions** highlighting expert insights (Hebrew linguistics, ANE background, theological connections)

### 🗺️ Historical Context
Each week includes color-coded geopolitical information:
- **Judah** (green) - Southern Kingdom rulers and status
- **Israel** (purple) - Northern Kingdom rulers and status
- **Assyria** (red) - Dominant empire 740-681 BC
- **Babylon** (brown) - Rising power, dominant 586-539 BC
- **Persia** (blue) - Liberator empire 539+ BC
- **Egypt** (gold) - Regional power and unreliable ally
- **Major Players** - Key named individuals (prophets, priests, commanders)

### 🖼️ Visual Resources
- Archaeological artifacts and historical imagery
- Maps showing empires, exile routes, and restoration
- Museum-quality images with descriptions and usage notes
- Sources include British Museum, Met Museum, Wikimedia Commons

### 📝 Question Types
1. **Source Questions** - Direct from Isaiah text
2. **Commentary Questions** - From Oswalt's lectures with timestamps
3. **Application Questions** - Personal and group reflection

### 🖨️ Print-Friendly
- Printable study guides for each week
- Answer spaces for group discussion
- Clean formatting for physical distribution

## Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Data**: JSON-based study content
- **Hosting**: GitHub Pages
- **No build process** - runs directly in browser

## Getting Started

### Online Access
Visit the live application: [https://swilber.github.io/class-isaiah.github.io/](https://swilber.github.io/class-isaiah.github.io/)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/swilber/class-isaiah.github.io.git
   cd class-isaiah.github.io
   ```

2. **Start a local web server**
   ```bash
   python3 -m http.server 8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

   > **Note**: A web server is required due to CORS restrictions when loading JSON files.

## Project Structure

```
.
├── index.html              # Main application entry point
├── app.js                  # Application logic and rendering
├── style.css               # Styling and responsive design
├── resources/
│   ├── study.json          # Complete study content and data
│   ├── oswalt/             # Dr. Oswalt's lecture PDFs and transcripts
│   └── motyer/             # J. Alec Motyer's commentary PDFs
└── README.md               # This file
```

## Study Materials

### Required Resources
1. **Blue Letter Bible** - Free online Bible study tools
   - [https://www.blueletterbible.org/](https://www.blueletterbible.org/)

2. **The Prophecy of Isaiah** by J. Alec Motyer
   - Primary commentary for verse-by-verse exegesis
   - [Amazon Link](https://www.amazon.com/Prophecy-Isaiah-Introduction-Commentary/dp/0830814248)

3. **Dr. John Oswalt Video Lectures** (30 sessions)
   - Available on YouTube
   - Links provided in each week's preparation section

### Optional Resources
- Michael Heiser's Naked Bible Podcast episodes on Isaiah
- Bob Deffinbaugh's sermon series on Isaiah
- BibleProject videos and podcasts

## Historical Timeline

The study covers these major periods:

- **740-701 BC** (Weeks 2-7): Isaiah's early ministry, Assyrian dominance
  - Kings: Uzziah, Jotham, Ahaz, Hezekiah
  - Events: Syro-Ephraimite War, Fall of Israel (722 BC), Sennacherib's siege (701 BC)

- **586-539 BC** (Weeks 8-9): Babylonian Exile
  - Kings: Nebuchadnezzar II, Nabonidus, Belshazzar
  - Events: Jerusalem destroyed (586 BC), Babylon falls to Persia (539 BC)

- **539-400 BC** (Weeks 10-12): Post-Exilic Restoration
  - Kings: Cyrus II, Darius I, Artaxerxes I
  - Events: Return from exile, Temple rebuilt (520-516 BC), Walls rebuilt (445 BC)

## Key Themes

1. **God's Holiness** - The Holy One of Israel (used 25+ times)
2. **Judgment and Hope** - Covenant consequences and restoration promises
3. **The Servant** - Both corporate Israel and individual Messiah
4. **Messianic Prophecy** - Virgin birth (7:14), Suffering Servant (ch. 53), New Creation (chs. 65-66)
5. **Universal Salvation** - Nations included in God's redemptive plan
6. **Faith vs. Politics** - Trusting God over foreign alliances

## Messianic Fulfillment

Isaiah's prophecies fulfilled in Jesus Christ:
- **7:14** - Virgin birth (Matthew 1:23)
- **9:6-7** - Wonderful Counselor, Mighty God, Prince of Peace
- **11:1-10** - Branch from Jesse, Spirit-filled ruler
- **42:1-9** - Servant bringing justice to nations (Matthew 12:18-21)
- **53:1-12** - Suffering Servant's atonement (Acts 8:32-35)
- **61:1-3** - Anointed One proclaiming liberty (Luke 4:18-21)

## Contributing

This is a study resource for a specific men's group. If you'd like to adapt it for your own use:

1. Fork the repository
2. Modify `resources/study.json` with your content
3. Update images and resources as needed
4. Deploy to your own GitHub Pages or hosting service

## Data Structure

The `study.json` file contains:
- Course summary and study approach
- Study materials with links
- 12 weeks of content, each with:
  - Title and summary
  - Geopolitical context (rulers, dates, descriptions)
  - Images with descriptions and sources
  - Preparation checklist
  - Optional resources
  - Source, commentary, and application questions
  - Key points

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Modern mobile browsers

## License

Study content compiled for educational purposes. Individual resources (commentaries, videos, images) retain their original copyrights and licenses.

## Acknowledgments

- **J. Alec Motyer** - Primary commentary source
- **Dr. John Oswalt** - Video lecture series providing expert insights
- **Dr. Michael Heiser** - Supplementary teaching on divine council and ANE context
- **Museums** - British Museum, Metropolitan Museum of Art for historical imagery
- **Wikimedia Commons** - Public domain historical images

## Contact

For questions about this study guide, please open an issue on GitHub.

---

*"Come now, let us reason together, says the LORD: though your sins are like scarlet, they shall be as white as snow; though they are red like crimson, they shall become like wool." - Isaiah 1:18*
