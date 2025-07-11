import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { resolve, join } from 'path';

const overviewDataFilename = "overview-data.json";

function collectOverviewDataFiles(dir, files = []) {
    const entries = readdirSync(dir);

    for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
            collectOverviewDataFiles(fullPath, files);
        } else if (entry == overviewDataFilename) {
            files.push(fullPath);
        }
    }

    return files;
}

function aggregateOverviewDataPlugin() {
    const routesDir = resolve("src/routes");
    const outputFile = resolve(`${routesDir}/aggregate-${overviewDataFilename}`);

    function generateAggregateJson(affectedFile) {
        if (affectedFile && !affectedFile.endsWith(overviewDataFilename))
            return;
        const aggregate = getAggregateJson();
        writeFileSync(outputFile, JSON.stringify(aggregate, null, 2));
        console.log(`Aggregated overview data written to ${outputFile}`);
    }

    function getAggregateJson() {
        const jsonFiles = collectOverviewDataFiles(routesDir);
        const aggregated = [];

        for (const file of jsonFiles) {
            const data = JSON.parse(readFileSync(file, "utf-8"));
            data.url = file.slice(routesDir.length + 1, file.length - overviewDataFilename.length - 1);
            aggregated.push(data);
        }

        return aggregated;
    }

    return {
        name: "aggregate-overview-data-plugin",
        buildStart() {
            generateAggregateJson();
        },
        configureServer(server) {
            generateAggregateJson();

            server.watcher.on("add", (file) => generateAggregateJson(file));
            server.watcher.on("change", (file) => generateAggregateJson(file));
            server.watcher.on("unlink", (file) => generateAggregateJson(file));
        }
    };
}

export default defineConfig({
    plugins: [
        sveltekit(),
        aggregateOverviewDataPlugin(),
    ]
});
