import {
  applyPanelOpenBehavior,
  extensionPreferenceMessageType,
} from "@/lib/extension-preferences";

export default defineBackground(() => {
  void applyPanelOpenBehavior();

  browser.runtime.onInstalled.addListener(() => {
    void applyPanelOpenBehavior();
  });

  browser.runtime.onMessage.addListener((message: unknown) => {
    if (
      typeof message === "object" &&
      message !== null &&
      "type" in message &&
      message.type === extensionPreferenceMessageType
    ) {
      void applyPanelOpenBehavior();
    }
  });
});
