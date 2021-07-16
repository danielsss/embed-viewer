export interface ResolvedFile {
  relative: string;
  hash: string;
}
/**
 * Input options
 */
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

/**
 * The construct of Navigator
 */
export interface Properties {
  isDir: boolean;
  isIncluded: boolean;
  name: string;
  hash?: string;
  values?: Properties[];
}

/**
 * Output options
 */
export interface OutputOptions {
  source: string;

  target: string;

  files: ResolvedFile[];

  struct: Properties[];

  title?: string;

  logo?: string;
}