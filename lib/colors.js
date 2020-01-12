// Colors Module
// Ver. 1.0.0
// Saparov Arman
// S.A. Inc.
// 01/01/2019

'use strict';

class Colors {
  reset(string) {
    return `\x1b[0m${string}\x1b[0m`;
  };

  black(string) {
    return `\x1b[30m${string}\x1b[0m`;
  };

  red(string) {
    return `\x1b[31m${string}\x1b[0m`;
  };

  green(string) {
    return `\x1b[32m${string}\x1b[0m`;
  };

  yellow(string) {
    return `\x1b[33m${string}\x1b[0m`;
  };

  blue(string) {
    return `\x1b[34m${string}\x1b[0m`;
  };

  purple(string) {
    return `\x1b[35m${string}\x1b[0m`;
  };

  cyan(string) {
    return `\x1b[36m${string}\x1b[0m`;
  };

  white(string) {
    return `\x1b[37m${string}\x1b[0m`;
  };
}

module.exports = new Colors();
