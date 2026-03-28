export default async (req, res) => {
  const { url, filename } = req.query;

  if (!url || !filename) {
    return res.status(400).json({ error: 'Thiếu tham số' });
  }

  try {
    const imageRes = await fetch(decodeURIComponent(url), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': 'https://shopee.vn/',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!imageRes.ok) {
      return res.status(400).json({ error: 'Không thể tải ảnh' });
    }

    const buffer = await imageRes.arrayBuffer();
    
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.jpg"`);
    res.setHeader('Content-Length', buffer.byteLength);
    
    return res.send(Buffer.from(buffer));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
