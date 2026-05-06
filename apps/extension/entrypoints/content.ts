export default defineContentScript({
  matches: ["http://localhost:4310/*"],
  main() {
    console.info("SearchParty content script loaded.");
  },
});
