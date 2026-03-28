export default async (req, res) => {
  // Chỉ cho phép POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  // Kiểm tra input
  if (!url) {
    return res.status(400).json({ error: 'URL không được để trống' });
  }

  try {
    // Gọi fetch để theo dõi redirect
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
      },
      // Timeout 10 giây
      signal: AbortSignal.timeout(10000),
    });

    const expandedUrl = response.url;

    return res.status(200).json({
      success: true,
      expandedUrl: expandedUrl,
    });
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Không thể mở rộng URL: ' + error.message,
    });
  }
};
