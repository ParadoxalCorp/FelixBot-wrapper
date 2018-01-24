let FelixWrapper = require("./index.js");

FelixWrapper = new FelixWrapper({
    url: "http://DESKTOP-PS9CVL6:8080",
    token: "E0Vs26lu2bj7bA5_$$7233UX6.Ij0q0ms679n4V0Z10HX0V$u7.0WA32F6-X96-3pi3wI12c3L$.l0385_7hJ4-Sn5u556SF45D9.2s79EO22514Dbp-r57i-z85v.TU2q6b842P9Um8d3uu8SP3Z2.6GLs34562x7sf1BZ7l40U3X-.3C62i-v18Bn3Ek2u9t69d8-u.w76I76P9UL0Z90AP3414X415.B7L65O3kQD92O9dm9o1_6vM9.R60m060sq",
    autoConversion: false
});

(async function() {
    let uwu = await FelixWrapper.status();
    console.log(uwu);
}());