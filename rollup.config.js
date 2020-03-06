import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import json from '@rollup/plugin-json';
import sourceMaps from 'rollup-plugin-sourcemaps';
import pkg from './package.json';
import {DEFAULT_EXTENSIONS} from "@babel/core";
import typescript from "rollup-plugin-typescript2";

const cjs = {
    exports: 'named',
    format: 'cjs',
    sourcemap: true,
};

const esm = {
    format: 'esm',
    sourcemap: true,
};

const getCJS = override => ({...cjs, ...override});
const getESM = override => ({...esm, ...override});

const commonPlugins = [
    typescript(),
    sourceMaps(),
    json(),
    nodeResolve(),
    babel({
        exclude: ['node_modules/**'],
        include: [...DEFAULT_EXTENSIONS, '.ts', '.tsx']
    }),
    commonjs()
];

const configBase = {
    input: './src/index.ts',

    // \0 is rollup convention for generated in memory modules
    plugins: commonPlugins,
    external: [
        ...Object.keys(pkg.devDependencies || {})
    ]
};

const serverConfig = {
    ...configBase,
    output: [
        getESM({file: 'dist/rememer.esm.js'}),
        getCJS({file: 'dist/rememer.cjs.js'}),
    ],
    plugins: configBase.plugins
};

const browserConfig = {
    ...configBase,
    output: [
        getESM({file: 'dist/rememer.browser.esm.js'}),
        getCJS({file: 'dist/rememer.browser.cjs.js'}),
    ],
    plugins: configBase.plugins
};

export default [
    serverConfig,
    browserConfig
];
