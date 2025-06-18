export class TextService {
  static trimAllSpaces(text: string) {
    return text?.replace(/\s+/g, '') || '';
  }

  static upperCaseFirst(text: string) {
    return (text?.charAt(0).toUpperCase() || '') + (text?.slice(1) || '');
  }
}
