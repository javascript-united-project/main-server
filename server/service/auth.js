const { hash, compare } = require("bcryptjs");

const User = require("../models/User");

const register = async (username, password, name) => {
  try {
    if (password.length < 6)
      throw new Error("비밀번호를 최소 6자 이상으로 해주세요.");
    if (username.length < 3)
      throw new Error("username은 3자 이상으로 해주세요.");

    const user = await User.findOne({ where: { username } });
    if (user)
      throw new Error("이미 등록된 사용자 아이디입니다.");

    const hashedPassword = await hash(password, 10);
    return await User.create({
      name,
      username,
      hashedPassword
    });
  } catch (err) {
    return Promise.reject(err.message);
  }
}

const login = async (username, password) => {
  try {
    const user = await User.findOne({ where: { username } });
    if (!user)
      throw new Error("가입되지 않은 아이디입니다.");

    const isValid = await compare(password, user.hashedPassword);
    if (!isValid)
      throw new Error("입력하신 정보가 올바르지 않습니다.");

    return user;
  } catch (err) {
    return Promise.reject(err.message);
  }
}

module.exports = { register, login };