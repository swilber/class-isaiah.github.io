# Local Images Directory

This directory contains local images that can be referenced in the study.json file.

## Usage

To use a local image instead of a web URL:

1. Place your image file in this directory (`./resources/images/`)
2. In the study.json file, use just the filename (not the full path) in the `url` field

### Example:

```json
{
  "title": "My Local Image",
  "description": "Description of the image",
  "use": "How this image is used in the study",
  "source": "Local Resource",
  "url": "my-image.jpg"
}
```

### Supported Formats:
- JPG/JPEG
- PNG
- GIF
- WebP
- SVG

### Web URLs vs Local Images:
- **Web URLs**: Use full URLs starting with `http://` or `https://`
- **Local Images**: Use just the filename (e.g., `flame.png`)

The application automatically detects whether an image is local or from the web and handles the path accordingly.
