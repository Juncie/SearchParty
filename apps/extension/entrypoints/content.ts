export default defineContentScript({
  matches: ["http://localhost:3001/*"],
  main() {
    console.info("SearchParty content script loaded.");
  },
});
