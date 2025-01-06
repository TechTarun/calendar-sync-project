class Auth {
  static token = { value: "initial-token", expires: Date.now() + 3600000 };

  static getAccessToken() {
    if (Date.now() > Auth.token.expires) {
      console.warn("Access token expired. Refreshing token...");
      return this.refreshAccessToken();
    }
    return Auth.token.value;
  }

  static refreshAccessToken() {
    Auth.token = { value: "refreshed-token", expires: Date.now() + 3600000 };
    console.log("Token refreshed successfully.");
    return Auth.token.value;
  }
}

  module.exports = { Auth };