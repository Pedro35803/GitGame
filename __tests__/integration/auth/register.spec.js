const { v4: uuid } = require("uuid");
const axios = require("axios");

const { baseURL } = require("../config");

const api = axios.create({ baseURL });

const generateEmail = () => {
  return `${uuid()}@gmail.com`;
};

const genObjUser = () => {
  return {
    name: "Tester",
    email: generateEmail(),
    password: uuid(),
  };
};

describe("Tests for router /register", () => {
  it("Register user whit success", async () => {
    const userObj = genObjUser();
    const response = await api.post("/register", userObj);
    const user = response.data;

    const expectProperty = ["id", "email", "name", "picture"];
    expectProperty.forEach((key) => expect(user).toHaveProperty(key));

    expect(user.id).not.toBeNull();
    expect(user.picture).toContain("/images/");
    expect(user.email).toEqual(userObj.email);
    expect(user.name).toEqual(userObj.name);
  });

  it("Conflict email when register user", async () => {
    const userObj = genObjUser();
    try {
      await api.post("/register", userObj);
      await api.post("/register", userObj);
    } catch (error) {
      const { status } = error.response;
      expect(status).toEqual(409);
    }
  });

  it("Register user anonymous whit success", async () => {
    const response = await api.post("/register/anonymous");
    const user = response.data;

    const expectProperty = ["id", "token", "picture"];
    expectProperty.forEach((key) => expect(user).toHaveProperty(key));

    expect(user.id).not.toBeNull();
    expect(user.token).not.toBeUndefined();
    expect(user.picture).toContain("/images/");
  });
});
