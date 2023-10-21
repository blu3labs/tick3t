function h2d(s) {
    function add(x, y) {
      var c = 0,
        r = [];
      var x = x.split("").map(Number);
      var y = y.split("").map(Number);
      while (x.length || y.length) {
        var s = (x.pop() || 0) + (y.pop() || 0) + c;
        r.unshift(s < 10 ? s : s - 10);
        c = s < 10 ? 0 : 1;
      }
      if (c) r.unshift(c);
      return r.join("");
    }

    var dec = "0";
    s.split("").forEach(function (chr) {
      var n = parseInt(chr, 16);
      for (var t = 8; t; t >>= 1) {
        dec = add(dec, dec);
        if (n & t) dec = add(dec, "1");
      }
    });
    return dec;
  }



export const generateSalt = () => {
    const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    const hex = genRanHex(64)
    const dec = h2d(hex)
    return dec
}