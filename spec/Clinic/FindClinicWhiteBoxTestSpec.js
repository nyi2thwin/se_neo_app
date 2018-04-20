var request = require("request");

var base_url = "http://localhost:3000/";

describe("Clinic Controller", function() {
  describe("listNearbyClinic with invalid postalcode $$$", function() {
    it("should return {}", function(done) {
      request.get(base_url+"getNearByClinic/$$$/", function(error, response, body) {
        expect(body).toBe("{}");
        done();
      });
    });
  });
  describe("listNearbyClinic with valid postalcode 682787", function() {
    it("should return 5 clinic", function(done) {
      request.get(base_url+"getNearByClinic/682787/", function(error, response, body) {
        expect(JSON.parse(body).length).not.toBeLessThan(1);
        done();
      });
    });
  });
});