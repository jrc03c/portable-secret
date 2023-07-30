const { encrypt } = require("@jrc03c/js-crypto-helpers")

const template = /* html */ `
  <div>
    <form @submit.prevent="encrypt">
      <p>
        <b style="margin-right: 0.75em;">Input type:</b>

        <label class="radio">
          <input
            name="input-type"
            type="radio"
            v-model="inputType"
            value="text">
          Text
        </label>

        <label class="radio">
          <input
            name="input-type"
            type="radio"
            v-model="inputType"
            value="file">
          File
        </label>
      </p>

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
          @click="selectFile"
          class="button">
          {{ file ? file.name : "Select file..." }}
        </button>
      </div>
    </form>
  </div>
`

module.exports = {
  name: "x-encrypt",
  template,

  data() {
    return {
      file: null,
      inputType: "text",
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
    encrypt() {},

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
