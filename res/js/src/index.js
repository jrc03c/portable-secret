const { createApp } = require("vue")
const DecryptView = require("./decrypt")
const EncryptView = require("./encrypt")

window.addEventListener("load", () => {
  const container =
    document.querySelector("#encrypt-app") ||
    document.querySelector("#decrypt-app")

  const template = /* html */ `
    <section class="section">
      <div class="container">
        <h1 class="title">Portable Secret</h1>

        <h2 class="subtitle">
          <a
            href="https://github.com/jrc03c/portable-secret"
            rel="noreferrer"
            target="_blank">
            jrc03c/portable-secret
          </a>
        </h2>

        <hr>

        ${
          container.id === "encrypt-app"
            ? "<x-encrypt></x-encrypt>"
            : "<x-decrypt></x-decrypt>"
        }
      </div>
    </section>
  `

  const app = createApp({
    template,

    components: {
      "x-decrypt": DecryptView,
      "x-encrypt": EncryptView,
    },
  })

  app.mount(container)
})
