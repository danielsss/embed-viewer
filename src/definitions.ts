export interface InputOptions {
  /**
   * It will list all ".xmind" file from the source directory.
   * Also it must be absolute path.
   */
  source: string;

  /**
   * Skipping the dir starts with a dot
   */
  nonStartsWithDot?: boolean;

  /**
   * The directories which will be excluded for scanning
   */
  excludes?: string[];
}

export interface OutputOptions {
  source: string;

  target: string;

  files: string[];
}