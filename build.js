const { execSync } = require("child_process")
const fs = require("fs")
const process = require("process")
const watch = require("@jrc03c/watch")

function rebuild() {
  console.log("-----")
  console.log(`Rebuilding... (${new Date().toLocaleString()})`)

  try {
    execSync(
      `npx esbuild res/js/src/index.js --bundle --outfile=res/js/bundle.js --minify`,
      { encoding: "utf8" }
    )

    const template = fs.readFileSync("template.html", "utf8")
    const bulmaCSS = fs.readFileSync("res/css/bulma/css/bulma.min.css", "utf8")
    const globalCSS = fs.readFileSync("res/css/global.css", "utf8")
    const bundle = fs.readFileSync("res/js/bundle.js", "utf8")

    const out = template.split("\n").map(line => {
      if (line.includes("{{ ALL_THE_JS }}")) {
        return bundle
      } else if (line.includes("{{ BULMA_CSS }}")) {
        return bulmaCSS
      } else if (line.includes("{{ GLOBAL_CSS }}")) {
        return globalCSS
      } else {
        return line
      }
    }).join("\n")

    fs.writeFileSync("template-bundle.html", out, "utf8")
    console.log("\nDone! 🎉\n")
  } catch (e) {
    console.error(e)
  }
}

if (process.argv.indexOf("-w") > -1 || process.argv.indexOf("--watch") > -1) {
  watch({
    target: ".",
    exclude: ["node_modules", "bundle.js", "template-bundle.html"],
    created: rebuild,
    modified: rebuild,
    deleted: rebuild,
  })
}

rebuild()
