import type { PluginOption } from 'vite'
import esbuild from 'esbuild'
import path from "path";
import fs from "fs";
import * as electronBuilder from 'electron-builder'
import type { CliOptions } from 'electron-builder'


export function buildPlugin(): PluginOption {
    return {
        name: 'build-plugin',
        closeBundle() {
            function buildMain() {
                esbuild.buildSync({
                    entryPoints: ['./electron/main/index.ts'],
                    bundle: true,
                    platform: "node",
                    minify: true,
                    outfile: "./dist/main/index.js",
                    external: ["electron"],
                })
            }

            function preparePackageJson() {
                const pkgJsonParse = path.join(process.cwd(), 'package.json');
                const localPkgJson = JSON.parse(fs.readFileSync(pkgJsonParse, 'utf-8'));
                localPkgJson.main = "./main/index.js";
                delete localPkgJson.scripts;
                delete localPkgJson.devDependencies;
                delete localPkgJson.dependencies;
                const tarJsonPath = path.join(process.cwd(), "dist", "package.json");
                fs.writeFileSync(tarJsonPath, JSON.stringify(localPkgJson));
            }

            function buildInstaller() {
                const options: CliOptions = {
                    config: {
                        directories: {
                            app: path.join(process.cwd(), "dist"),
                            output: path.join(process.cwd(), "dist/release"),
                        }
                    }
                };
                electronBuilder.build(options);
            }

            buildMain();
            preparePackageJson();
            buildInstaller();
        }
    }
}