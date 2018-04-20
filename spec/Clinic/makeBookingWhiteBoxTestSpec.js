var request = require("request");

var base_url = "http://localhost:3000/";

describe("Booking Controller", function() {
  describe("findBookingByUserId with user that has no current booking", function() {
    it("should return []", function(done) {
      request.post({
                      url: base_url+"findBookingByUserId/",
                      body: {userId:"5ac9cfaa44c89c31ac317aeaEEE"},
                      json: true
                    },function(error, response, body) {
        expect(body).toEqual([]);
        done();
      });
    });
  });
  describe("findBookingByUserId with user that has booking", function() {
    it("should return []", function(done) {
      request.post({
                      url: base_url+"findBookingByUserId/",
                      body: {userId:"5ac9cfaa44c89c31ac317aea"},
                      json: true
                    },function(error, response, body) {
        expect(body.length).not.toBeLessThan(1);
        done();
      });
    });
  });
  
  describe("makebooking with user that has no current booking", function() {
    it("should return booking", function(done) {
      request.post({
                      url: base_url+"createBooking/",
                      body: {userId : "5ac9cfaa44c89c31ac317aea",
                                                clinicId : "5ac8740fcab5e22374ff5a6d",
                                                dateTime : "2018-04-16T16:00:00.000Z",
                                                queNo : 9,
                                                status : "waiting",
                                                estimatedTime : 45},
                      json: true
                    },function(error, response, body) {
        expect(body.userId).toBe("5ac9cfaa44c89c31ac317aea");
        done();
      });
    });
  });
});