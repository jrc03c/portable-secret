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
    </form>
  </div>
`

module.exports = {
  name: "x-encrypt",
  template,

  data() {
    return {
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
  },
}
