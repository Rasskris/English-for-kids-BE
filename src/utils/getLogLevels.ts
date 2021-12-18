import { LogLevel } from '@nestjs/common/services/logger.service';

export const getLogLevels = (isProduction: boolean): LogLevel[] => {
  return isProduction ? ['log', 'warn', 'error'] : ['error', 'warn', 'log', 'verbose', 'debug'];
};
