import { JWT, COUNT_SECONDS_IN_HOUR } from '../../constants';

export const mokedConfigService = {
  get(key: string) {
    switch (key) {
      case JWT.EXPIRATION_TIME:
        return COUNT_SECONDS_IN_HOUR;
    }
  },
};
