const axios = require("axios");
const { v4: uuid } = require("uuid");
const routers = require("./routers.json");
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 3000;
const baseURL = `http://localhost:${port}/api/v1`;

const api = axios.create({ baseURL });

const generateIdRandom = () => {
  return Math.floor(Math.random() * 1000000);
};

const handleValues = (data, id) => {
  const list = Object.entries(data).map(([key, value]) => {
    if (value === "{{ID}}") return [key, id];
    else if (typeof value !== "string") return [key, value];
    const newValue = value.replace(/{{(.*?)}}/g, (match, content) => {
      return content
        .replace("ID", id)
        .replace(/D/g, () => Math.floor(Math.random(0, 9) * 10));
    });
    return [key, newValue];
  });
  return Object.fromEntries(list);
};

const createData = async (router, data, id) => {
  try {
    const newData = handleValues(data, id);
    await api.post(router, newData);
    return "OK";
  } catch (error) {
    if (error.response.status === 409) {
      return "OK";
    }
  }
  return null;
};

const deleteData = async (router, id) => {
  try {
    await api.delete(`${router}/${id}`);
    return "OK";
  } catch (error) {
    if (error.response.status === 404) {
      return "OK";
    }
  }
};

const id = generateIdRandom();

describe.each(routers)(
  "Tests for router: $router",
  ({ router, data, update }) => {
    beforeAll(async () => {
      const objUser = {
        email: `${uuid()}@gmail.com`,
        password: uuid(),
        name: "tester",
      };

      const register = await api.post("/register", objUser);
      expect(register.status).toBe(201);

      const response = await api.post("/login", objUser);
      expect(response.data).toHaveProperty("token");
      expect(response.status).toBe(201);

      const { token } = response.data;
      const string = `Bearer ${token}`;
      api.defaults.headers.common.Authorization = string;
    });

    it("Method get for list records", async () => {
      const response = await api.get(router);
      expect(response.status).toBe(200);
      expect(response.data).toBeInstanceOf(Array);
    });

    it("Create a record successfully", async () => {
      const newData = handleValues(data, id);
      const response = await api.post(router, newData);

      expect(response.status).toBe(201);
      expect(response.data).toBeInstanceOf(Object);

      Object.keys(data).forEach((key) => {
        expect(response.data).toHaveProperty(key);
        expect(response.data[key]).toBe(newData[key]);
      });
    });

    describe("Tests for routers using id", () => {
      beforeEach(async () => {
        await deleteData(router, id);
        await createData(router, data, id);
      });

      it("Get one record successfully", async () => {
        const response = await api.get(`${router}/${id}`);

        expect(response.status).toBe(200);
        expect(response.data).toBeInstanceOf(Object);

        Object.keys(data).forEach((field) => {
          expect(response.data).toHaveProperty(field);
        });
      });

      it("Update some record properties with successfully", async () => {
        const newData = handleValues(update, id);
        const response = await api.patch(`${router}/${id}`, newData);

        expect(response.status).toBe(203);
        expect(response.data).toBeInstanceOf(Object);

        Object.keys(update).forEach((field) => {
          expect(response.data).toHaveProperty(field);
          expect(response.data[field]).toBe(update[field]);
        });
      });

      it("Update all record properties with successfully", async () => {
        const newData = handleValues({ ...data, ...update }, id);
        const response = await api.patch(`${router}/${id}`, newData);

        expect(response.status).toBe(203);
        expect(response.data).toBeInstanceOf(Object);

        Object.keys(newData).forEach((field) => {
          expect(response.data).toHaveProperty(field);
          expect(response.data[field]).toBe(newData[field]);
        });
      });

      it("Delete a record successfully", async () => {
        const response = await api.delete(`${router}/${id}`);
        expect(response.status).toBe(204);
        expect(response.data).toBe("");
      });

      it("Try update record not exists", async () => {
        const idRandom = generateIdRandom();
        try {
          await api.patch(`${router}/${idRandom}`, update);
          throw new Error("Error common");
        } catch (error) {
          expect(error).toBeInstanceOf(axios.AxiosError);
          expect(error.response.status).toBe(404);
        }
      });

      it("Try get record not exists", async () => {
        const idRandom = generateIdRandom();
        try {
          await api.get(`${router}/${idRandom}`);
          throw new Error("Error common");
        } catch (error) {
          expect(error).toBeInstanceOf(axios.AxiosError);
          expect(error.response.status).toBe(404);
        }
      });

      it("Try delete record after deleting", async () => {
        const response = await api.delete(`${router}/${id}`);
        expect(response.status).toBe(204);
        expect(response.data).toBe("");

        try {
          await api.delete(`${router}/${id}`);
          throw new Error("Error common");
        } catch (error) {
          expect(error).toBeInstanceOf(axios.AxiosError);
          expect(error.response.status).toBe(404);
        }
      });
    });

    afterAll(() => {
      createData(router, data, id);
    });
  }
);
