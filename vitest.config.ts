import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        exclude: [
            ...configDefaults.exclude,
            "dist/**",
            "frontend/**",
            // Fully commented out (legacy modules); no test suite to run.
            "src/modules/publication/__tests__/publication.service.test.ts",
            "src/modules/researchers/__tests__/researchers.service.test.ts",
        ],
    },
});
