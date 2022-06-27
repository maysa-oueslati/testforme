import { useMemo } from 'react';
import * as loglevel from 'loglevel';
import prefix from 'loglevel-plugin-prefix';
import { Chalk } from 'chalk';
const colors = new Chalk({ level: 1 });

const levelColors = {
  TRACE: colors.magenta,
  DEBUG: colors.cyan,
  INFO: colors.blue,
  WARN: colors.yellow,
  ERROR: colors.red,
};
prefix.reg(loglevel);
loglevel.enableAll();

prefix.apply(loglevel, {
  format(level, name, timestamp) {
    return `${colors.gray(`[${timestamp}]`)} ${levelColors[level.toUpperCase()](
      level,
    )} ${colors.green.bold(`${name}:`)}`;
  },
});

prefix.apply(loglevel.getLogger('critical'), {
  format(level, name, timestamp) {
    return colors.red.bold(`[${timestamp}] ${level} ${name}:`);
  },
});

if (process.env.NODE_ENV !== 'production') {
  loglevel.setLevel('debug');
} else {
  loglevel.setLevel('error');
}

export default function useLogger(name) {
  const logger = useMemo(() => {
    return loglevel.getLogger(name);
  }, [name]);
  return logger;
}
