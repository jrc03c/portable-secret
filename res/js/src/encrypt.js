const { encrypt } = require("@jrc03c/js-crypto-helpers")

function downloadHTML(filename, text) {
  const a = document.createElement("a")
  a.href = "data:text/html;charset=utf-8," + encodeURIComponent(text)
  a.download = filename
  a.dispatchEvent(new MouseEvent("click"))
}

function readFile(file, mode) {
  mode = mode || "array-buffer"

  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader()
      reader.onload = event => resolve(event.target.result)

      if (mode === "array-buffer") {
        reader.readAsArrayBuffer(file)
      } else if (mode === "binary-string") {
        reader.readAsBinaryString(file)
      } else if (mode === "data-url") {
        reader.readAsDataURL(file)
      } else if (mode === "text") {
        reader.readAsText(file)
      }
    } catch (e) {
      return reject(e)
    }
  })
}

const template = /* html */ `
  <div>
    <form @submit.prevent="encrypt" v-if="!isDone">
      <p>
        <b style="margin-right: 0.75rem;">Input type:</b>

        <label class="radio">
          <input
            name="input-type"
            ref="textRadio"
            type="radio"
            v-model="inputType"
            value="text">
          Text
        </label>

        <label class="radio">
          <input
            name="input-type"
            ref="fileRadio"
            type="radio"
            v-model="inputType"
            value="file">
          File
        </label>
      </p>

      <p>
        <textarea
          autofocus
          class="textarea"
          placeholder="Type your secret message here."
          ref="textarea"
          v-if="inputType === 'text'"
          v-model="text">
        </textarea>

        <div v-if="inputType === 'file'">
          <button
            :class="{ 'is-primary': !file, 'is-dark': !!file }"
            @click.prevent.stop="selectFile"
            class="button"
            ref="fileButton">
            {{ file ? file.name : "Select file..." }}
          </button>
        </div>
      </p>

      <p>
        <div class="field">
          <label class="label">
            Password:
          </label>

          <div class="control">
            <input
              :class="{ 'is-success': password1.trim().length > 0 }"
              @input="message = ''"
              class="input"
              placeholder="password"
              ref="password1"
              type="password"
              v-model="password1">
          </div>
        </div>

        <div class="field">
          <div class="control">
            <input
              :class="{
                'is-danger':
                  password1.trim().length > 0 &&
                  password2 !== password1,
                'is-success':
                  password1.trim().length > 0 &&
                  password2 === password1
              }"
              @input="message = ''"
              @keydown.prevent.stop.enter="encrypt"
              class="input"
              placeholder="confirm password"
              ref="password2"
              type="password"
              v-model="password2">
          </div>
        </div>
      </p>

      <p>
        <button
          :disabled="
            (inputType === 'text' && !text) ||
            (inputType === 'file' && !file) ||
            password1.trim().length === 0 ||
            password2 !== password1
          "
          class="button is-warning"
          ref="submit"
          type="submit">
          Encrypt
        </button>
      </p>

      <div class="is-danger is-light notification" v-if="message.length > 0">
        {{ message }}
      </div>
    </form>

    <div class="is-light is-success notification" v-else>
      Done! &nbsp; 🎉
    </div>
  </div>
`

module.exports = {
  name: "x-encrypt",
  template,

  data() {
    return {
      file: null,
      inputType: "text",
      isDone: false,
      message: "",
      password1: "",
      password2: "",
      text: "",
    }
  },

  watch: {
    inputType() {
      if (this.inputType === "text") {
        setTimeout(() => {
          this.$refs.textarea.focus()
        }, 100)
      }
    },
  },

  methods: {
    disableFormControls() {
      this.$refs.textRadio.disabled = true
      this.$refs.textRadio.readOnly = true
      this.$refs.fileRadio.disabled = true
      this.$refs.fileRadio.readOnly = true
      this.$refs.password1.disabled = true
      this.$refs.password1.readOnly = true
      this.$refs.password2.disabled = true
      this.$refs.password2.readOnly = true
      this.$refs.submit.disabled = true
      this.$refs.submit.classList.add("is-loading")

      if (this.inputType === "text") {
        this.$refs.textarea.disabled = true
        this.$refs.textarea.readOnly = true
      }

      if (this.inputType === "file") {
        this.$refs.fileButton.disabled = true
      }
    },

    enableFormControls() {
      this.$refs.textRadio.disabled = false
      this.$refs.textRadio.readOnly = false
      this.$refs.fileRadio.disabled = false
      this.$refs.fileRadio.readOnly = false
      this.$refs.password1.disabled = false
      this.$refs.password1.readOnly = false
      this.$refs.password2.disabled = false
      this.$refs.password2.readOnly = false
      this.$refs.submit.disabled = false
      this.$refs.submit.classList.remove("is-loading")

      if (this.inputType === "text") {
        this.$refs.textarea.disabled = false
        this.$refs.textarea.readOnly = false
      }

      if (this.inputType === "file") {
        this.$refs.fileButton.disabled = false
      }
    },

    async encrypt() {
      if (this.password1.trim().length === 0) {
        this.$refs.password1.focus()
        this.$refs.password1.select()
        return
      }

      if (this.password2 !== this.password1) {
        this.$refs.password2.focus()
        this.$refs.password2.select()
        return
      }

      this.disableFormControls()

      const response = await fetch("template-bundle.html")
      const template = await response.text()

      if (response.status !== 200) {
        this.message = template
        this.enableFormControls()
        this.$refs.password2.focus()
        this.$refs.password2.select()
        return
      }

      // encrypt text
      if (this.inputType === "text") {
        try {
          const encrypted = await encrypt(this.text, this.password1)
          const out = template.replaceAll("{{ ENCRYPTED_DATA }}", encrypted)
          this.isDone = true
          return downloadHTML("secret.html", out)
        } catch (e) {
          this.message = e.toString()
          this.enableFormControls()
          this.$refs.password2.focus()
          this.$refs.password2.select()
          return
        }
      }

      // encrypt file
      else if (this.inputType === "file") {
        try {
          const raw = await readFile(this.file)

          const encrypted = await encrypt(
            {
              name: this.file.name,
              data: raw,
            },
            this.password1,
          )

          const out = template.replaceAll("{{ ENCRYPTED_DATA }}", encrypted)
          this.isDone = true
          return downloadHTML(this.file.name + ".html", out)
        } catch (e) {
          this.message = e.toString()
          this.enableFormControls()
          this.$refs.password2.focus()
          this.$refs.password2.select()
          return
        }
      }
    },

    selectFile() {
      const input = document.createElement("input")
      input.type = "file"

      input.addEventListener("input", () => {
        if (input.files.length > 0) {
          this.file = input.files[0]
        }
      })

      input.dispatchEvent(new MouseEvent("click"))
    },
  },
}
