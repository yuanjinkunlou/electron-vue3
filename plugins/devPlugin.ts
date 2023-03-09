import type { PluginOption } from 'vite'
import esbuild from 'esbuild'
import { spawn } from 'node:child_process'
import type { AddressInfo } from 'node:net'
import electron from 'electron'

interface Options {
    entry: string,
    outfile: string
}

export function devPlugin(ops: Options): PluginOption {

    const { entry, outfile } = ops;

    return {
        name: 'dev-plugin',
        configureServer(server) {
            esbuild.buildSync({
                entryPoints: [entry],
                bundle: true,
                platform: 'node',
                outfile,
                external: ["electron"]
            })

            if (server.httpServer) {
                server.httpServer.once("listening", () => {
                    const addressInfo = server.httpServer.address() as AddressInfo;
                    const httpAddress = `http://localhost:${addressInfo.port}`;
                    const electronProcess = spawn(electron.toString(), [outfile, httpAddress], {
                        cwd: process.cwd(),
                        stdio: 'inherit'
                    });
                    electronProcess.on('close', () => {
                        server.close();
                        process.exit();
                    })
                })
            }
        },
    }
}

export function getReplacer() {
    const externalModels = ["os", "fs", "path", "events", "child_process", "crypto", "http", "buffer", "url", "better-sqlite3", "knex"];
    let result = {};

    externalModels.forEach(item => {
        result[item] = () => ({
            find: new RegExp(`^${item}$`),
            code: `const ${item} = require('${item}');export { ${item} as default }`,
        });
    })

    result["electron"] = () => {
        const electronModules = ["clipboard", "ipcRenderer", "nativeImage", "shell", "webFrame"].join(",");
        return {
            find: new RegExp(`^electron$`),
            code: `const {${electronModules}} = require('electron');export {${electronModules}}`,
        };
    };
    return result;
}