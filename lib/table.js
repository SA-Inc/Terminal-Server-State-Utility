'use strict';

const defaults = (c, b) => {
  for (let a in b) {
    b.hasOwnProperty(a) && (c[a] && typeof b[a] === 'object' ? defaults(c[a], b[a]) : c[a] = b[a]);
  }
  return c;
}

const cutColor = (s) => s.toString().replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');

const repeatStr = (width, str) => {
  str = str || ' ';
  let result = (width > 0) ? Array(Math.ceil(width / str.length) + 1).join(str) : '';
  return result.length > width ? result.substr(0, width) : result;
}

const pad = (txt, width, dir) => {
  let txtWithoutColor = cutColor(txt); // So IMPORTANT, because color text give another string length.
  let p = width - txtWithoutColor.length;
  let pL = (dir > 0) ? p : (p / 2) << 0;
  let pR = (dir < 0) ? p : pL + (p - (pL * 2));

  return p > 0 ? (dir >= 0 ? Array(pL + 1).join(' ') : '') + txt + (dir <= 0 ? Array(pR + 1).join(' ') : '') : txt;
}

const alignText = (txt, width, defaultAlignDir) => {
  txt = String(txt);

  return pad(txt, width, defaultAlignDir);

  // switch (txt.charAt(0)) {
  //   case '<':
  //     return pad(txt.substr(1), width, -1); //align left
  //   case '^':
  //     return pad(txt.substr(1), width, 0); //align center
  //   case '>':
  //     return pad(txt.substr(1), width, 1); //align right
  //   default:
  //     return pad(txt, width, defaultAlignDir);
  // }
}

const calcColumnsWidth = (matrix) => {
  //calculate columns width
  let colsWidth = [];

  for (let r = 0, rLen = matrix.length; r < rLen; r++) {
    if (!matrix[r]) {
      continue; //separator.
    }

    for (let c = 0, cLen = matrix[r].length; c < cLen; c++) {
      if (!colsWidth[c]) {
        colsWidth[c] = 0;
      }
      colsWidth[c] = Math.max(colsWidth[c], cutColor(matrix[r][c]).length);
    }
  }

  return colsWidth;
}

module.exports.table = (m, options) => {
  options = defaults({
    row: {
      paddingLeft: '|', //before first column.
      paddingRight: '|', //after last column.
      colSeparator: '|', //between each column.
      lineBreak: '\n'
    },
    cell: {
      paddingLeft: ' ',
      paddingRight: ' ',
      defaultAlignDir: -1 //left = -1; center = 0; right = 1.
    },
    hr: {
      str: '-',
      colSeparator: '+',
      paddingLeft: '+',
      paddingRight: '+'
    }
  }, options);

  let paddingLength = options.cell.paddingLeft.length + options.cell.paddingRight.length;
  let hrSeparator = repeatStr(options.row.colSeparator.length, options.hr.colSeparator || options.hr.str);
  let colsWidth = calcColumnsWidth(m);

  let table = [];

  for (let r = 0, rLen = m.length; r < rLen; r++) {
    let cols = [];

    if (m[r]) { // columns.
      for (let c = 0; c < colsWidth.length; c++) {
        cols.push(options.cell.paddingLeft + alignText(m[r][c], colsWidth[c], options.cell.defaultAlignDir) + options.cell.paddingRight);
      }
      table.push([options.row.paddingLeft, cols.join(options.row.colSeparator), options.row.paddingRight].join(''));
    } else { // horizontal line.
      for (let c = 0; c < colsWidth.length; c++) {
        cols.push(repeatStr(colsWidth[c] + paddingLength, options.hr.str));
      }
      table.push([options.hr.paddingLeft, cols.join(hrSeparator), options.hr.paddingRight].join(''));
    }
  }
  return table.join(options.row.lineBreak);
}
