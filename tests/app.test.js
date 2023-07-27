// library for making fake HTTP requests
const request = require("supertest");
const makeApp = require("../app");

const mockCreateDonation = jest.fn();
const mockSaveDonation = jest.fn();
const mockGetPaymentIntent = jest.fn();
const mockStripePubKey = "12345abc";

const app = makeApp(
  mockCreateDonation,
  mockSaveDonation,
  mockGetPaymentIntent,
  mockStripePubKey
);

describe("routes", () => {
  describe("forward slash '/'", () => {
    test("should get index", async () => {
      const response = await request(app).get(`/`);
      expect(response.status).toBe(200);
    });
  });

  describe("/pubkey", () => {
    test("should get pubkey", async () => {
      const response = await request(app).get(`/pubkey`);
      expect(response.status).toBe(200);
      expect(response.body.pubKey).toContain(mockStripePubKey);
    });
  });

  describe("/donate", () => {
    beforeEach(() => {
      mockCreateDonation.mockReset();
      mockGetPaymentIntent.mockReset();
    });

    describe("input validation", () => {
      test("should return 422 status if missing donar name, email or amount", async () => {
        const testParams = [
          "first=firstname&last=lastname&amount=5",
          "_replyto=test@gmail.com&first=firstname&last=lastname",
          "_replyto=test@gmail.com&first=firstname&amount=5",
          "_replyto=test@gmail.com&last=lastname&amount=5",
        ];

        testParams.forEach(async (params) => {
          const response = await request(app).post(`/donate`).send(params);
          expect(response.status).toBe(422);
        });
      });

      // TODO: length, letters, int, email format
      // TODO: test should return 200 with valid params
      // figure out why supertest returns 404 with valid params
    });

    test("should get payment intent if params are valid", async () => {
      const params =
        "_replyto=test@gmail.com&first=firstname&last=lastname&amount=5";
      await request(app).post(`/donate`).send(params);

      expect(mockGetPaymentIntent.mock.calls.length).toBe(1);
    });
    test("should create donation record if params are valid", async () => {
      const params =
        "_replyto=test@gmail.com&first=firstname&last=lastname&amount=5";
      await request(app).post(`/donate`).send(params);
      expect(mockCreateDonation.mock.calls.length).toBe(1);
    });
  });

  describe("/thanks", () => {
    test("should get thanks", async () => {
      const response = await request(app).get("/thanks");
      expect(response.status).toBe(200);
    });
  });
});
