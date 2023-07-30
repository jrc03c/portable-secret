const { decrypt } = require("@jrc03c/js-crypto-helpers")

const template = /* html */ `
  <div>
    <form @submit.prevent="decrypt" class="mb-5" v-if="!isDone">
      <div class="field">
        <label class="label">Password:</label>

        <div class="control">
          <input
            @input="message = ''"
            autofocus
            class="input"
            type="password"
            placeholder="password"
            ref="password"
            v-model="password">
        </div>
      </div>

      <div class="field">
        <div class="control">
          <button
            :disabled="password.trim().length === 0"
            class="button is-warning"
            ref="submit"
            type="submit">
            Decrypt
          </button>
        </div>
      </div>

      <div class="is-danger is-light notification" v-if="message.length > 0">
        {{ message }}
      </div>
    </form>

    <div class="is-light is-success notification" v-if="isDone">
      Done! &nbsp; 🎉
    </div>
  </div>
`

module.exports = {
  name: "x-decrypt",
  template,

  data() {
    return {
      isDone: false,
      message: "",
      password: "",
    }
  },

  methods: {
    async decrypt() {
      if (this.password.trim().length === 0) {
        this.$refs.password.focus()
        this.$refs.password.select()
        return
      }

      this.$refs.password.disabled = true
      this.$refs.password.readOnly = true
      this.$refs.submit.disabled = true
      this.$refs.submit.classList.add("is-loading")

      try {
        // eslint-disable-next-line no-undef
        const out = await decrypt(encrypted, this.password)
        console.log(out)
        this.isDone = true
      } catch (e) {
        this.message = e.toString()
        this.$refs.password.disabled = false
        this.$refs.password.readOnly = false
        this.$refs.submit.disabled = false
        this.$refs.submit.classList.remove("is-loading")
        this.$refs.password.focus()
        this.$refs.password.select()
      }
    },
  },
}
