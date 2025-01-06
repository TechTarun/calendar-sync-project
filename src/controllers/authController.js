const token = { value: "initial-token", expires: Date.now() + 3600000 };

const generateToken = (req, res) => {
  token.value = "new-token";
  token.expires = Date.now() + 3600000;
  res.json(token);
};

const refreshToken = (req, res) => {
  token.value = "refreshed-token";
  token.expires = Date.now() + 3600000;
  res.json(token);
};

module.exports = {
  generateToken,
  refreshToken,
};