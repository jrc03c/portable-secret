const { encrypt } = require("@jrc03c/js-crypto-helpers")

const template = /* html */ `
  <div>
    <form @submit.prevent="encrypt">
      <div class="control">
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
      </div>
    </form>
  </div>
`

module.exports = {
  name: "x-encrypt",
  template,

  data() {
    return {
      inputType: "text",
    }
  },

  methods: {
    encrypt() {},
  },
}
