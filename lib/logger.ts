/**
 * Système de logging centralisé pour l'application
 * Remplace tous les console.log/warn/error pour un meilleur contrôle
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  private shouldLog(level: LogLevel): boolean {
    if (this.isDevelopment) return true;
    // En production, seulement warn et error
    return level === 'warn' || level === 'error';
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    return `${prefix} ${message}`;
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message), ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message), ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message), ...args);
    }
  }

  error(message: string, error?: Error | unknown, ...args: any[]): void {
    if (this.shouldLog('error')) {
      const errorMessage = error instanceof Error 
        ? `${message}\n${error.message}\n${error.stack}`
        : message;
      console.error(this.formatMessage('error', errorMessage), ...args);
      
      // En production, on pourrait envoyer les erreurs à un service de monitoring
      if (this.isProduction && error instanceof Error) {
        // TODO: Intégrer un service de monitoring (Sentry, LogRocket, etc.)
        // this.reportError(error, message);
      }
    }
  }
}

// Export singleton
export const logger = new Logger();

// Export pour compatibilité
export default logger;

