// path: cypress.config.ts
import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        baseUrl: "http://localhost:3005",
        video: true,
        videoCompression: false,
        defaultCommandTimeout: 10000,
        setupNodeEvents(on, config) {
            on('task', {
                logTimeline(arg: any) {
                    const { message, timestamp } = arg;
                    const fs = require('fs');
                    const timelineFile = 'timeline.json';
                    let timeline = [];

                    if (fs.existsSync(timelineFile)) {
                        try {
                            timeline = JSON.parse(fs.readFileSync(timelineFile, 'utf8'));
                        } catch (e) {
                            timeline = [];
                        }
                    }

                    timeline.push({ message, timestamp });
                    fs.writeFileSync(timelineFile, JSON.stringify(timeline, null, 2));
                    return null;
                },
                clearTimeline() {
                    const fs = require('fs');
                    const timelineFile = 'timeline.json';
                    if (fs.existsSync(timelineFile)) {
                        fs.unlinkSync(timelineFile);
                    }
                    return null;
                }
            });
        },
    },
});
