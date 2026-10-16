import type { Meta, StoryObj } from "@storybook/react";
import { composeStories, setProjectAnnotations } from "@storybook/react";
import { cleanup } from "@testing-library/react";
import { afterEach, describe, it } from "vitest";

import preview from "../.storybook/preview";

// story の play 関数を Storybook の portable stories で Vitest（jsdom）上で実行する（rules/testing/project.md）。
setProjectAnnotations(preview);

type StoryModule = { default: Meta } & Record<string, StoryObj>;

const storyModules = import.meta.glob<StoryModule>("./**/*.stories.tsx", { eager: true });

afterEach(() => {
  cleanup();
});

describe("story の表示状態", () => {
  const entries = Object.entries(storyModules);

  if (entries.length === 0) {
    it.todo("story がまだ無い");
  }

  for (const [path, storyModule] of entries) {
    describe(path, () => {
      for (const [name, Story] of Object.entries(composeStories(storyModule))) {
        it(name, async () => {
          await Story.run();
        });
      }
    });
  }
});
