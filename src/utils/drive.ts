/**
 * Frontend Google Drive Link Helper
 * Parses Google Drive links and returns high-speed embed URLs with live preview support.
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

  // Pattern matching:
  // - https://drive.google.com/file/d/1ABCXYZ.../view?usp=sharing
  // - https://drive.google.com/open?id=1ABCXYZ...
  // - https://drive.google.com/uc?id=1ABCXYZ...
  // - direct ID
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]{20,})/);
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]{20,})/);
  const directIdMatch = trimmed.match(/^[a-zA-Z0-9_-]{25,45}$/);

  const fileId = fileDMatch?.[1] || idParamMatch?.[1] || directIdMatch?.[0] || null;

  if (fileId) {
    return {
      isDriveLink: true,
      fileId,
      directUrl: `https://lh3.googleusercontent.com/d/${fileId}`,
      fallbackUrl: `https://drive.google.com/uc?export=view&id=${fileId}`,
    };
  }

  return {
    isDriveLink: false,
    fileId: null,
    directUrl: trimmed,
    fallbackUrl: null,
  };
}
