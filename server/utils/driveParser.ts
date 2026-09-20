/**
 * Google Drive URL Parser & Direct Streamable Link Generator
 * Converts various Google Drive share URLs into direct CDN streaming endpoints.
 */

export interface ParsedDriveLink {
  isDriveLink: boolean;
  fileId: string | null;
  directUrl: string;
  fallbackUrl: string | null;
}

export function parseGoogleDriveLink(inputUrl: string): ParsedDriveLink {
  if (!inputUrl) {
    return {
      isDriveLink: false,
      fileId: null,
      directUrl: '',
      fallbackUrl: null,
    };
  }

  const trimmed = inputUrl.trim();

  // Common Google Drive link formats:
  // 1. https://drive.google.com/file/d/1A2B3C4D5E.../view?usp=sharing
  // 2. https://drive.google.com/open?id=1A2B3C4D5E...
  // 3. https://drive.google.com/uc?id=1A2B3C4D5E...
  // 4. https://drive.google.com/thumbnail?id=1A2B3C4D5E...
  // 5. Direct file ID (33 alphanumeric characters with - or _)
  
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]{20,})/);
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]{20,})/);
  const directIdMatch = trimmed.match(/^[a-zA-Z0-9_-]{25,45}$/);

  const fileId = fileDMatch?.[1] || idParamMatch?.[1] || directIdMatch?.[0] || null;

  if (fileId) {
    // lh3.googleusercontent.com is Google's high-speed CDN endpoint for direct public image streaming
    const directUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
    const fallbackUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

    return {
      isDriveLink: true,
      fileId,
      directUrl,
      fallbackUrl,
    };
  }

  // Not a recognizable Drive URL; return original input URL (supports standard CDNs like Unsplash, etc.)
  return {
    isDriveLink: false,
    fileId: null,
    directUrl: trimmed,
    fallbackUrl: null,
  };
}
