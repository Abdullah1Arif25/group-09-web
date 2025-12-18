<template>
  <div class="settings">
    <div class="card">
      <h2>Settings</h2>

      <button @click="main">Main Page</button>
      <button @click="logout">Log out</button>
      <button @click="cancel">Cancel</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SettingsPopup",

  methods: {
    main() {
      this.$router.push("/main");
    },
    logout() {
      this.$router.push("/");
    },
    cancel() {
      this.$emit("close");
    }
  }
};
</script>

<style scoped>
.settings {
  position: fixed;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.card {
  background: #6d2a46;
  padding: 24px;
  width: 280px;
  border-radius: 28px;
  text-align: center;
  color: #fadde8;
}

.card button {
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background: #fadde8;
}
</style>
