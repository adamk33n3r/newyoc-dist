"use strict";
const moment = require("moment");
const b = '01/4/1992';
const date = moment(b, [
    'MM/DD/YYYY',
    'MM/DD',
]);
const now = moment();
date.year(now.year());
const result = date.isSame(now, 'day');
