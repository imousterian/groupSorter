import 'core-js/client/shim';
import 'reflect-metadata';
import 'zone.js/dist/zone';

import 'ts-helpers';

// for development
Error['stackTraceLimit'] = Infinity;
require('zone.js/dist/long-stack-trace-zone');